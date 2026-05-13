import mongoose from 'mongoose';

const stockTransactionSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['inbound', 'outbound', 'adjustment', 'return', 'cancellation'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId, // Link to Invoice or Adjustment event
    index: true
  },
  referenceModel: {
    type: String,
    enum: ['Invoice', 'Adjustment'],
    default: 'Invoice'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const StockTransaction = mongoose.model('StockTransaction', stockTransactionSchema);
export default StockTransaction;
