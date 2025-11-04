import GameSession from '../models/GameSession.js';
import Wallet from '../models/Wallet.js';
import { createProvablyFairConfig } from '../utils/provablyFair.js';
import { generateSlotsResult, generateRouletteResult, generateBlackjackResult, generatePokerHand } from '../utils/gameLogic.js';

export const spinSlots = async (req, res, next) => {
  try {
    const { betAmount } = req.body;
    const userId = req.user.id;
    
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.currentBalance < betAmount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }
    
    const { seed, hash, publicHash } = createProvablyFairConfig();
    const result = generateSlotsResult(seed, betAmount);
    
    wallet.currentBalance -= betAmount;
    wallet.totalLost += betAmount;
    
    if (result.winAmount > 0) {
      wallet.currentBalance += result.winAmount;
      wallet.totalEarned += result.winAmount;
    }
    
    const session = await GameSession.create({
      userId,
      gameType: 'slots',
      gameId: `slots-${Date.now()}`,
      betAmount,
      winAmount: result.winAmount,
      result: result.result,
      details: result,
      seed,
      hash,
      publicHash,
      completedAt: Date.now()
    });
    
    await wallet.save();
    
    res.status(200).json({
      success: true,
      data: {
        ...result,
        sessionId: session._id,
        newBalance: wallet.currentBalance
      }
    });
  } catch (error) {
    next(error);
  }
};

export const spinRoulette = async (req, res, next) => {
  try {
    const { betAmount, betNumber, betType } = req.body;
    const userId = req.user.id;
    
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.currentBalance < betAmount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }
    
    const { seed, hash, publicHash } = createProvablyFairConfig();
    const result = generateRouletteResult(seed, betAmount, betNumber, betType);
    
    wallet.currentBalance -= betAmount;
    wallet.totalLost += betAmount;
    
    if (result.winAmount > 0) {
      wallet.currentBalance += result.winAmount;
      wallet.totalEarned += result.winAmount;
    }
    
    const session = await GameSession.create({
      userId,
      gameType: 'roulette',
      gameId: `roulette-${Date.now()}`,
      betAmount,
      winAmount: result.winAmount,
      result: result.result,
      details: result,
      seed,
      hash,
      publicHash,
      completedAt: Date.now()
    });
    
    await wallet.save();
    
    res.status(200).json({
      success: true,
      data: {
        ...result,
        sessionId: session._id,
        newBalance: wallet.currentBalance
      }
    });
  } catch (error) {
    next(error);
  }
};

export const playBlackjack = async (req, res, next) => {
  try {
    const { betAmount, playerHand, dealerHand } = req.body;
    const userId = req.user.id;
    
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.currentBalance < betAmount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }
    
    const { seed, hash, publicHash } = createProvablyFairConfig();
    const result = generateBlackjackResult(seed, betAmount, playerHand, dealerHand);
    
    wallet.currentBalance -= betAmount;
    wallet.totalLost += betAmount;
    
    if (result.winAmount > 0) {
      wallet.currentBalance += result.winAmount;
      wallet.totalEarned += result.winAmount;
    }
    
    res.status(200).json({
      success: true,
      data: {
        ...result,
        newBalance: wallet.currentBalance
      }
    });
  } catch (error) {
    next(error);
  }
};

export const playPoker = async (req, res, next) => {
  try {
    const hand = generatePokerHand(`${req.user.id}-${Date.now()}`);
    
    res.status(200).json({
      success: true,
      data: { hand }
    });
  } catch (error) {
    next(error);
  }
};

