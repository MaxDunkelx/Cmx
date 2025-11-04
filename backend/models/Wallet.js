import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit', 'withdrawal', 'game_win', 'game_loss', 'task_reward', 'bonus'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GameSession'
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskCompletion'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { _id: false });

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Balance
  currentBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Transactions
  transactions: [transactionSchema],
  
  // Statistics
  totalDeposited: {
    type: Number,
    default: 0
  },
  totalWithdrawn: {
    type: Number,
    default: 0
  },
  totalEarned: {
    type: Number,
    default: 0
  },
  totalLost: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Wallet', walletSchema);

