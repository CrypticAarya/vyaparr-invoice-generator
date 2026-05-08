import mongoose from 'mongoose';
import Invoice from './models/Invoice.js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/vyaparflow');
  const userId = "69f8f5b3ee85161ca65e74ea";
  const invoices = await Invoice.find({ userId });
  console.log('Total Invoices Found:', invoices.length);
  const revenueInvoices = invoices.filter(inv => ['final', 'paid', 'partial', 'overdue'].includes(inv.status));
  console.log('Revenue Invoices Found:', revenueInvoices.length);
  if (revenueInvoices.length > 0) {
    console.log('First Revenue Invoice Total:', revenueInvoices[0].total);
    console.log('First Revenue Invoice Keys:', Object.keys(revenueInvoices[0].toObject()));
  }
  process.exit();
}
check();
