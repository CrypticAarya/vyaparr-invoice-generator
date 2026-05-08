import mongoose from 'mongoose';
import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';
import Product from '../models/Product.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import InventoryService from '../services/InventoryService.js';

/**
 * Controller to persist a newly created invoice draft or finalized document.
 */
export const createInvoice = catchAsync(async (req, res, next) => {
  const payload = { ...req.body };
  
  // Validation
  if (!payload.clientId) return next(new AppError('Client selection is mandatory.', 400));
  if (!payload.items || payload.items.length === 0) return next(new AppError('Invoice must contain at least one item.', 400));
  if (isNaN(payload.total) || payload.total < 0) return next(new AppError('Invalid total amount.', 400));

  // 1. Validate Stock Availability before creating
  await InventoryService.validateStock(payload.items);

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

  // 2. Adjust Inventory Stock
  await InventoryService.adjustStock(payload.items, 'reduction');
  
  res.status(201).json({ 
    success: true, 
    data: { invoice: newInvoice } 
  });
});

export const getInvoices = catchAsync(async (req, res, next) => {
  const invoices = await Invoice.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ 
    success: true, 
    data: { invoices } 
  });
});

export const updateInvoice = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const payload = { ...req.body };
  
  const existingInvoice = await Invoice.findOne({ _id: id, userId: req.user.id });
  if (!existingInvoice) return next(new AppError('Invoice not found', 404));

  // Handle Inventory Delta for items if updated
  if (payload.items) {
    // Restore old stock first
    await InventoryService.restoreFromInvoice(existingInvoice);
    // Validate new stock
    await InventoryService.validateStock(payload.items);
    // Apply new reduction
    await InventoryService.adjustStock(payload.items, 'reduction');
  }

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
  
  res.json({ 
    success: true, 
    data: { invoice: updatedInvoice } 
  });
});

/**
 * Finalize: Syncs with Client (AR) and Product (Usage)
 */
export const finalizeInvoice = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const invoice = await Invoice.findOne({ _id: id, userId: req.user.id });

  if (!invoice) return next(new AppError('Invoice not found', 404));
  
  if (invoice.status !== 'draft') {
    return res.json({ 
      success: true, 
      data: { invoice }, 
      message: 'Invoice already finalized' 
    });
  }

  invoice.status = 'final';
  await invoice.save();

  // 1. Update Client Pending Balance
  if (invoice.clientId) {
    const outstanding = (invoice.total || 0) - (invoice.paidAmount || 0);
    await Client.findByIdAndUpdate(invoice.clientId, {
      $inc: { pendingAmount: outstanding }
    });
  }

  // 2. Update Product Usage Statistics (Stock is already adjusted on creation/update)
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

  res.json({ 
    success: true, 
    data: { invoice } 
  });
});

/**
 * Update Payment: Handles full/partial payments and syncs with Client AR.
 */
export const updatePayment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { amount, notes, status } = req.body;
  const invoice = await Invoice.findOne({ _id: id, userId: req.user.id });

  if (!invoice) return next(new AppError('Invoice not found', 404));
  
  const previousPaidAmount = invoice.paidAmount || 0;
  const newPaidAmount = Number(amount) || 0;
  const diff = newPaidAmount - previousPaidAmount;

  invoice.paidAmount = newPaidAmount;
  invoice.paymentNotes = notes || invoice.paymentNotes;
  invoice.status = status || (newPaidAmount >= invoice.total ? 'paid' : 'partial');
  invoice.isPaid = invoice.status === 'paid';
  
  await invoice.save();

  if (invoice.clientId && diff !== 0) {
    await Client.findByIdAndUpdate(invoice.clientId, {
      $inc: { pendingAmount: -diff }
    });
  }

  res.json({ 
    success: true, 
    data: { invoice } 
  });
});

export const logCommunication = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { action, notes } = req.body;
  const invoice = await Invoice.findOne({ _id: id, userId: req.user.id });

  if (!invoice) return next(new AppError('Invoice not found', 404));

  invoice.communicationLog.push({ action, notes, date: new Date() });
  await invoice.save();

  res.json({ 
    success: true, 
    data: { log: invoice.communicationLog } 
  });
});

/**
 * Delete: Reverses sync impact including Inventory restoration
 */
export const deleteInvoice = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const invoice = await Invoice.findOne({ _id: id, userId: req.user.id });

  if (!invoice) return next(new AppError('Invoice not found', 404));

  // 1. Restore Inventory Stock
  await InventoryService.restoreFromInvoice(invoice);

  // 2. Reverse AR impact
  if (['final', 'partial', 'overdue'].includes(invoice.status) && invoice.clientId) {
    const outstanding = (invoice.total || 0) - (invoice.paidAmount || 0);
    if (outstanding > 0) {
      await Client.findByIdAndUpdate(invoice.clientId, {
        $inc: { pendingAmount: -outstanding }
      });
    }
  }

  // 3. Reverse Product Revenue impact
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
  res.json({ 
    success: true, 
    data: { message: 'Invoice deleted and stock/balances synchronized.' } 
  });
});
