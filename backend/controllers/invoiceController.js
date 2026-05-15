import InvoiceService from '../services/InvoiceService.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

/**
 * INVOICE CONTROLLER
 * Handles HTTP requests related to the financial document lifecycle.
 */

export const createInvoice = catchAsync(async (req, res, next) => {
  const draft = req.body;
  
  if (!draft.clientId) return next(new AppError('Please select a client to proceed.', 400));
  if (!draft.items?.length) return next(new AppError('An invoice cannot be empty. Please add items.', 400));

  // Normalize status for the database (Prisma Enums are uppercase)
  if (draft.status) draft.status = draft.status.toUpperCase();

  const invoice = await InvoiceService.createInvoice(req.user.id, draft);
  
  res.status(201).json({ 
    success: true, 
    data: { invoice } 
  });
});

export const getInvoices = catchAsync(async (req, res, next) => {
  const invoices = await InvoiceService.getInvoices(req.user.id);
  res.json({ 
    success: true, 
    data: { invoices } 
  });
});

export const updateInvoice = catchAsync(async (req, res, next) => {
  const { id: invoiceId } = req.params;
  const updates = req.body;

  if (updates.status) updates.status = updates.status.toUpperCase();

  const invoice = await InvoiceService.updateInvoice(invoiceId, req.user.id, updates);
  
  res.json({ 
    success: true, 
    data: { invoice } 
  });
});

export const finalizeInvoice = catchAsync(async (req, res, next) => {
  const { id: invoiceId } = req.params;
  const invoice = await InvoiceService.finalizeInvoice(invoiceId, req.user.id);

  res.json({ 
    success: true, 
    data: { invoice } 
  });
});

export const updatePayment = catchAsync(async (req, res, next) => {
  const { id: invoiceId } = req.params;
  const paymentData = req.body;

  const invoice = await InvoiceService.recordPayment(invoiceId, req.user.id, paymentData);

  res.json({ 
    success: true, 
    data: { invoice } 
  });
});

export const logCommunication = catchAsync(async (req, res, next) => {
  const { id: invoiceId } = req.params;
  const log = await InvoiceService.logCommunication(invoiceId, req.user.id, req.body);

  res.json({ 
    success: true, 
    data: { log } 
  });
});

export const deleteInvoice = catchAsync(async (req, res, next) => {
  const { id: invoiceId } = req.params;
  
  await InvoiceService.removeInvoice(invoiceId, req.user.id);
  
  res.json({ 
    success: true, 
    data: { message: 'Invoice and associated records purged successfully.' } 
  });
});
