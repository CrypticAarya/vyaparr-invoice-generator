import mongoose from 'mongoose';
import crypto from 'crypto';

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
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: ['user', 'staff', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  refreshToken: String,
  
  // Security Tokens
  passwordResetToken: String,
  passwordResetExpires: Date,
  verificationToken: String,
  verificationExpires: Date,

  // Business Profile
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

// Method to generate a random token for password resets or email verification
userSchema.methods.createToken = function(type) {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  if (type === 'passwordReset') {
    this.passwordResetToken = hashedToken;
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins
  } else if (type === 'verification') {
    this.verificationToken = hashedToken;
    this.verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  }

  return token;
};

const User = mongoose.model('User', userSchema);
export default User;
