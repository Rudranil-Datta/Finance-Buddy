const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: 60,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense', 'discretionary'],
      required: true,
    },
    color: {
      type: String,
      default: '#6366f1',
      match: [/^#([A-Fa-f0-9]{6})$/, 'Color must be a valid hex code'],
    },
    icon: {
      type: String,
      default: 'wallet',
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

categorySchema.index({ userId: 1, name: 1 }, { unique: true });
categorySchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model('Category', categorySchema);
