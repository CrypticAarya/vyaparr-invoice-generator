import { z } from 'zod';

const uuidSchema = z.string().uuid('Invalid identifier format');

const invoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().optional(),
  qty: z.number().min(0.01, 'Quantity must be positive'),
  rate: z.number().min(0, 'Rate cannot be negative'),
  hsn: z.string().optional(),
  gstSlab: z.number().min(0).max(100).optional(),
  discount: z.number().min(0).optional(),
  productId: uuidSchema.optional(),
});

export const createInvoiceSchema = z.object({
  body: z.object({
    clientId: uuidSchema,
    businessName: z.string().optional(),
    businessAddress: z.string().optional(),
    clientName: z.string().optional(),
    clientEmail: z.string().email().optional().or(z.literal('')),
    clientAddress: z.string().optional(),
    dateIssued: z.string().optional(),
    dueDate: z.string().optional(),
    invoiceNumber: z.string().optional(),
    taxRate: z.number().min(0).optional(),
    notes: z.string().optional(),
    items: z.array(invoiceItemSchema).min(1, 'Invoice must have at least one item'),
    subtotal: z.number().optional(),
    tax: z.number().optional(),
    total: z.number().min(0),
    status: z.enum(['draft', 'final', 'paid', 'partial', 'overdue']).optional(),
  }),
});

export const updateInvoiceSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    clientId: uuidSchema.optional(),
    businessName: z.string().optional(),
    businessAddress: z.string().optional(),
    clientName: z.string().optional(),
    clientEmail: z.string().email().optional().or(z.literal('')),
    clientAddress: z.string().optional(),
    dateIssued: z.string().optional(),
    dueDate: z.string().optional(),
    invoiceNumber: z.string().optional(),
    taxRate: z.number().min(0).optional(),
    notes: z.string().optional(),
    items: z.array(invoiceItemSchema).optional(),
    subtotal: z.number().optional(),
    tax: z.number().optional(),
    total: z.number().min(0).optional(),
    status: z.enum(['draft', 'final', 'paid', 'partial', 'overdue']).optional(),
  }),
});
