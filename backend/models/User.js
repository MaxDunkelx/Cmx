import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  username: {
    type: String,
    trim: true,
    default: ''
  },
  
  // CMX Balance
  cmxBalance: {
    type: Number,
    default: 0
  },
  
  // Progression System
  tier: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 1
  },
  totalEarnedCMX: {
    type: Number,
    default: 0
  },
  tasksCompleted: {
    type: Number,
    default: 0
  },
  
  // Profile
  firstName: {
    type: String,
    trim: true,
    default: ''
  },
  lastName: {
    type: String,
    trim: true,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  
  // Security
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check and update tier
userSchema.methods.updateTier = function() {
  const earned = this.totalEarnedCMX;
  if (earned >= 1000000) return 5;
  if (earned >= 500000) return 4;
  if (earned >= 100000) return 3;
  if (earned >= 10000) return 2;
  return 1;
};

export default mongoose.model('User', userSchema);

