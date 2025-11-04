import { generateFairRandom } from './provablyFair.js';

// Game constants
const HOUSE_EDGE = 0.05; // 5% house edge
const SLOTS_SYMBOLS = ['🍒', '🍋', '🍊', '⭐', '💎', '7️⃣'];
const SLOTS_PAYOUTS = {
  '💎💎💎': 100,
  '⭐⭐⭐': 50,
  '7️⃣7️⃣7️⃣': 25,
  '🍒🍒🍒': 10,
  '🍋🍋🍋': 8,
  '🍊🍊🍊': 5
};

/**
 * Generate spin result for slots game
 * @param {String} seed - Provably fair seed
 * @returns {Object} - { reels, winAmount, result }
 */
export const generateSlotsResult = (seed, betAmount) => {
  const reels = [
    SLOTS_SYMBOLS[generateFairRandom(seed + '1', SLOTS_SYMBOLS.length - 1)],
    SLOTS_SYMBOLS[generateFairRandom(seed + '2', SLOTS_SYMBOLS.length - 1)],
    SLOTS_SYMBOLS[generateFairRandom(seed + '3', SLOTS_SYMBOLS.length - 1)]
  ];
  
  const winCombination = reels.join('');
  const multiplier = SLOTS_PAYOUTS[winCombination] || 0;
  const winAmount = multiplier > 0 ? Math.floor(betAmount * multiplier * (1 - HOUSE_EDGE)) : 0;
  
  return {
    reels,
    winCombination,
    winAmount,
    result: winAmount > 0 ? 'win' : 'loss',
    multiplier
  };
};

/**
 * Generate result for roulette game
 * @param {String} seed - Provably fair seed
 * @param {Number} betNumber - Number the user bet on
 * @param {String} betType - 'number' or 'color'
 * @returns {Object} - { winningNumber, winAmount, result }
 */
export const generateRouletteResult = (seed, betAmount, betNumber, betType) => {
  // Single zero roulette (0-36)
  const winningNumber = generateFairRandom(seed, 36);
  
  // Determine if it's red or black (0 is green, 1-10 odds/evens: red odds, black evens, etc.)
  const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(winningNumber);
  const isBlack = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35].includes(winningNumber);
  
  let winAmount = 0;
  let result = 'loss';
  
  if (betType === 'number') {
    if (betNumber === winningNumber) {
      winAmount = Math.floor(betAmount * 35 * (1 - HOUSE_EDGE));
      result = 'win';
    }
  } else if (betType === 'color') {
    if ((betNumber === 1 && isRed) || (betNumber === 2 && isBlack)) {
      winAmount = Math.floor(betAmount * 2 * (1 - HOUSE_EDGE));
      result = 'win';
    }
  }
  
  return {
    winningNumber,
    isRed,
    isBlack,
    winAmount,
    result
  };
};

/**
 * Generate result for blackjack game
 * @param {String} seed - Provably fair seed
 * @param {Array} playerHand - Player's cards
 * @param {Array} dealerHand - Dealer's cards
 * @returns {Object} - { dealerCards, playerValue, dealerValue, winAmount, result }
 */
export const generateBlackjackResult = (seed, betAmount, playerHand, dealerHand) => {
  // Evaluate hands
  const playerValue = evaluateHand(playerHand);
  const dealerValue = evaluateHand(dealerHand);
  
  let winAmount = 0;
  let result = 'loss';
  
  // Blackjack (21 with 2 cards) pays 3:2
  if (playerHand.length === 2 && playerValue === 21 && dealerValue !== 21) {
    winAmount = Math.floor(betAmount * 2.5 * (1 - HOUSE_EDGE));
    result = 'win';
  }
  // Player busts
  else if (playerValue > 21) {
    result = 'loss';
  }
  // Dealer busts
  else if (dealerValue > 21) {
    winAmount = Math.floor(betAmount * 2 * (1 - HOUSE_EDGE));
    result = 'win';
  }
  // Compare values
  else if (playerValue > dealerValue) {
    winAmount = Math.floor(betAmount * 2 * (1 - HOUSE_EDGE));
    result = 'win';
  }
  // Tie
  else if (playerValue === dealerValue) {
    result = 'draw';
  }
  
  return {
    dealerCards: dealerHand,
    playerValue,
    dealerValue,
    winAmount,
    result
  };
};

/**
 * Evaluate hand value in blackjack
 * @param {Array} hand - Array of card values
 * @returns {Number} - Hand value
 */
const evaluateHand = (hand) => {
  let value = 0;
  let aces = 0;
  
  for (const card of hand) {
    if (card === 'A') {
      aces++;
      value += 11;
    } else if (['J', 'Q', 'K'].includes(card)) {
      value += 10;
    } else {
      value += parseInt(card);
    }
  }
  
  // Adjust for aces
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  
  return value;
};

/**
 * Generate poker hand
 * @param {String} seed - Provably fair seed
 * @returns {Array} - Array of 5 cards
 */
export const generatePokerHand = (seed) => {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const hand = [];
  const usedCards = new Set();
  
  for (let i = 0; i < 5; i++) {
    let card;
    do {
      const suit = suits[generateFairRandom(seed + i + 'suit', suits.length - 1)];
      const rank = ranks[generateFairRandom(seed + i + 'rank', ranks.length - 1)];
      card = `${rank}${suit}`;
    } while (usedCards.has(card));
    
    usedCards.add(card);
    hand.push(card);
  }
  
  return hand;
};

