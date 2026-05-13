import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, getProductLedger } from '../controllers/productController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { createProductSchema, updateProductSchema } from '../validators/productValidator.js';

const router = express.Router();

router.get('/', authenticateToken, getProducts);
router.post('/', authenticateToken, validate(createProductSchema), createProduct);
router.put('/:id', authenticateToken, validate(updateProductSchema), updateProduct);
router.get('/:id/ledger', authenticateToken, getProductLedger);
router.delete('/:id', authenticateToken, deleteProduct);

export default router;
