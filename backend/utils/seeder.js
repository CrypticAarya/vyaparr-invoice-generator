import mongoose from 'mongoose';
import User from '../models/User.js';
import Client from '../models/Client.js';
import Product from '../models/Product.js';
import Invoice from '../models/Invoice.js';
import StockTransaction from '../models/StockTransaction.js';

export const seedUserData = async (userId) => {
  // 1. Clear existing data for this user to ensure a clean state
  await Promise.all([
    Client.deleteMany({ userId }),
    Product.deleteMany({ userId }),
    Invoice.deleteMany({ userId }),
    StockTransaction.deleteMany({ userId })
  ]);

  // 2. Create Realistic Clients
  const clients = await Client.insertMany([
    {
      userId,
      name: 'Stellar Dynamics Inc.',
      company: 'Stellar Dynamics',
      email: 'finance@stellar.com',
      gstin: '27AAACS1234A1Z1',
      address: 'Industrial Area Phase 2, Pune, Maharashtra',
      pendingAmount: 0
    },
    {
      userId,
      name: 'Cloud Nine Solutions',
      company: 'Cloud Nine',
      email: 'billing@cloudnine.io',
      gstin: '29BBBCS5678B1Z2',
      address: 'HSR Layout, Bangalore, Karnataka',
      pendingAmount: 0
    },
    {
      userId,
      name: 'Modern Retail Corp',
      company: 'Modern Retail',
      email: 'ops@modernretail.com',
      gstin: '07CCCSD9012C1Z3',
      address: 'Connaught Place, New Delhi',
      pendingAmount: 0
    }
  ]);

  // 3. Create Realistic Products
  const products = await Product.insertMany([
    {
      userId,
      name: 'Business Strategy Consulting',
      unitPrice: 15000,
      isService: true,
      usageCount: 12,
      totalRevenueGenerated: 180000
    },
    {
      userId,
      name: 'Professional Web Hosting',
      unitPrice: 1200,
      isService: true,
      usageCount: 24,
      totalRevenueGenerated: 28800
    },
    {
      userId,
      name: 'High-Density Steel Pipes',
      unitPrice: 850,
      hsn: '7304',
      isService: false,
      stockQuantity: 145,
      lowStockThreshold: 20,
      usageCount: 50,
      totalRevenueGenerated: 42500
    },
    {
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
  ]);

  // 4. Generate 12 Months of Invoices
  const months = 12;
  const now = new Date();
  const invoices = [];
  
  for (let i = 0; i < months; i++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 15);
    const numInvoices = Math.floor(Math.random() * 3) + 2; // 2-4 invoices per month

    for (let j = 0; j < numInvoices; j++) {
      const client = clients[Math.floor(Math.random() * clients.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const qty = Math.floor(Math.random() * 5) + 1;
      const subtotal = product.unitPrice * qty;
      const tax = Math.round(subtotal * 0.18);
      const total = subtotal + tax;

      const isPaid = Math.random() > 0.3; // 70% chance of being paid
      
      invoices.push({
        userId,
        businessName: 'Your Demo Business',
        clientName: client.name,
        clientEmail: client.email,
        clientAddress: client.address,
        clientId: client._id,
        invoiceNumber: `INV-2026-${(i*3 + j + 100).toString().padStart(3, '0')}`,
        dateIssued: monthDate.toISOString().split('T')[0],
        dueDate: new Date(monthDate.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{
          id: `item_${Date.now()}_${j}`,
          description: product.name,
          qty,
          rate: product.unitPrice,
          gstSlab: 18,
          productId: product._id
        }],
        subtotal,
        tax,
        total,
        status: isPaid ? 'paid' : (i === 0 ? 'final' : 'overdue'),
        paidAmount: isPaid ? total : 0,
        createdAt: monthDate
      });
    }
  }

  const createdInvoices = await Invoice.insertMany(invoices);

  // 5. Create Initial Stock Ledger entries for physical products
  for (const product of products) {
    if (!product.isService) {
      await StockTransaction.create({
        userId,
        productId: product._id,
        type: 'INBOUND',
        quantity: product.stockQuantity + 50, // Start with a bit more
        previousStock: 0,
        currentStock: product.stockQuantity + 50,
        referenceModel: 'System',
        notes: 'Initial Seeding'
      });
    }
  }

  return { clients: clients.length, products: products.length, invoices: createdInvoices.length };
};
