import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import auditLogger from '../utils/auditLogger.js';

// SECURE TOKEN CONFIGURATION:
// We use a short-lived access token and a longer-lived refresh token for optimal security.
const ACCESS_SECRET = process.env.JWT_SECRET || 'fallback_access_key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'fallback_refresh_key';

const signTokens = (id) => {
  const accessToken = jwt.sign({ id }, ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id }, REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

/**
 * 1. User Registration
 * Handles initial account creation and creates an audit trail for compliance.
 */
export const signupUser = catchAsync(async (req, res, next) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return next(new AppError('All mandatory fields (Name, Email, Password) must be filled.', 400));
  }

  // We check for duplicates early to avoid unnecessary hashing overhead.
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    auditLogger.log('SIGNUP_ATTEMPT_DUPLICATE', { email });
    return next(new AppError('This email is already associated with an account.', 400));
  }

  // Security: Standard bcrypt hashing with a salt factor of 10.
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'user'
  });

  const { accessToken, refreshToken } = signTokens(newUser._id);
  newUser.refreshToken = refreshToken;
  
  // Create a verification token for future email confirmation flows.
  newUser.createToken('verification');
  await newUser.save({ validateBeforeSave: false });

  auditLogger.log('SIGNUP_SUCCESS', { userId: newUser._id, email: newUser.email });

  res.status(201).json({
    success: true,
    data: {
      token: accessToken,
      refreshToken,
      user: { 
        id: newUser._id, 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role, 
        isVerified: false,
        isOnboarded: false 
      }
    }
  });
});

/**
 * 2. User Authentication (Login)
 * Validates credentials and initializes the secure session.
 */
export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide both your email and password to continue.', 400));
  }

  // We explicitly select '+password' because it's hidden by default in the schema for security.
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    auditLogger.log('LOGIN_FAILURE_INVALID_CREDENTIALS', { email });
    return next(new AppError('The credentials provided do not match our records.', 401));
  }

  const { accessToken, refreshToken } = signTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  auditLogger.log('LOGIN_SUCCESS', { userId: user._id, email: user.email });

  res.json({
    success: true,
    data: {
      token: accessToken,
      refreshToken,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        isVerified: user.isVerified, 
        isOnboarded: user.isOnboarded 
      }
    }
  });
});

/**
 * 3. Token Lifecycle Management
 * Silent refresh to keep the user logged in without frequent credential prompts.
 */
export const refreshAccessToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError('Session expired. Please log in again.', 400));
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    // Security: Check if the token matches the one stored in our DB (Revocation Check).
    if (!user || user.refreshToken !== refreshToken) {
      auditLogger.log('REFRESH_FAILURE_TOKEN_MISMATCH', { userId: decoded.id });
      return next(new AppError('Invalid session. For your security, please log in again.', 401));
    }

    const tokens = signTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      data: {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    });
  } catch (err) {
    auditLogger.log('REFRESH_FAILURE_EXPIRED', { reason: err.message });
    return next(new AppError('Your session has expired. Please log in.', 401));
  }
});

/**
 * 4. Profile & Business Settings
 * Updates the user's business identity after onboarding or from settings.
 */
export const updateProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('Could not locate your user profile.', 404));
  }

  // We only update fields that were actually provided in the request.
  const fields = ['businessName', 'businessAddress', 'businessType', 'upiId', 'bankDetails'];
  fields.forEach(field => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  user.isOnboarded = true; // Flag as complete once profile is first saved.
  await user.save();
  
  auditLogger.log('PROFILE_UPDATE_SUCCESS', { userId: user._id });

  res.json({
    success: true,
    data: {
      user: {
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        isVerified: user.isVerified, 
        isOnboarded: user.isOnboarded,
        businessName: user.businessName, 
        businessAddress: user.businessAddress,
        businessType: user.businessType, 
        upiId: user.upiId, 
        bankDetails: user.bankDetails
      }
    }
  });
});

/**
 * 5. Secure Logout
 * Invalidates the refresh token to end the session immediately.
 */
export const logoutUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user) {
    user.refreshToken = undefined; // Revoke the token
    await user.save({ validateBeforeSave: false });
    auditLogger.log('LOGOUT_SUCCESS', { userId: user._id });
  }

  res.json({ success: true, message: 'Session closed successfully.' });
});
