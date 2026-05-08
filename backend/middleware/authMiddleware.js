import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

const ACCESS_SECRET = process.env.JWT_SECRET || 'access_secret_key';

/**
 * Middleware to verify JSON Web Tokens on protected routes.
 * Ensures that the requester is a valid, authenticated user.
 */
export const authenticateToken = catchAsync(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Authentication failed. Missing authorization token.', 401));
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Your token has expired. Please refresh your session.', 401));
    }
    return next(new AppError('Invalid or malformed token.', 403));
  }
});

/**
 * Middleware to restrict access based on user roles (RBAC).
 * @param {...string} roles - Array of allowed roles (e.g., 'admin', 'staff')
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};

/**
 * Middleware to ensure email is verified before allowing access to sensitive operations.
 */
export const ensureVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return next(new AppError('Please verify your email to access this feature.', 403));
  }
  next();
};
