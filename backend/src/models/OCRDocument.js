const mongoose = require('mongoose');

const ocrDocumentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      enum: ['image/jpeg', 'image/png', 'application/pdf'],
    },
    fileSize: {
      type: Number,
      required: true,
      min: 1,
    },
    storagePath: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending',
    },
    extractedText: {
      type: String,
      default: '',
    },
    parsedTransactionCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    processedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

ocrDocumentSchema.index({ userId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('OCRDocument', ocrDocumentSchema);
