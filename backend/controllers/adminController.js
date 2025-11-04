import User from '../models/User.js';
import Withdrawal from '../models/Withdrawal.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

export const getWithdrawals = async (req, res, next) => {
  try {
    const status = req.query.status || 'pending';
    const withdrawals = await Withdrawal.find({ status })
      .populate('userId', 'email username')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: withdrawals
    });
  } catch (error) {
    next(error);
  }
};

export const approveWithdrawal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const withdrawal = await Withdrawal.findById(id);
    
    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }
    
    withdrawal.status = 'completed';
    withdrawal.processedBy = req.user.id;
    withdrawal.processedAt = Date.now();
    await withdrawal.save();
    
    res.status(200).json({
      success: true,
      data: withdrawal
    });
  } catch (error) {
    next(error);
  }
};

export const rejectWithdrawal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }
    
    // Return funds to wallet
    const wallet = await Wallet.findOne({ userId: withdrawal.userId });
    if (wallet) {
      wallet.currentBalance += withdrawal.cmxAmount;
      await wallet.save();
    }
    
    withdrawal.status = 'cancelled';
    withdrawal.adminNotes = reason || 'Rejected by admin';
    withdrawal.processedBy = req.user.id;
    withdrawal.processedAt = Date.now();
    await withdrawal.save();
    
    res.status(200).json({
      success: true,
      data: withdrawal
    });
  } catch (error) {
    next(error);
  }
};

