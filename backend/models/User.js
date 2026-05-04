import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  isOnboarded: {
    type: Boolean,
    default: false
  },
  businessName: String,
  businessAddress: String,
  businessType: String,
  bankDetails: String,
  upiId: String,
  currency: { type: String, default: 'USD' },
  taxRate: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
