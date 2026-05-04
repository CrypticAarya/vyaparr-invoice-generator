import express from 'express';
import { 
  createInvoice, 
  getInvoices, 
  updateInvoice, 
  finalizeInvoice, 
  deleteInvoice,
  updatePayment,
  logCommunication
} from '../controllers/invoiceController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Base Routes
router.post('/', authenticateToken, createInvoice);
router.get('/', authenticateToken, getInvoices);

// Specific Document Routes
router.put('/:id', authenticateToken, updateInvoice);
router.post('/finalize/:id', authenticateToken, finalizeInvoice);
router.put('/payment/:id', authenticateToken, updatePayment);
router.post('/communication/:id', authenticateToken, logCommunication);
router.delete('/:id', authenticateToken, deleteInvoice);

export default router;
