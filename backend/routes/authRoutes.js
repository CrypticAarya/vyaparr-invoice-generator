import express from 'express';
import { 
  signupUser, 
  loginUser, 
  updateProfile, 
  refreshToken, 
  logoutUser, 
  forgotPassword, 
  resetPassword, 
  verifyEmail,
  seedUser 
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { signupSchema, loginSchema, updateProfileSchema } from '../validators/authValidator.js';

const router = express.Router();

/**
 * AUTH ROUTES
 * Manages the security perimeter for user identity.
 */

// --- Public Gateways ---
router.post('/signup', validate(signupSchema), signupUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

// --- Secure Operations ---
router.post('/logout', authenticateToken, logoutUser);
router.put('/profile', authenticateToken, validate(updateProfileSchema), updateProfile);
router.post('/seed', authenticateToken, seedUser);

export default router;
