import prisma from '../lib/prisma.js';

export const seedUserData = async (userId) => {
  // 1. Clear existing data for this user to ensure a clean state
  await prisma.$transaction([
    prisma.invoiceItem.deleteMany({ where: { invoice: { userId } } }),
    prisma.communicationLog.deleteMany({ where: { invoice: { userId } } }),
    prisma.invoice.deleteMany({ where: { userId } }),
    prisma.stockTransaction.deleteMany({ where: { userId } }),
    prisma.product.deleteMany({ where: { userId } }),
    prisma.client.deleteMany({ where: { userId } })
  ]);

  // 2. Create Realistic Clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        userId,
        name: 'Stellar Dynamics Inc.',
        company: 'Stellar Dynamics',
        email: 'finance@stellar.com',
        gstin: '27AAACS1234A1Z1',
        address: 'Industrial Area Phase 2, Pune, Maharashtra',
        pendingAmount: 0
      }
    }),
    prisma.client.create({
      data: {
        userId,
        name: 'Cloud Nine Solutions',
        company: 'Cloud Nine',
        email: 'billing@cloudnine.io',
        gstin: '29BBBCS5678B1Z2',
        address: 'HSR Layout, Bangalore, Karnataka',
        pendingAmount: 0
      }
    }),
    prisma.client.create({
      data: {
        userId,
        name: 'Modern Retail Corp',
        company: 'Modern Retail',
        email: 'ops@modernretail.com',
        gstin: '07CCCSD9012C1Z3',
        address: 'Connaught Place, New Delhi',
        pendingAmount: 0
      }
    })
  ]);

  // 3. Create Realistic Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        userId,
        name: 'Business Strategy Consulting',
        unitPrice: 15000,
        isService: true,
        usageCount: 12,
        totalRevenueGenerated: 180000
      }
    }),
    prisma.product.create({
      data: {
        userId,
        name: 'Professional Web Hosting',
        unitPrice: 1200,
        isService: true,
        usageCount: 24,
        totalRevenueGenerated: 28800
      }
    }),
    prisma.product.create({
      data: {
        userId,
        name: 'High-Density Steel Pipes',
        unitPrice: 850,
        hsn: '7304',
        isService: false,
        stockQuantity: 145,
        lowStockThreshold: 20,
        usageCount: 50,
        totalRevenueGenerated: 42500
      }
    }),
    prisma.product.create({
      data: {
        userId,
        name: 'Industrial Valve XL',
        unitPrice: 2400,
        hsn: '8481',
        isService: false,
        stockQuantity: 12,
        lowStockThreshold: 15,
        usageCount: 8,
        totalRevenueGenerated: 19200
      }
    })
  ]);

  // 4. Generate 12 Months of Invoices
  const months = 12;
  const now = new Date();
  
  for (let i = 0; i < months; i++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 15);
    const numInvoices = Math.floor(Math.random() * 3) + 2;

    for (let j = 0; j < numInvoices; j++) {
      const client = clients[Math.floor(Math.random() * clients.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const qty = Math.floor(Math.random() * 5) + 1;
      const subtotal = product.unitPrice * qty;
      const tax = Math.round(subtotal * 0.18);
      const total = subtotal + tax;

      const isPaid = Math.random() > 0.3;
      const status = isPaid ? 'PAID' : (i === 0 ? 'FINAL' : 'OVERDUE');

      await prisma.invoice.create({
        data: {
          userId,
          businessName: 'Your Demo Business',
          clientName: client.name,
          clientAddress: client.address,
          clientId: client.id,
          invoiceNumber: `INV-2026-${(i*3 + j + 100).toString().padStart(3, '0')}`,
          dateIssued: monthDate,
          dueDate: new Date(monthDate.getTime() + 15 * 24 * 60 * 60 * 1000),
          subtotal,
          tax,
          total,
          status,
          paidAmount: isPaid ? total : 0,
          createdAt: monthDate,
          items: {
            create: [{
              description: product.name,
              qty,
              rate: product.unitPrice,
              gstSlab: 18,
              total: subtotal,
              productId: product.id
            }]
          }
        }
      });
    }
  }

  // 5. Create Initial Stock Ledger entries
  for (const product of products) {
    if (!product.isService) {
      await prisma.stockTransaction.create({
        data: {
          userId,
          productId: product.id,
          type: 'IN',
          quantity: product.stockQuantity + 50,
          balance: product.stockQuantity + 50,
          notes: 'Initial Seeding'
        }
      });
    }
  }

  return { clients: clients.length, products: products.length };
};
