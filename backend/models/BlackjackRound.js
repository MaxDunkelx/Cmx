import mongoose from 'mongoose';

const blackjackRoundSchema = new mongoose.Schema({
  roundId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['player-turn', 'dealer-turn', 'completed', 'settled'],
    default: 'player-turn'
  },
  betAmount: {
    type: Number,
    required: true
  },
  lockedAmount: {
    type: Number,
    required: true
  },
  insuranceBet: {
    type: Number,
    default: 0
  },
  provablyFair: {
    serverSeed: String,
    serverSeedHash: String,
    publicHash: String,
    clientSeed: String,
    nonce: String,
    shoeHash: String
  },
  shoe: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  state: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  history: {
    type: Array,
    default: []
  },
  summary: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  tableConfig: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  lastActionAt: {
    type: Date,
    default: Date.now
  },
  settledAt: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('BlackjackRound', blackjackRoundSchema);


