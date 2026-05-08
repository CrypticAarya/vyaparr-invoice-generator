import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';
import auditLogger from '../utils/auditLogger.js';

/**
 * INVENTORY MANAGEMENT SERVICE
 * This service handles the business logic for stock levels, 
 * ensuring we never oversell and always maintain a clear audit trail.
 */
class InventoryService {
  /**
   * SAFETY CHECK: validateStock
   * We verify if the warehouse (database) has enough quantity to fulfill an order 
   * BEFORE we finalize the transaction.
   */
  async validateStock(items) {
    for (const item of items) {
      if (!item.productId) continue;

      const product = await Product.findById(item.productId);
      if (!product) continue;

      // Professional check: We don't track stock for 'Services' (like consulting or labor).
      if (product.isService) continue;

      if (product.stockQuantity < item.qty) {
        auditLogger.log('INSUFFICIENT_STOCK_ALERT', { 
          productId: product._id, 
          productName: product.name,
          requested: item.qty,
          available: product.stockQuantity
        });
        
        throw new AppError(`Heads up! We only have ${product.stockQuantity} units of "${product.name}" in stock, but ${item.qty} were requested.`, 400);
      }
    }
  }

  /**
   * ATOMIC UPDATE: adjustStock
   * Directly impacts the stock levels. Used for both deducting stock (reduction) 
   * and returning stock to inventory (restoration).
   */
  async adjustStock(items, type = 'reduction') {
    const factor = type === 'reduction' ? -1 : 1;

    for (const item of items) {
      if (!item.productId) continue;

      const product = await Product.findById(item.productId);
      if (!product || product.isService) continue;

      // We use $inc to ensure the update is atomic at the database level.
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stockQuantity: item.qty * factor }
      });

      auditLogger.log('STOCK_ADJUSTED', {
        productId: product._id,
        adjustmentType: type,
        quantity: item.qty,
        newEstimatedStock: product.stockQuantity + (item.qty * factor)
      });
    }
  }

  /**
   * RECOVERY: restoreFromInvoice
   * If an invoice is deleted or archived, we gracefully return the items back to the shelves.
   */
  async restoreFromInvoice(invoice) {
    if (!invoice || !invoice.items) return;
    
    auditLogger.log('INVOICE_RESTORE_INITIATED', { invoiceId: invoice._id });
    await this.adjustStock(invoice.items, 'restoration');
  }
}

export default new InventoryService();
