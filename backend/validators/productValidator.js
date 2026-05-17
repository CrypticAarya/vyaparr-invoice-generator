import { z } from 'zod';

const uuidSchema = z.string().uuid('Invalid identifier format');

export const createProductSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Product name is required' }),
    hsn: z.string().optional(),
    unitPrice: z.number({ required_error: 'Unit price is required' }).min(0),
    gstSlab: z.number().min(0).max(100).optional(),
    unit: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    name: z.string().optional(),
    hsn: z.string().optional(),
    unitPrice: z.number().min(0).optional(),
    gstSlab: z.number().min(0).max(100).optional(),
    unit: z.string().optional(),
    description: z.string().optional(),
  }),
});
