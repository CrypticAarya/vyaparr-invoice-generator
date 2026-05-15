import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import auditLogger from '../utils/auditLogger.js';
import UserService from '../services/UserService.js';

/**
 * AUTHENTICATION CONTROLLER
 * 
 * Manages the security perimeter of the application. 
 * We use a dual-token strategy: 
 * - Access Tokens: Short-lived (15m) for API authorization.
 * - Refresh Tokens: Long-lived (7d) stored in secure httpOnly cookies.
 */

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

/**
 * Helper: Signs a pair of JWTs for a user session.
 */
const generateSessionTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

/**
 * Helper: Attaches the refresh token to the response as a secure cookie.
 */
const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // Match JWT expiry (7 days)
  });
};

export const signupUser = catchAsync(async (req, res, next) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return next(new AppError('Please provide your name, email, and a secure password.', 400));
  }

  // Prevent duplicate registrations
  const duplicate = await UserService.findByEmail(email);
  if (duplicate) {
    return next(new AppError('This email is already in use. Try logging in instead.', 400));
  }

  const user = await UserService.createUser({ name, email, password });
  const { accessToken, refreshToken } = generateSessionTokens(user.id);
  
  await UserService.updateRefreshToken(user.id, refreshToken);
  setRefreshCookie(res, refreshToken);

  auditLogger.log('SIGNUP_COMPLETE', { userId: user.id, email: user.email });

  res.status(201).json({
    success: true,
    data: {
      token: accessToken,
      user: { id: user.id, name: user.name, email: user.email, isOnboarded: false }
    }
  });
});

export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please enter both your email and password.', 400));
  }

  const user = await UserService.findByEmail(email);
  if (!user || !(await UserService.verifyPassword(user, password))) {
    auditLogger.log('LOGIN_FAILED', { email });
    return next(new AppError('Invalid email or password. Please try again.', 401));
  }

  const { accessToken, refreshToken } = generateSessionTokens(user.id);
  await UserService.updateRefreshToken(user.id, refreshToken);
  setRefreshCookie(res, refreshToken);

  auditLogger.log('LOGIN_SUCCESS', { userId: user.id });

  res.json({
    success: true,
    data: {
      token: accessToken,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        isOnboarded: user.isOnboarded,
        businessName: user.businessName
      }
    }
  });
});

/**
 * REFRESH SESSION
 * Exchanges the secure refresh cookie for a new access token.
 * This happens automatically in the background on the frontend.
 */
export const refreshToken = catchAsync(async (req, res, next) => {
  const cookieToken = req.cookies.refreshToken;
  
  if (!cookieToken) {
    return next(new AppError('Session expired. Please log in again.', 401));
  }

  try {
    const decoded = jwt.verify(cookieToken, REFRESH_SECRET);
    const user = await UserService.findById(decoded.id);

    // Verify token matches the one in our database (security check)
    if (!user || user.refreshToken !== cookieToken) {
      return next(new AppError('Invalid session. Security breach suspected.', 401));
    }

    const tokens = generateSessionTokens(user.id);
    await UserService.updateRefreshToken(user.id, tokens.refreshToken);
    setRefreshCookie(res, tokens.refreshToken);

    res.json({
      success: true,
      data: { token: tokens.accessToken }
    });
  } catch (err) {
    return next(new AppError('Your session is no longer valid.', 401));
  }
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const updates = req.body;

  // Whitelist updateable fields
  const allowed = ['businessName', 'businessAddress', 'businessType', 'upiId', 'bankDetails'];
  const profileToUpdate = {};
  allowed.forEach(key => {
    if (updates[key] !== undefined) profileToUpdate[key] = updates[key];
  });
  profileToUpdate.isOnboarded = true;

  const user = await UserService.updateProfile(userId, profileToUpdate);
  
  auditLogger.log('PROFILE_MODIFIED', { userId: user.id });

  res.json({
    success: true,
    data: {
      user: {
        id: user.id, 
        name: user.name, 
        email: user.email, 
        isOnboarded: user.isOnboarded,
        businessName: user.businessName
      }
    }
  });
});

export const logoutUser = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  if (userId) {
    await UserService.updateRefreshToken(userId, null);
  }

  // Purge the refresh cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax'
  });

  res.json({ success: true, message: 'Signed out successfully.' });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await UserService.findByEmail(req.body.email);
  if (!user) {
    return next(new AppError('No account exists with that email address.', 404));
  }

  const token = await UserService.generateSecureToken(user.id, 'passwordReset');

  auditLogger.log('RESET_LINK_GENERATED', { userId: user.id });

  res.json({ 
    success: true, 
    message: 'Check your email for the reset link.',
    demoToken: token 
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await UserService.findByResetToken(hashedToken);

  if (!user) {
    return next(new AppError('This link is invalid or has expired.', 400));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  await UserService.updateProfile(user.id, {
    password: hashedPassword,
    passwordResetToken: null,
    passwordResetExpires: null
  });

  auditLogger.log('PASSWORD_CHANGED', { userId: user.id });

  res.json({ success: true, message: 'Password updated. You can now log in.' });
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await UserService.findByVerificationToken(hashedToken);

  if (!user) {
    return next(new AppError('Verification link is dead or expired.', 400));
  }

  await UserService.updateProfile(user.id, {
    isVerified: true,
    verificationToken: null,
    verificationExpires: null
  });

  auditLogger.log('ACCOUNT_VERIFIED', { userId: user.id });

  res.json({ success: true, message: 'Email verified. Welcome to VyapaarFlow!' });
});

import { seedUserData } from '../utils/seeder.js';
export const seedUser = catchAsync(async (req, res, next) => {
  const results = await seedUserData(req.user.id);
  res.json({
    success: true,
    message: 'Demo environment ready.',
    data: results
  });
});
