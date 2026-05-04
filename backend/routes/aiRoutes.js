import express from 'express';
import { generateLineItems } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Route: POST /api/generate
 * Description: Connects to LLM to parse raw text into structured JSON invoice line items.
 */
router.post('/', authenticateToken, generateLineItems);

export default router;
