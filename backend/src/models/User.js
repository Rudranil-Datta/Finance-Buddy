const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      enum: ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

//userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', userSchema);
