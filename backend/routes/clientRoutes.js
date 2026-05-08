import express from 'express';
import { getClients, createClient, updateClient, deleteClient } from '../controllers/clientController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { createClientSchema, updateClientSchema } from '../validators/clientValidator.js';

const router = express.Router();

router.get('/', authenticateToken, getClients);
router.post('/', authenticateToken, validate(createClientSchema), createClient);
router.put('/:id', authenticateToken, validate(updateClientSchema), updateClient);
router.delete('/:id', authenticateToken, deleteClient);

export default router;
