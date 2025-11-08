import { generateFairRandom } from './provablyFair.js';

/**
 * Advanced Slot Machine Logic with Proper RTP
 * Supports multiple slot types with balanced probability
 */

// Target RTP: 94-96% (industry standard)
const HOUSE_EDGE = 0.05; // 5% house edge = 95% RTP

/**
 * Symbol configurations for different slot themes
 */
export const SLOT_CONFIGS = {
  EGYPTIAN: {
    symbols: ['🏺', '👁️', '🐍', '🦅', '⚱️', '👑'],
    weights: [30, 25, 20, 15, 8, 2],
    payouts: {
      '🏺': { 3: 2, 4: 5, 5: 15 },
      '👁️': { 3: 3, 4: 8, 5: 20 },
      '🐍': { 3: 5, 4: 15, 5: 40 },
      '🦅': { 3: 8, 4: 25, 5: 75 },
      '⚱️': { 3: 15, 4: 50, 5: 150 },
      '👑': { 3: 50, 4: 200, 5: 1000 }
    },
    gridSize: [3, 4],
    wild: '👁️'
  },
  
  PIRATE: {
    symbols: ['⚓', '🗺️', '🏴‍☠️', '💎', '👑', '💰'],
    weights: [30, 25, 20, 15, 8, 2],
    payouts: {
      '⚓': { 3: 2, 4: 5, 5: 15 },
      '🗺️': { 3: 3, 4: 8, 5: 20 },
      '🏴‍☠️': { 3: 5, 4: 15, 5: 40 },
      '💎': { 3: 8, 4: 25, 5: 75 },
      '👑': { 3: 15, 4: 50, 5: 150 },
      '💰': { 3: 50, 4: 200, 5: 1000 }
    },
    gridSize: [4, 5],
    cascade: true
  },
  
  SPACE: {
    symbols: ['🌍', '🌙', '⭐', '🛸', '🚀', '👽'],
    weights: [30, 25, 20, 15, 8, 2],
    payouts: {
      '🌍': { 3: 2, 4: 5, 5: 15 },
      '🌙': { 3: 3, 4: 8, 5: 20 },
      '⭐': { 3: 5, 4: 15, 5: 40 },
      '🛸': { 3: 8, 4: 25, 5: 75 },
      '🚀': { 3: 15, 4: 50, 5: 150 },
      '👽': { 3: 50, 4: 200, 5: 1000 }
    },
    gridSize: [5, 4],
    megaways: true
  },
  
  CANDY: {
    symbols: ['🍬', '🍭', '🍫', '🍩', '🧁', '🍰'],
    weights: [25, 20, 18, 15, 12, 10],
    payouts: {
      '🍬': { 5: 5, 6: 8, 7: 12, 8: 20, 9: 30 },
      '🍭': { 5: 6, 6: 10, 7: 15, 8: 25, 9: 40 },
      '🍫': { 5: 8, 6: 15, 7: 25, 8: 40, 9: 60 },
      '🍩': { 5: 10, 6: 20, 7: 35, 8: 55, 9: 85 },
      '🧁': { 5: 15, 6: 30, 7: 50, 8: 80, 9: 120 },
      '🍰': { 5: 25, 6: 50, 7: 85, 8: 150, 9: 250 }
    },
    gridSize: [5, 5],
    clusterPays: true
  },
  
  DRAGON: {
    symbols: ['🔥', '⚔️', '💎', '👑', '🏰', '🐉'],
    weights: [28, 24, 20, 15, 10, 3],
    payouts: {
      '🔥': { 3: 2, 4: 6, 5: 15 },
      '⚔️': { 3: 3, 4: 9, 5: 22 },
      '💎': { 3: 5, 4: 15, 5: 45 },
      '👑': { 3: 8, 4: 25, 5: 80 },
      '🏰': { 3: 15, 4: 50, 5: 175 },
      '🐉': { 3: 50, 4: 250, 5: 1500 }
    },
    gridSize: [4, 5],
    expandingWild: '🐉'
  },
  
  WEST: {
    symbols: ['🤠', '🐴', '🔫', '⭐', '💰', '🎰'],
    weights: [26, 22, 18, 16, 12, 6],
    payouts: {
      '🤠': { 3: 3, 4: 8, 5: 20 },
      '🐴': { 3: 4, 4: 12, 5: 30 },
      '🔫': { 3: 6, 4: 18, 5: 50 },
      '⭐': { 3: 8, 4: 28, 5: 85 },
      '💰': { 3: 15, 4: 60, 5: 200 },
      '🎰': { 3: 40, 4: 180, 5: 800 }
    },
    gridSize: [3, 5],
    stickyWild: '⭐',
    scatter: '🎰'
  },
  
  OCEAN: {
    symbols: ['🐠', '🐟', '🐙', '🦈', '🐳', '🧜‍♀️'],
    weights: [28, 24, 20, 15, 10, 3],
    payouts: {
      '🐠': { 3: 2, 4: 7, 5: 18, 6: 40 },
      '🐟': { 3: 3, 4: 10, 5: 25, 6: 60 },
      '🐙': { 3: 5, 4: 16, 5: 45, 6: 100 },
      '🦈': { 3: 8, 4: 28, 5: 80, 6: 200 },
      '🐳': { 3: 15, 4: 55, 5: 160, 6: 450 },
      '🧜‍♀️': { 3: 50, 4: 220, 5: 700, 6: 2000 }
    },
    gridSize: [4, 6]
  }
};

/**
 * Select weighted random symbol
 */
function selectWeightedSymbol(symbols, weights, seed) {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const random = generateFairRandom(seed, totalWeight);
  
  let cumulativeWeight = 0;
  for (let i = 0; i < symbols.length; i++) {
    cumulativeWeight += weights[i];
    if (random < cumulativeWeight) {
      return symbols[i];
    }
  }
  
  return symbols[symbols.length - 1];
}

/**
 * Generate slot grid
 */
export function generateSlotGrid(slotType, seed) {
  const config = SLOT_CONFIGS[slotType];
  if (!config) {
    throw new Error(`Unknown slot type: ${slotType}`);
  }
  
  const [rows, cols] = config.gridSize;
  const grid = [];
  
  for (let row = 0; row < rows; row++) {
    const rowData = [];
    for (let col = 0; col < cols; col++) {
      const cellSeed = `${seed}-${row}-${col}`;
      const symbol = selectWeightedSymbol(config.symbols, config.weights, cellSeed);
      rowData.push(symbol);
    }
    grid.push(rowData);
  }
  
  return grid;
}

/**
 * Check horizontal paylines for wins
 */
function checkPayline(grid, rowIndex, payouts) {
  const row = grid[rowIndex];
  const firstSymbol = row[0];
  
  let matchCount = 1;
  for (let i = 1; i < row.length; i++) {
    if (row[i] === firstSymbol) {
      matchCount++;
    } else {
      break;
    }
  }
  
  const symbolPayout = payouts[firstSymbol];
  if (symbolPayout && symbolPayout[matchCount]) {
    return {
      symbol: firstSymbol,
      matchCount,
      payout: symbolPayout[matchCount]
    };
  }
  
  return null;
}

/**
 * Evaluate slot results
 */
export function evaluateSlotResult(slotType, grid, betAmount) {
  const config = SLOT_CONFIGS[slotType];
  const [rows, cols] = config.gridSize;
  
  let totalPayout = 0;
  const winningLines = [];
  
  // Check each row as a payline
  for (let row = 0; row < rows; row++) {
    const result = checkPayline(grid, row, config.payouts);
    if (result) {
      winningLines.push({ row, ...result });
      totalPayout += result.payout;
    }
  }
  
  // Apply house edge
  const finalPayout = Math.floor(totalPayout * betAmount * (1 - HOUSE_EDGE));
  const winAmount = winningLines.length > 0 ? finalPayout : 0;
  
  return {
    grid,
    winningLines,
    winAmount,
    multiplier: totalPayout,
    result: winAmount > 0 ? 'win' : 'loss'
  };
}

/**
 * Generate advanced slot result with proper RTP
 */
export function generateAdvancedSlotResult(seed, betAmount, slotType = 'EGYPTIAN') {
  const grid = generateSlotGrid(slotType, seed);
  const result = evaluateSlotResult(slotType, grid, betAmount);
  
  // Flatten grid for backward compatibility
  const reels = grid.flat();
  
  return {
    reels,
    grid,
    winAmount: result.winAmount,
    result: result.result,
    multiplier: result.multiplier,
    winningLines: result.winningLines
  };
}

/**
 * Calculate theoretical RTP for a slot configuration
 */
export function calculateRTP(slotType) {
  const config = SLOT_CONFIGS[slotType];
  let expectedReturn = 0;
  const totalWeight = config.weights.reduce((sum, w) => sum + w, 0);
  
  config.symbols.forEach((symbol, idx) => {
    const probability = config.weights[idx] / totalWeight;
    const symbolPayouts = config.payouts[symbol];
    
    if (symbolPayouts) {
      Object.entries(symbolPayouts).forEach(([matches, payout]) => {
        // Probability of N matches in a row
        const matchProbability = Math.pow(probability, parseInt(matches));
        expectedReturn += matchProbability * payout;
      });
    }
  });
  
  // Apply house edge
  const rtp = expectedReturn * (1 - HOUSE_EDGE) * 100;
  
  return {
    rtp: rtp.toFixed(2) + '%',
    houseEdge: (HOUSE_EDGE * 100).toFixed(2) + '%',
    expectedReturn: expectedReturn.toFixed(2)
  };
}

// Export for testing
export function testAllRTPs() {
  const results = {};
  Object.keys(SLOT_CONFIGS).forEach(slotType => {
    results[slotType] = calculateRTP(slotType);
  });
  return results;
}

