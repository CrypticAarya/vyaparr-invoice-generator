import prisma from '../lib/prisma.js';
import AppError from '../utils/AppError.js';
import auditLogger from '../utils/auditLogger.js';

/**
 * INVENTORY MANAGEMENT SERVICE
 * 
 * This service manages our warehouse logic. It ensures we never oversell 
 * and maintains a clear audit trail (Stock Ledger) for every movement.
 */
class InventoryService {

  /**
   * SAFETY CHECK: Ensures we have enough stock before finalizing a transaction.
   * If any item is insufficient, the whole process stops to prevent data corruption.
   */
  async validateStock(items) {
    for (const item of items) {
      if (!item.productId) continue;

      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      
      // Services don't have stock, so we skip them
      if (!product || product.isService) continue;

      if (product.stockQuantity < item.qty) {
        throw new AppError(`Cannot fulfill order. Product "${product.name}" only has ${product.stockQuantity} in stock.`, 400);
      }
    }
  }

  /**
   * ATOMIC ADJUSTMENT: Updates product quantities and records a ledger entry.
   * Supports both 'outbound' (sales) and 'return' (cancellations/credits).
   */
  async adjustStock(items, movementType = 'outbound', userId, invoiceId = null) {
    const isOutbound = ['outbound', 'reduction', 'out'].includes(movementType);
    const multiplier = isOutbound ? -1 : 1;
    const ledgerType = isOutbound ? 'OUT' : (movementType === 'return' ? 'IN' : 'ADJUSTMENT');

    for (const item of items) {
      if (!item.productId) continue;

      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      
      if (!product || product.isService) continue;

      const change = Number(item.qty) * multiplier;

      // 1. Atomically update the product's quantity
      const updatedProduct = await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            increment: change
          }
        }
      });

      // 2. Record the movement in the Stock Ledger for auditing
      await prisma.stockTransaction.create({
        data: {
          productId: product.id,
          userId: userId,
          type: ledgerType,
          quantity: item.qty,
          balance: updatedProduct.stockQuantity,
          referenceId: invoiceId?.toString(),
          notes: `System adjusted via ${ledgerType} operation.`
        }
      });

      auditLogger.log('STOCK_LEDGER_SYNC', {
        product: product.name,
        delta: change,
        newBalance: updatedProduct.stockQuantity
      });
    }
  }

  /**
   * RECOVERY: Quickly restores stock when an invoice is cancelled or modified.
   */
  async restoreFromInvoice(invoice, userId) {
    if (!invoice?.items || invoice.items.length === 0) return;
    
    // Restoration is simply an 'inbound' adjustment of the original quantities
    await this.adjustStock(invoice.items, 'return', userId, invoice.id);
  }
}

export default new InventoryService();
