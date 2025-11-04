import Wallet from '../models/Wallet.js';
import crypto from 'crypto';

// Initialize wallet if it doesn't exist
export const createWallet = async (req, res, next) => {
  try {
    const existingWallet = await Wallet.findOne({ userId: req.user.id });
    
    if (existingWallet) {
      return res.status(200).json({
        success: true,
        data: existingWallet
      });
    }

    const wallet = await Wallet.create({
      userId: req.user.id,
      currentBalance: 0
    });

    res.status(201).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    next(error);
  }
};

// Get wallet balance
export const getBalance = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: wallet.currentBalance,
        totalEarned: wallet.totalEarned,
        totalWithdrawn: wallet.totalWithdrawn
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get transaction history
export const getTransactions = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    const limit = parseInt(req.query.limit) || 50;
    const transactions = wallet.transactions
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

