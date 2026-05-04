import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  description: { type: String },
  qty: { type: Number, default: 1 },
  rate: { type: Number, default: 0 },
  hsn: { type: String },
  gstSlab: { type: Number, default: 18 },
  discount: { type: Number, default: 0 },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
});

const invoiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  businessName: String,
  businessWebsite: String,
  businessAddress: String,
  clientName: String,
  clientEmail: String,
  clientAddress: String,
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  dateIssued: String,
  dueDate: String,
  invoiceNumber: String,
  taxRate: { type: Number, default: 10 },
  notes: String,
  items: [invoiceItemSchema],
  subtotal: Number,
  tax: Number,
  total: Number,
  status: { type: String, enum: ['draft', 'final', 'paid', 'partial', 'overdue'], default: 'draft' },
  isPaid: { type: Boolean, default: false },
  paidAmount: { type: Number, default: 0 },
  paymentNotes: String,
  communicationLog: [{
    action: String,
    date: { type: Date, default: Date.now },
    notes: String
  }]
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
