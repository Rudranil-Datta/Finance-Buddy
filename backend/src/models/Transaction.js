const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
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
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Transaction date is required'],
      index: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrenceRule: {
      type: String,
      enum: ['weekly', 'monthly', 'yearly'],
    },
    nextDueDate: {
      type: Date,
    },
    spendingType: {
      type: String,
      enum: ['recurring_bill', 'one_time', 'discretionary'],
      default: 'one_time',
    },
    source: {
      type: String,
      enum: ['manual', 'csv', 'mock_bank', 'ocr'],
      default: 'manual',
    },
    ocrDocumentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OCRDocument',
    },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, categoryId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1, date: -1 });
transactionSchema.index({ userId: 1, isRecurring: 1, nextDueDate: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
