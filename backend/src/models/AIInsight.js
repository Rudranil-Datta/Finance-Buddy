const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['financial_health', 'spending_pattern', 'savings_tip'],
      required: true,
    },
    healthScore: {
      type: Number,
      min: 1,
      max: 100,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    tips: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.length <= 10,
        message: 'Maximum 10 tips allowed',
      },
    },
    debtAdvice: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    savingsAdvice: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    literacyTip: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    inputSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    model: {
      type: String,
      default: 'gemini-2.0-flash',
      trim: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

aiInsightSchema.index({ userId: 1, type: 1, createdAt: -1 });
aiInsightSchema.index({ userId: 1, expiresAt: 1 });

module.exports = mongoose.model('AIInsight', aiInsightSchema);
