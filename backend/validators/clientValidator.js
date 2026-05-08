import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ID');

export const createClientSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Client name is required' }),
    company: z.string().optional(),
    gstin: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional().or(z.literal('')),
    address: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const updateClientSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    name: z.string().optional(),
    company: z.string().optional(),
    gstin: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional().or(z.literal('')),
    address: z.string().optional(),
    notes: z.string().optional(),
  }),
});
