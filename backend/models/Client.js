import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { type: String, required: true },
  company: String,
  gstin: String,
  phone: String,
  email: { type: String, lowercase: true },
  address: String,
  pendingAmount: { type: Number, default: 0 },
  notes: String,
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);
export default Client;
