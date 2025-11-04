import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Game Info
  gameType: {
    type: String,
    enum: ['slots', 'roulette', 'blackjack', 'poker'],
    required: true
  },
  gameId: {
    type: String,
    required: true
  },
  
  // Betting
  betAmount: {
    type: Number,
    required: true,
    min: 0
  },
  winAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Result
  result: {
    type: String,
    enum: ['win', 'loss', 'draw'],
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Provably Fair
  seed: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  publicHash: {
    type: String,
    required: true
  },
  
  // Timestamps
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('GameSession', gameSessionSchema);

