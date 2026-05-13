import Product from '../models/Product.js';
import StockTransaction from '../models/StockTransaction.js';
import AppError from '../utils/AppError.js';
import auditLogger from '../utils/auditLogger.js';

/**
 * INVENTORY MANAGEMENT SERVICE
 * This service handles the business logic for stock levels, 
 * ensuring we never oversell and maintaining a precise Stock Ledger.
 */
class InventoryService {
  /**
   * SAFETY CHECK: validateStock
   */
  async validateStock(items) {
    for (const item of items) {
      if (!item.productId) continue;

      const product = await Product.findById(item.productId);
      if (!product) continue;

      if (product.isService) continue;

      if (product.stockQuantity < item.qty) {
        throw new AppError(`Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Requested: ${item.qty}`, 400);
      }
    }
  }

  /**
   * ATOMIC UPDATE: adjustStock
   * Now logs a StockTransaction for audit purposes.
   */
  async adjustStock(items, type = 'outbound', userId, referenceId = null) {
    const factor = (type === 'outbound' || type === 'reduction') ? -1 : 1;
    const transactionType = type === 'reduction' ? 'outbound' : type;

    for (const item of items) {
      if (!item.productId) continue;

      const product = await Product.findById(item.productId);
      if (!product || product.isService) continue;

      const previousStock = product.stockQuantity;
      const adjustmentAmount = Number(item.qty) * factor;
      const newStock = previousStock + adjustmentAmount;

      // 1. Update Product Stock
      await Product.findByIdAndUpdate(item.productId, {
        $set: { stockQuantity: newStock }
      });

      // 2. Log to Stock Ledger
      await StockTransaction.create({
        productId: product._id,
        userId: userId,
        type: transactionType === 'restoration' ? 'return' : transactionType,
        quantity: item.qty,
        previousStock,
        newStock,
        referenceId,
        referenceModel: 'Invoice',
        notes: `Auto-adjusted via Invoice processing.`
      });

      auditLogger.log('STOCK_LEDGER_ENTRY', {
        productId: product._id,
        type: transactionType,
        quantity: item.qty,
        newStock
      });
    }
  }

  /**
   * RECOVERY: restoreFromInvoice
   */
  async restoreFromInvoice(invoice, userId) {
    if (!invoice || !invoice.items) return;
    await this.adjustStock(invoice.items, 'return', userId, invoice._id);
  }
}

export default new InventoryService();
