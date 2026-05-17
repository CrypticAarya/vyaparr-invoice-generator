import prisma from '../lib/prisma.js';

/**
 * Database Connection Handler
 * Connects to PostgreSQL (via Prisma).
 */
export const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // PostgreSQL (Primary)
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL Connected (Prisma)');
  } catch (err) {
    console.error('❌ PostgreSQL Connection Failure:', err.message);
    if (isProduction) {
      console.error('CRITICAL: Production database connection failed. Exiting...');
      process.exit(1);
    }
  }
};
