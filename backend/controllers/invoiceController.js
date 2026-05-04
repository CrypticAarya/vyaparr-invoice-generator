import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';
import Product from '../models/Product.js';

/**
 * Controller to persist a newly created invoice draft or finalized document.
 */
export const createInvoice = async (req, res) => {
  try {
    const payload = req.body;
    const newInvoice = new Invoice({
      ...payload,
      userId: req.user.id
    });
    await newInvoice.save();
    res.status(201).json({ success: true, invoice: newInvoice });
  } catch (error) {
    console.error('Invoice Creation Error:', error);
    res.status(500).json({ success: false, error: 'Failed to persist invoice.' });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, invoices });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve invoices.' });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!invoice) return res.status(404).json({ success: false, error: 'Invoice not found' });
    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update invoice.' });
  }
};

/**
 * Finalize: Syncs with Client (AR) and Product (Usage)
 */
export const finalizeInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findOne({ _id: id, userId: req.user.id });

    if (!invoice) return res.status(404).json({ success: false, error: 'Invoice not found' });
    if (invoice.status !== 'draft') return res.status(400).json({ success: false, error: 'Only drafts can be finalized' });

    invoice.status = 'final';
    await invoice.save();

    // 1. Update Client Pending Balance
    if (invoice.clientId) {
      await Client.findByIdAndUpdate(invoice.clientId, {
        $inc: { pendingAmount: invoice.total || 0 }
      });
    }

    // 2. Update Product Usage Statistics
    if (invoice.items && invoice.items.length > 0) {
      const productUpdates = invoice.items
        .filter(item => item.productId)
        .map(item => Product.findByIdAndUpdate(item.productId, {
          $inc: { 
            usageCount: 1, 
            totalRevenueGenerated: (item.qty * item.rate) || 0 
          }
        }));
      await Promise.all(productUpdates);
    }

    res.json({ success: true, invoice });
  } catch (error) {
    console.error('Finalize Sync Error:', error);
    res.status(500).json({ success: false, error: 'Synchronization failed during finalization.' });
  }
};

/**
 * Update Payment: Handles full/partial payments and syncs with Client AR.
 */
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, notes, status } = req.body;
    const invoice = await Invoice.findOne({ _id: id, userId: req.user.id });

    if (!invoice) return res.status(404).json({ success: false, error: 'Invoice not found' });
    
    const previousPaidAmount = invoice.paidAmount || 0;
    const newPaidAmount = Number(amount) || 0;
    const diff = newPaidAmount - previousPaidAmount;

    invoice.paidAmount = newPaidAmount;
    invoice.paymentNotes = notes || invoice.paymentNotes;
    invoice.status = status || (newPaidAmount >= invoice.total ? 'paid' : 'partial');
    invoice.isPaid = invoice.status === 'paid';
    
    await invoice.save();

    // Sync Client Balance (Reduce by the incremental payment)
    if (invoice.clientId && diff !== 0) {
      await Client.findByIdAndUpdate(invoice.clientId, {
        $inc: { pendingAmount: -diff }
      });
    }

    res.json({ success: true, invoice });
  } catch (error) {
    console.error('Payment Sync Error:', error);
    res.status(500).json({ success: false, error: 'Failed to update payment records.' });
  }
};

/**
 * Log Communication: Reminders, Emails, WhatsApp shares
 */
export const logCommunication = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, notes } = req.body;
    const invoice = await Invoice.findOne({ _id: id, userId: req.user.id });

    if (!invoice) return res.status(404).json({ success: false, error: 'Invoice not found' });

    invoice.communicationLog.push({ action, notes, date: new Date() });
    await invoice.save();

    res.json({ success: true, log: invoice.communicationLog });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to log communication.' });
  }
};

/**
 * Delete: Reverses sync impact if finalized
 */
export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findOne({ _id: id, userId: req.user.id });

    if (!invoice) return res.status(404).json({ success: false, error: 'Invoice not found' });

    // Reverse AR impact for any non-draft, non-fully-paid invoice
    if (['final', 'partial', 'overdue'].includes(invoice.status) && invoice.clientId) {
      const outstanding = (invoice.total || 0) - (invoice.paidAmount || 0);
      if (outstanding > 0) {
        await Client.findByIdAndUpdate(invoice.clientId, {
          $inc: { pendingAmount: -outstanding }
        });
      }
    }

    // Reverse Product Revenue impact
    if (invoice.items && invoice.items.length > 0) {
      const productReversals = invoice.items
        .filter(item => item.productId)
        .map(item => Product.findByIdAndUpdate(item.productId, {
          $inc: { 
            totalRevenueGenerated: -((item.qty * item.rate) || 0) 
          }
        }));
      await Promise.all(productReversals);
    }

    await Invoice.deleteOne({ _id: id });
    res.json({ success: true, message: 'Invoice deleted and balances synchronized.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete invoice safely.' });
  }
};

