import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { type: String, required: true },
  hsn: String,
  unitPrice: { type: Number, required: true },
  gstSlab: { type: Number, default: 18 },
  unit: { type: String, default: 'PCS' },
  description: String,
  usageCount: { type: Number, default: 0 },
  totalRevenueGenerated: { type: Number, default: 0 }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
