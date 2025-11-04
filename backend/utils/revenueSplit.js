import User from '../models/User.js';

// Tier-based revenue split percentages
const TIER_PERCENTAGES = {
  1: 0.30, // Tier 1: 30% user, 70% platform
  2: 0.40, // Tier 2: 40% user, 60% platform
  3: 0.50, // Tier 3: 50% user, 50% platform
  4: 0.60, // Tier 4: 60% user, 40% platform
  5: 0.70 // Tier 5: 70% user, 30% platform
};

/**
 * Calculate the revenue split based on user tier
 * @param {Number} totalReward - Total CMX reward
 * @param {Number} userTier - User's current tier (1-5)
 * @returns {Object} - { userAmount, platformAmount }
 */
export const calculateRevenueSplit = (totalReward, userTier) => {
  const userPercentage = TIER_PERCENTAGES[userTier] || TIER_PERCENTAGES[1];
  const userAmount = Math.floor(totalReward * userPercentage);
  const platformAmount = totalReward - userAmount;
  
  return {
    userAmount,
    platformAmount,
    userPercentage,
    platformPercentage: 1 - userPercentage
  };
};

/**
 * Update user tier based on total earned CMX
 * @param {String} userId - User ID
 * @returns {Promise<Object>} - Updated user
 */
export const updateUserTier = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const newTier = user.updateTier();
  
  if (newTier !== user.tier) {
    user.tier = newTier;
    await user.save();
  }
  
  return user;
};

/**
 * Award reward to user and update tier
 * @param {String} userId - User ID
 * @param {Number} cmxAmount - CMX amount to award
 */
export const awardReward = async (userId, cmxAmount) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Update balance
  user.cmxBalance += cmxAmount;
  user.totalEarnedCMX += cmxAmount;
  
  // Update tier if needed
  const newTier = user.updateTier();
  if (newTier > user.tier) {
    user.tier = newTier;
  }
  
  await user.save();
  return user;
};

