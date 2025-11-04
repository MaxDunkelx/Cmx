import mongoose from 'mongoose';

const taskCompletionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  
  // Reward
  cmxEarned: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    required: true
  },
  userReceived: {
    type: Number,
    required: true
  },
  
  // Verification
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationMethod: {
    type: String,
    default: ''
  },
  
  // Timestamps
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  verifiedAt: {
    type: Date
  }
}, {
  timestamps: true
});

taskCompletionSchema.index({ userId: 1, taskId: 1 });

export default mongoose.model('TaskCompletion', taskCompletionSchema);

