const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    limitAmount: {
      type: Number,
      required: [true, 'Budget limit is required'],
      min: [1, 'Budget limit must be at least 1'],
    },
    period: {
      type: String,
      enum: ['weekly', 'monthly'],
      default: 'monthly',
    },
    alertThresholdPct: {
      type: Number,
      default: 80,
      min: 50,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

budgetSchema.index({ userId: 1, categoryId: 1, period: 1 }, { unique: true });
budgetSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('Budget', budgetSchema);
