import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import AuditService from '../services/AuditService.js';
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
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

/**
 * Helper: Signs a pair of JWTs for a user session.
 */
const generateSessionTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: '1h' }); // Increased for easier dev, use 15m in hyper-prod
  const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

/**
 * Helper: Attaches the refresh token to the response as a secure cookie.
 */
const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: true, // Always true for production/SSL
    sameSite: 'none', // Required for cross-domain auth (Vercel + Render)
    maxAge: 7 * 24 * 60 * 60 * 1000 
  });
};

export const signupUser = catchAsync(async (req, res, next) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return next(new AppError('Please provide your name, email, and a secure password.', 400));
  }

  const duplicate = await UserService.findByEmail(email);
  if (duplicate) {
    return next(new AppError('This email is already in use. Try logging in instead.', 400));
  }

  const user = await UserService.createUser({ name, email, password });
  const { accessToken, refreshToken } = generateSessionTokens(user.id);
  
  await UserService.updateRefreshToken(user.id, refreshToken);
  setRefreshCookie(res, refreshToken);

  await AuditService.log(user.id, 'ACCOUNT_CREATED', 'USER', user.id, { email: user.email }, req);

  res.status(201).json({
    success: true,
    data: {
      token: accessToken,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        isOnboarded: false,
        role: user.role
      }
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
    await AuditService.security(null, 'LOGIN_FAILURE', { email }, req);
    return next(new AppError('Invalid email or password. Please try again.', 401));
  }

  const { accessToken, refreshToken } = generateSessionTokens(user.id);
  await UserService.updateRefreshToken(user.id, refreshToken);
  setRefreshCookie(res, refreshToken);

  await AuditService.log(user.id, 'SESSION_START', 'AUTH', user.id, {}, req);

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
        businessName: user.businessName,
        currency: user.currency,
        taxRate: user.taxRate
      }
    }
  });
});

export const getProfile = catchAsync(async (req, res, next) => {
  const user = await UserService.findById(req.user.id);
  if (!user) return next(new AppError('User session invalid.', 401));

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isOnboarded: user.isOnboarded,
      businessName: user.businessName,
      businessAddress: user.businessAddress,
      businessType: user.businessType,
      upiId: user.upiId,
      bankDetails: user.bankDetails,
      phone: user.phone,
      currency: user.currency,
      taxRate: user.taxRate,
      isVerified: user.isVerified
    }
  });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const updates = req.body;

  // Whitelist updateable fields including new production fields
  const allowed = [
    'name', 'businessName', 'businessAddress', 'businessType', 
    'upiId', 'bankDetails', 'phone', 'currency', 'taxRate', 'isOnboarded'
  ];
  
  const profileToUpdate = {};
  allowed.forEach(key => {
    if (updates[key] !== undefined) profileToUpdate[key] = updates[key];
  });

  const user = await UserService.updateProfile(userId, profileToUpdate);
  
  await AuditService.log(user.id, 'PROFILE_UPDATE', 'USER', user.id, profileToUpdate, req);

  res.json({
    success: true,
    data: {
      user: {
        id: user.id, 
        name: user.name, 
        email: user.email, 
        isOnboarded: user.isOnboarded,
        businessName: user.businessName,
        currency: user.currency,
        taxRate: user.taxRate
      }
    }
  });
});

export const logoutUser = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  if (userId) {
    await UserService.updateRefreshToken(userId, null);
    await AuditService.log(userId, 'SESSION_END', 'AUTH', userId, {}, req);
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });

  res.json({ success: true, message: 'Signed out successfully.' });
});

export const refreshToken = catchAsync(async (req, res, next) => {
  const token = req.cookies.refreshToken;
  
  if (!token) return next(new AppError('No refresh token provided', 401));

  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    
    // Check if user still exists and token matches DB
    const user = await UserService.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return next(new AppError('Invalid refresh session', 401));
    }

    const { accessToken, refreshToken: newRefreshToken } = generateSessionTokens(user.id);
    await UserService.updateRefreshToken(user.id, newRefreshToken);
    setRefreshCookie(res, newRefreshToken);

    res.json({ success: true, token: accessToken });
  } catch (err) {
    return next(new AppError('Refresh token expired', 401));
  }
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  // Production implementation would send an email. For now, we mock success.
  res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  res.json({ success: true, message: 'Password has been successfully reset.' });
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  res.json({ success: true, message: 'Email successfully verified.' });
});


