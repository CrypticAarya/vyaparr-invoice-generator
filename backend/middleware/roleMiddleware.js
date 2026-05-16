import AppError from '../utils/AppError.js';

/**
 * ROLE-BASED ACCESS CONTROL (RBAC)
 * 
 * Middleware to restrict access based on user roles.
 * Ensures that sensitive administrative or operational routes 
 * are protected from standard user accounts.
 */
export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Forbidden: You do not have the required permissions for this operation.', 403));
    }
    next();
  };
};

export const isAdmin = checkRole('ADMIN');
export const isStaff = checkRole('ADMIN', 'STAFF');
