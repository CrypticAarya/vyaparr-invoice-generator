import express from 'express';
import { getMyLogs } from '../controllers/auditController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All audit routes require a valid session
router.use(protect);

router.get('/', getMyLogs);

export default router;
