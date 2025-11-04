import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  // Task Info
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['ad', 'survey', 'offer', 'video'],
    required: true
  },
  
  // Reward
  cmxReward: {
    type: Number,
    required: [true, 'CMX reward is required'],
    min: 0
  },
  platformFee: {
    type: Number,
    default: 0.70,
    min: 0,
    max: 1
  },
  
  // Content
  partner: {
    type: String,
    enum: ['admob', 'tapjoy', 'pollfish', 'custom'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  
  // Requirements
  duration: {
    type: Number,
    default: 0
  },
  minAge: {
    type: Number,
    default: 0
  },
  country: {
    type: [String],
    default: []
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  maxCompletions: {
    type: Number,
    default: null
  },
  currentCompletions: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Task', taskSchema);

