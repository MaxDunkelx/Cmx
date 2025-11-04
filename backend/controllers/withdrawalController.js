import Withdrawal from '../models/Withdrawal.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';

const CMX_TO_CENTS = 10000;
const MIN_WITHDRAWAL = 5000000;

export const requestWithdrawal = async (req, res, next) => {
  try {
    const { cmxAmount, paymentMethod, paymentDetails } = req.body;
    const userId = req.user.id;
    
    // Validate
    if (!cmxAmount || cmxAmount < MIN_WITHDRAWAL) {
      return res.status(400).json({
        success: false,
        message: `Minimum withdrawal is ${MIN_WITHDRAWAL} CMX`
      });
    }
    
    // Check balance
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.currentBalance < cmxAmount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }
    
    // Calculate USD
    const usdAmount = cmxAmount / CMX_TO_CENTS / 100;
    
    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      userId,
      cmxAmount,
      usdAmount,
      paymentMethod,
      paymentDetails,
      status: 'pending'
    });
    
    // Deduct from wallet (temporarily)
    wallet.currentBalance -= cmxAmount;
    await wallet.save();
    
    res.status(201).json({
      success: true,
      data: {
        withdrawal,
        newBalance: wallet.currentBalance
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getWithdrawalHistory = async (req, res, next) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json({
      success: true,
      data: withdrawals
    });
  } catch (error) {
    next(error);
  }
};

