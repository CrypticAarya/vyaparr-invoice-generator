import express from 'express';
import { generateLineItems, getBusinessInsights } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Route: POST /api/generate
 * Description: Connects to LLM to parse raw text into structured JSON invoice line items.
 */
router.post('/', authenticateToken, generateLineItems);

/**
 * Route: GET /api/generate/insights
 * Description: Generates AI-powered business intelligence insights from current data.
 */
router.get('/insights', authenticateToken, getBusinessInsights);

export default router;
