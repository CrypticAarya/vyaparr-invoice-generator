import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

const ACCESS_SECRET = process.env.JWT_SECRET || 'access_secret_key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret_key';

const signTokens = (id) => {
  const accessToken = jwt.sign({ id }, ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id }, REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const signupUser = catchAsync(async (req, res, next) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return next(new AppError('All fields are required.', 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    logger.log('SIGNUP_FAILURE', { email, reason: 'DUPLICATE_EMAIL' });
    return next(new AppError('Email already registered.', 400));
  }

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
  
  const vToken = newUser.createToken('verification');
  await newUser.save({ validateBeforeSave: false });

  logger.log('SIGNUP_SUCCESS', { userId: newUser._id, email: newUser.email });

  res.status(201).json({
    success: true,
    data: {
      token: accessToken,
      refreshToken,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, isVerified: false }
    }
  });
});

export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    logger.log('LOGIN_FAILURE', { email });
    return next(new AppError('Invalid credentials.', 401));
  }

  const { accessToken, refreshToken } = signTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  logger.log('LOGIN_SUCCESS', { userId: user._id, email: user.email });

  res.json({
    success: true,
    data: {
      token: accessToken,
      refreshToken,
      user: { 
        id: user._id, name: user.name, email: user.email, role: user.role, 
        isVerified: user.isVerified, isOnboarded: user.isOnboarded 
      }
    }
  });
});

export const refreshAccessToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError('Refresh token required.', 400));
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      logger.log('TOKEN_REFRESH_FAILURE', { reason: 'INVALID_TOKEN' });
      return next(new AppError('Invalid refresh token.', 401));
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
    logger.log('TOKEN_REFRESH_FAILURE', { reason: 'EXPIRED_OR_MALFORMED' });
    return next(new AppError('Invalid or expired refresh token.', 401));
  }
});

export const logoutUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user) {
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });
    logger.log('LOGOUT_SUCCESS', { userId: user._id });
  }

  res.json({ success: true, message: 'Logged out successfully.' });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No user found with that email.', 404));
  }

  const resetToken = user.createToken('passwordReset');
  await user.save({ validateBeforeSave: false });

  logger.log('PASSWORD_RESET_REQUESTED', { userId: user._id, email: user.email });

  res.json({ success: true, message: 'Reset token sent to email.' });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    logger.log('PASSWORD_RESET_FAILURE', { reason: 'INVALID_TOKEN' });
    return next(new AppError('Token is invalid or has expired.', 400));
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  
  await user.save();

  logger.log('PASSWORD_RESET_SUCCESS', { userId: user._id });

  res.json({ success: true, message: 'Password reset successful.' });
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired.', 400));
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  logger.log('EMAIL_VERIFIED', { userId: user._id });

  res.json({ success: true, message: 'Email verified successfully.' });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const { businessName, businessAddress, businessType, upiId, bankDetails } = req.body;
  
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('User profile not found.', 404));
  }

  user.businessName = businessName;
  user.businessAddress = businessAddress;
  user.businessType = businessType || user.businessType;
  user.upiId = upiId;
  user.bankDetails = bankDetails;
  user.isOnboarded = true;

  await user.save();
  
  res.json({
    success: true,
    data: {
      user: {
        id: user._id, name: user.name, email: user.email, role: user.role,
        isVerified: user.isVerified, isOnboarded: user.isOnboarded,
        businessName: user.businessName, businessAddress: user.businessAddress,
        businessType: user.businessType, upiId: user.upiId, bankDetails: user.bankDetails
      }
    }
  });
});
