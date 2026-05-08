import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';

class InventoryService {
  /**
   * Validates if there is enough stock for the requested items.
   * Throws an AppError if stock is insufficient.
   */
  async validateStock(items) {
    for (const item of items) {
      if (!item.productId) continue;

      const product = await Product.findById(item.productId);
      if (!product) continue;

      // Skip services
      if (product.isService) continue;

      if (product.stockQuantity < item.qty) {
        throw new AppError(`Insufficient stock for product: ${product.name}. Available: ${product.stockQuantity}`, 400);
      }
    }
  }

  /**
   * Adjusts stock quantity for items in an invoice.
   * @param {Array} items - Invoice items
   * @param {String} type - 'reduction' or 'restoration'
   */
  async adjustStock(items, type = 'reduction') {
    const factor = type === 'reduction' ? -1 : 1;

    for (const item of items) {
      if (!item.productId) continue;

      const product = await Product.findById(item.productId);
      if (!product || product.isService) continue;

      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stockQuantity: item.qty * factor }
      });
    }
  }

  /**
   * Specifically handles stock restoration from a deleted invoice.
   */
  async restoreFromInvoice(invoice) {
    if (!invoice || !invoice.items) return;
    await this.adjustStock(invoice.items, 'restoration');
  }
}

export default new InventoryService();
