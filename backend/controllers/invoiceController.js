import mongoose from 'mongoose';
import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';
import Product from '../models/Product.js';

/**
 * Controller to persist a newly created invoice draft or finalized document.
 */
export const createInvoice = async (req, res) => {
  try {
    const payload = { ...req.body };
    
    // Validation
    if (!payload.clientId) return res.status(400).json({ success: false, error: 'Client selection is mandatory.' });
    if (!payload.items || payload.items.length === 0) return res.status(400).json({ success: false, error: 'Invoice must contain at least one item.' });
    if (isNaN(payload.total) || payload.total < 0) return res.status(400).json({ success: false, error: 'Invalid total amount.' });

    // Explicitly cast relationships to ObjectId to ensure DB persistence
    if (payload.clientId) payload.clientId = new mongoose.Types.ObjectId(payload.clientId);
    if (payload.items) {
      payload.items = payload.items.map(item => ({
        ...item,
        productId: item.productId ? new mongoose.Types.ObjectId(item.productId) : undefined
      }));
    }

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
    const payload = { ...req.body };
    
    const existingInvoice = await Invoice.findOne({ _id: id, userId: req.user.id });
    if (!existingInvoice) return res.status(404).json({ success: false, error: 'Invoice not found' });

    // Delta update for Client Balance if total changed on a non-draft invoice
    if (existingInvoice.status !== 'draft' && payload.total !== undefined) {
      const oldOutstanding = (existingInvoice.total || 0) - (existingInvoice.paidAmount || 0);
      const newOutstanding = (Number(payload.total) || 0) - (existingInvoice.paidAmount || 0);
      const delta = newOutstanding - oldOutstanding;

      if (delta !== 0 && existingInvoice.clientId) {
        await Client.findByIdAndUpdate(existingInvoice.clientId, {
          $inc: { pendingAmount: delta }
        });
      }
    }

    // Explicitly cast relationships for updates
    if (payload.clientId) payload.clientId = new mongoose.Types.ObjectId(payload.clientId);
    if (payload.items) {
      payload.items = payload.items.map(item => ({
        ...item,
        productId: item.productId ? new mongoose.Types.ObjectId(item.productId) : undefined
      }));
    }

    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: payload },
      { new: true }
    );
    res.json({ success: true, invoice: updatedInvoice });
  } catch (error) {
    console.error('Update Error:', error);
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
    
    // If already finalized, return success to prevent UI errors on double-click
    if (invoice.status !== 'draft') {
      return res.json({ success: true, invoice, message: 'Invoice already finalized' });
    }

    invoice.status = 'final';
    await invoice.save();

    // 1. Update Client Pending Balance (Outstanding = Total - Already Paid)
    if (invoice.clientId) {
      const outstanding = (invoice.total || 0) - (invoice.paidAmount || 0);
      await Client.findByIdAndUpdate(invoice.clientId, {
        $inc: { pendingAmount: outstanding }
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

