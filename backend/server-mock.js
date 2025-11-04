import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data
const mockUser = {
  id: 'user_123',
  email: 'demo@example.com',
  username: 'demo',
  tier: 2,
  cmxBalance: 25000
};

const mockTasks = [
  {
    _id: 'task_1',
    title: 'Watch Video Advertisement',
    description: 'Watch a 30 second video to earn CMX',
    cmxReward: 1000,
    type: 'video'
  },
  {
    _id: 'task_2',
    title: 'Complete Survey',
    description: 'Answer a few questions about your preferences',
    cmxReward: 2000,
    type: 'survey'
  },
  {
    _id: 'task_3',
    title: 'Download App',
    description: 'Download and open our partner app',
    cmxReward: 5000,
    type: 'offer'
  }
];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CMX Platform API (Mock Mode)', mode: 'demo' });
});

// Auth endpoints (mock)
app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    data: {
      user: mockUser,
      token: 'demo_token_12345'
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    data: {
      user: mockUser,
      token: 'demo_token_12345'
    }
  });
});

app.get('/api/auth/verify-token', (req, res) => {
  res.json({
    success: true,
    data: { user: mockUser }
  });
});

// Wallet endpoints (mock)
app.get('/api/wallet/balance', (req, res) => {
  res.json({
    success: true,
    data: {
      balance: 25000,
      totalEarned: 50000,
      totalWithdrawn: 0
    }
  });
});

app.get('/api/wallet/transactions', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        transactionId: 'tx_1',
        type: 'task_reward',
        amount: 1000,
        description: 'Completed task: Watch Video',
        timestamp: new Date().toISOString()
      },
      {
        transactionId: 'tx_2',
        type: 'game_win',
        amount: 5000,
        description: 'Slots win',
        timestamp: new Date().toISOString()
      }
    ]
  });
});

// Tasks endpoints (mock)
app.get('/api/tasks', (req, res) => {
  res.json({
    success: true,
    data: mockTasks
  });
});

app.post('/api/tasks/:id/complete', (req, res) => {
  res.json({
    success: true,
    data: {
      reward: 1000,
      newBalance: 26000
    }
  });
});

// Games endpoints (mock)
app.post('/api/games/slots/spin', (req, res) => {
  const reels = ['🍒', '⭐', '💎'];
  const won = Math.random() > 0.7;
  
  res.json({
    success: true,
    data: {
      reels,
      result: won ? 'win' : 'loss',
      winAmount: won ? 5000 : 0,
      newBalance: won ? 30000 : 20000
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Mock API Server running on port ${PORT}`);
  console.log(`📝 Running in DEMO mode - all endpoints return mock data`);
});

