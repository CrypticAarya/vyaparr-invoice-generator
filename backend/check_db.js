import mongoose from 'mongoose';
import Invoice from './models/Invoice.js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vyaparflow');
  const inv = await Invoice.findOne({ invoiceNumber: 'INV-001' });
  console.log('Invoice in DB:', JSON.stringify(inv, null, 2));
  process.exit();
}
check();
