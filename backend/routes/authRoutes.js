import express from 'express';
import { 
  signupUser, 
  loginUser, 
  updateProfile, 
  refreshAccessToken, 
  logoutUser, 
  forgotPassword, 
  resetPassword, 
  verifyEmail 
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { signupSchema, loginSchema, updateProfileSchema } from '../validators/authValidator.js';

const router = express.Router();

// Public Routes
router.post('/signup', validate(signupSchema), signupUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Protected Routes
router.post('/logout', authenticateToken, logoutUser);
router.put('/profile', authenticateToken, validate(updateProfileSchema), updateProfile);

export default router;
