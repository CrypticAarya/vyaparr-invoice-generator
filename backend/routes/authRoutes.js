import express from 'express';
import { signupUser, loginUser, updateProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Route: POST /api/auth/signup
 * Description: Registers a new user account.
 */
router.post('/signup', signupUser);

/**
 * Route: POST /api/auth/login
 * Description: Authenticates a user and returns a JWT token.
 */
router.post('/login', loginUser);

/**
 * Route: PUT /api/auth/profile
 * Description: Updates the authenticated user's onboarding profile.
 */
router.put('/profile', authenticateToken, updateProfile);

export default router;
