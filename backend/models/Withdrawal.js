import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Amount
  cmxAmount: {
    type: Number,
    required: true,
    min: 0
  },
  usdAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Payment
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'amazon', 'xbox', 'bitcoin'],
    required: true
  },
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  
  // Admin
  adminNotes: {
    type: String,
    default: ''
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: {
    type: Date
  },
  
  // Transaction
  transactionId: {
    type: String,
    default: ''
  }
}, {
  embeddings: true
});

withdrawalSchema.index({ userId: 1, createdAt: -1 });
withdrawalSchema.index({ status: 1 });

export default mongoose.model('Withdrawal', withdrawalSchema);

