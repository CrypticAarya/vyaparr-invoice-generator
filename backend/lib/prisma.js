import { PrismaClient } from '@prisma/client';

/**
 * PRISMA CLIENT SINGLETON
 * 
 * We maintain a single instance of the Prisma Client to avoid 
 * connection pool exhaustion during local development.
 */

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
