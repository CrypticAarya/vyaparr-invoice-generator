import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email format'),
    password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email format'),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    businessName: z.string().optional(),
    businessAddress: z.string().optional(),
    businessType: z.string().optional(),
    upiId: z.string().optional(),
    bankDetails: z.string().optional(),
    currency: z.string().optional(),
    taxRate: z.number().min(0).optional(),
  }),
});
