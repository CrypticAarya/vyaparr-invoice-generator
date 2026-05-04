import express from 'express';
import { getClients, createClient, updateClient, deleteClient } from '../controllers/clientController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getClients);
router.post('/', authenticateToken, createClient);
router.put('/:id', authenticateToken, updateClient);
router.delete('/:id', authenticateToken, deleteClient);

export default router;
