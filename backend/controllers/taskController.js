import Task from '../models/Task.js';
import TaskCompletion from '../models/TaskCompletion.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';
import { calculateRevenueSplit, awardReward } from '../utils/revenueSplit.js';

// Get all active tasks
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ isActive: true });
    
    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// Complete a task
export const completeTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Find task
    const task = await Task.findById(id);
    if (!task || !task.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Check if already completed
    const existingCompletion = await TaskCompletion.findOne({ userId, taskId: id });
    if (existingCompletion) {
      return res.status(400).json({
        success: false,
        message: 'Task already completed'
      });
    }
    
    // Get user tier
    const user = await User.findById(userId);
    const tier = user.tier;
    
    // Calculate reward
    const { userAmount, platformAmount } = calculateRevenueSplit(task.cmxReward, tier);
    
    // Create task completion
    const completion = await TaskCompletion.create({
      userId,
      taskId: id,
      cmxEarned: task.cmxReward,
      platformFee: platformAmount,
      userReceived: userAmount,
      verificationStatus: 'verified',
      completedAt: Date.now(),
      verifiedAt: Date.now()
    });
    
    // Update task completion count
    task.currentCompletions += 1;
    await task.save();
    
    // Award reward to user
    await awardReward(userId, userAmount);
    
    // Update wallet
    const wallet = await Wallet.findOne({ userId });
    const transactionId = `task-${completion._id}-${Date.now()}`;
    
    wallet.currentBalance += userAmount;
    wallet.totalEarned += userAmount;
    wallet.transactions.push({
      transactionId,
      type: 'task_reward',
      amount: userAmount,
      description: `Completed task: ${task.title}`,
      taskId: completion._id,
      timestamp: Date.now()
    });
    await wallet.save();
    
    res.status(200).json({
      success: true,
      data: {
        completion,
        reward: userAmount
      }
    });
  } catch (error) {
    next(error);
  }
};

