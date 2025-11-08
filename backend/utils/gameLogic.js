import { generateFairRandom } from './provablyFair.js';

// Game constants
const HOUSE_EDGE = 0.03; // 3% house edge (more player friendly)
const SLOTS_SYMBOLS = ['🏺', '👁️', '🐍', '🦅', '⚱️', '👑'];

// Symbol payouts for 3+ matches
const SYMBOL_PAYOUTS = {
  '👑': { 3: 50, 4: 200 },   // Legendary
  '⚱️': { 3: 15, 4: 50 },    // Epic
  '🦅': { 3: 8, 4: 25 },     // Rare
  '🐍': { 3: 5, 4: 15 },     // Uncommon
  '👁️': { 3: 3, 4: 8 },     // Common (Wild)
  '🏺': { 3: 2, 4: 5 }       // Common
};

// Weighted symbol selection for better win frequency
const SYMBOL_WEIGHTS = {
  '🏺': 30,  // Most common
  '👁️': 25,  // Wild - common
  '🐍': 20,
  '🦅': 15,
  '⚱️': 8,
  '👑': 2    // Rarest
};

function selectWeightedSymbol(seed) {
  const symbols = Object.keys(SYMBOL_WEIGHTS);
  const weights = Object.values(SYMBOL_WEIGHTS);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const random = generateFairRandom(seed, totalWeight - 1);
  
  let cumulative = 0;
  for (let i = 0; i < symbols.length; i++) {
    cumulative += weights[i];
    if (random < cumulative) {
      return symbols[i];
    }
  }
  return symbols[0];
}

// Check for winning patterns in grid
function checkPaylines(grid) {
  const paylines = [
    // Horizontal lines
    { pattern: [[0,0], [0,1], [0,2], [0,3]], name: 'Top' },
    { pattern: [[1,0], [1,1], [1,2], [1,3]], name: 'Middle' },
    { pattern: [[2,0], [2,1], [2,2], [2,3]], name: 'Bottom' },
    // Diagonal and zigzag
    { pattern: [[0,0], [1,1], [2,2], [1,3]], name: 'V' },
    { pattern: [[2,0], [1,1], [0,2], [1,3]], name: 'Λ' },
    { pattern: [[1,0], [0,1], [1,2], [2,3]], name: 'W' },
    { pattern: [[1,0], [2,1], [1,2], [0,3]], name: 'M' },
    { pattern: [[0,0], [1,1], [1,2], [0,3]], name: 'Valley' },
    { pattern: [[2,0], [1,1], [1,2], [2,3]], name: 'Hill' },
  ];
  
  let maxWin = 0;
  let winningSymbol = null;
  let matchCount = 0;
  let winningLine = null;
  
  for (const payline of paylines) {
    const symbols = payline.pattern.map(([row, col]) => grid[row]?.[col]);
    
    // Skip if any symbol is undefined
    if (symbols.some(s => !s)) continue;
    
    // Check all 4 symbols match
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2] && symbols[2] === symbols[3]) {
      const symbol = symbols[0];
      const payout = SYMBOL_PAYOUTS[symbol];
      
      if (payout && payout[4]) {
        const multiplier = payout[4];
        if (multiplier > maxWin) {
          maxWin = multiplier;
          winningSymbol = symbol;
          matchCount = 4;
          winningLine = payline.name;
        }
      }
    }
    // Check first 3 symbols match
    else if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
      const symbol = symbols[0];
      const payout = SYMBOL_PAYOUTS[symbol];
      
      if (payout && payout[3]) {
        const multiplier = payout[3];
        if (multiplier > maxWin) {
          maxWin = multiplier;
          winningSymbol = symbol;
          matchCount = 3;
          winningLine = payline.name;
        }
      }
    }
    // Check last 3 symbols match (indices 1, 2, 3)
    else if (symbols[1] === symbols[2] && symbols[2] === symbols[3]) {
      const symbol = symbols[1];
      const payout = SYMBOL_PAYOUTS[symbol];
      
      if (payout && payout[3]) {
        const multiplier = payout[3];
        if (multiplier > maxWin) {
          maxWin = multiplier;
          winningSymbol = symbol;
          matchCount = 3;
          winningLine = payline.name;
        }
      }
    }
  }
  
  console.log('Payline Check - Max Win:', maxWin, 'Symbol:', winningSymbol, 'Line:', winningLine);
  
  return { multiplier: maxWin, symbol: winningSymbol, matchCount, winningLine };
}

/**
 * Generate spin result for slots game (3x4 grid)
 * @param {String} seed - Provably fair seed
 * @param {Number} betAmount - Bet amount
 * @returns {Object} - { reels, winAmount, result }
 */
export const generateSlotsResult = (seed, betAmount) => {
  // Generate 3x4 grid (12 symbols total)
  const reels = [];
  for (let i = 0; i < 12; i++) {
    reels.push(selectWeightedSymbol(seed + i));
  }
  
  // Convert to grid for evaluation
  const grid = [
    [reels[0], reels[1], reels[2], reels[3]],   // Row 0
    [reels[4], reels[5], reels[6], reels[7]],   // Row 1
    [reels[8], reels[9], reels[10], reels[11]]  // Row 2
  ];
  
  const { multiplier, symbol, matchCount } = checkPaylines(grid);
  const winAmount = multiplier > 0 ? Math.floor(betAmount * multiplier * (1 - HOUSE_EDGE)) : 0;
  
  return {
    reels,
    grid,
    winAmount,
    result: winAmount > 0 ? 'win' : 'loss',
    multiplier,
    winningSymbol: symbol,
    matchCount
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

