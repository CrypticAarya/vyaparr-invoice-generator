import prisma from '../lib/prisma.js';
import InventoryService from './InventoryService.js';
import AppError from '../utils/AppError.js';

/**
 * INVOICE SERVICE
 * 
 * This service handles the core financial lifecycle of an invoice. 
 * We use Prisma transactions to ensure that when an invoice is created, finalized, 
 * or deleted, the associated stock levels and client balances stay perfectly in sync.
 */
class InvoiceService {
  
  async getInvoices(userId) {
    return prisma.invoice.findMany({
      where: { userId },
      // OMITTED: include: { items: true } -> Huge N+1 memory risk. 
      // The bulk list UI does not need every single line item of every invoice.
      orderBy: { createdAt: 'desc' },
      take: 200 // Sane limit for production resilience without pagination
    });
  }

  async getInvoiceDetails(invoiceId, userId) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId, userId },
      include: { items: true, communication: true }
    });

    if (!invoice) throw new AppError('Invoice not found in your records.', 404);
    return invoice;
  }

  /**
   * CREATE NEW INVOICE
   * This is a multi-step process:
   * 1. Check if we actually have the physical stock to fulfill this.
   * 2. Save the invoice header and line items.
   * 3. Reduce inventory levels immediately.
   */
  async createInvoice(userId, payload) {
    const { items, ...headerData } = payload;

    // Safety first: don't create an invoice if stock is insufficient
    await InventoryService.validateStock(items);

    const invoice = await prisma.$transaction(async (tx) => {
      // Persist the invoice structure
      const newInvoice = await tx.invoice.create({
        data: {
          ...headerData,
          userId,
          items: {
            create: items.map(item => ({
              description: item.description,
              hsn: item.hsn,
              qty: item.qty,
              rate: item.rate,
              gstSlab: item.gstSlab,
              discount: item.discount || 0,
              total: item.total,
              productId: item.productId
            }))
          }
        },
        include: { items: true }
      });

      return newInvoice;
    });

    // Post-creation: adjust inventory (non-blocking if transaction succeeded)
    await InventoryService.adjustStock(items, 'outbound', userId, invoice.id);

    return invoice;
  }

  /**
   * UPDATE INVOICE
   * Updates are tricky because we need to "rollback" the previous stock impact 
   * and apply the new one. We restore stock to the state before the original invoice,
   * then validate and deduct the new quantities.
   */
  async updateInvoice(invoiceId, userId, payload) {
    const { items, ...headerData } = payload;

    const currentInvoice = await prisma.invoice.findUnique({
      where: { id: invoiceId, userId },
      include: { items: true }
    });

    if (!currentInvoice) throw new AppError('The requested invoice does not exist.', 404);

    return prisma.$transaction(async (tx) => {
      // 1. Restore stock levels to pre-invoice state
      await InventoryService.restoreFromInvoice(currentInvoice, userId);

      // 2. Validate new quantities against restored stock
      await InventoryService.validateStock(items);

      // 3. Update the record and replace all line items
      const updatedInvoice = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          ...headerData,
          items: {
            deleteMany: {}, // Clear old items to avoid duplicates/orphans
            create: items.map(item => ({
              description: item.description,
              hsn: item.hsn,
              qty: item.qty,
              rate: item.rate,
              gstSlab: item.gstSlab,
              discount: item.discount || 0,
              total: item.total,
              productId: item.productId
            }))
          }
        },
        include: { items: true }
      });

      // 4. Deduct the new stock quantities
      await InventoryService.adjustStock(items, 'outbound', userId, updatedInvoice.id);

      // 5. Adjust Client Balance if this is a live invoice (not a draft)
      if (currentInvoice.status !== 'DRAFT' && headerData.total !== undefined) {
        const balanceDelta = (headerData.total - currentInvoice.total);
        if (balanceDelta !== 0 && currentInvoice.clientId) {
          await tx.client.update({
            where: { id: currentInvoice.clientId },
            data: { pendingAmount: { increment: balanceDelta } }
          });
        }
      }

      return updatedInvoice;
    });
  }

  /**
   * FINALIZE INVOICE
   * Transitions an invoice from 'DRAFT' to 'FINAL'. 
   * This is when the financial impact (client balance) and product analytics are recorded.
   */
  async finalizeInvoice(invoiceId, userId) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId, userId },
      include: { items: true }
    });

    if (!invoice) throw new AppError('Invoice not found.', 404);
    if (invoice.status !== 'DRAFT') return invoice; // Already finalized

    return prisma.$transaction(async (tx) => {
      const finalized = await tx.invoice.update({
        where: { id: invoiceId },
        data: { status: 'FINAL' },
        include: { items: true }
      });

      // Increase the client's outstanding debt
      if (finalized.clientId) {
        const balanceImpact = finalized.total - finalized.paidAmount;
        await tx.client.update({
          where: { id: finalized.clientId },
          data: { pendingAmount: { increment: balanceImpact } }
        });
      }

      // Record product usage statistics for analytics
      for (const item of finalized.items) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { 
              usageCount: { increment: 1 },
              totalRevenueGenerated: { increment: item.total }
            }
          });
        }
      }

      return finalized;
    });
  }

  /**
   * DELETE INVOICE
   * Completely removes an invoice and reverses all associated stock/balance impacts.
   */
  async removeInvoice(invoiceId, userId) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId, userId },
      include: { items: true }
    });

    if (!invoice) throw new AppError('Invoice not found.', 404);

    return prisma.$transaction(async (tx) => {
      // 1. Put the stock back
      await InventoryService.restoreFromInvoice(invoice, userId);

      // 2. Reduce the client's pending balance
      if (invoice.status !== 'DRAFT' && invoice.clientId) {
        const balanceToSubtract = invoice.total - invoice.paidAmount;
        if (balanceToSubtract > 0) {
          await tx.client.update({
            where: { id: invoice.clientId },
            data: { pendingAmount: { decrement: balanceToSubtract } }
          });
        }
      }

      // 3. Remove product revenue credit
      for (const item of invoice.items) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { totalRevenueGenerated: { decrement: item.total } }
          });
        }
      }

      return tx.invoice.delete({ where: { id: invoiceId } });
    });
  }

  /**
   * RECORD PAYMENT
   * Updates how much has been paid on an invoice and reduces the client's debt.
   */
  async recordPayment(invoiceId, userId, paymentInfo) {
    const { amount, notes, status } = paymentInfo;
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId, userId }
    });

    if (!invoice) throw new AppError('Invoice not found.', 404);

    const paymentDelta = amount - invoice.paidAmount;

    return prisma.$transaction(async (tx) => {
      const updated = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          paidAmount: amount,
          paymentNotes: notes || invoice.paymentNotes,
          status: status || (amount >= invoice.total ? 'PAID' : 'PARTIAL')
        }
      });

      // Update the client's balance based on the delta
      if (invoice.clientId && paymentDelta !== 0) {
        await tx.client.update({
          where: { id: invoice.clientId },
          data: { pendingAmount: { decrement: paymentDelta } }
        });
      }

      return updated;
    });
  }

  async logCommunication(invoiceId, userId, logData) {
    return prisma.communicationLog.create({
      data: {
        ...logData,
        invoiceId
      }
    });
  }
}

export default new InvoiceService();
