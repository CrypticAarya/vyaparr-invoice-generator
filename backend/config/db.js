import mongoose from 'mongoose';
import prisma from '../lib/prisma.js';

/**
 * Multi-DB Connection Handler
 * Connects to PostgreSQL (via Prisma) and optionally MongoDB for legacy support.
 */
export const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // 1. PostgreSQL (Primary)
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL Connected (Prisma)');
  } catch (err) {
    console.error('❌ PostgreSQL Connection Failure:', err.message);
    if (isProduction) process.exit(1);
  }

  // 2. MongoDB (Legacy Fallback)
  let mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) return;

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected (Legacy Support)');
  } catch (err) {
    console.warn('⚠️ MongoDB Legacy Connection Failed. Proceeding with PostgreSQL only.');
  }
};
