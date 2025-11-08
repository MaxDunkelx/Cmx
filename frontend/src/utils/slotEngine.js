/**
 * Advanced Slot Machine Engine
 * Handles probability, paylines, RTP calculations, and game mechanics
 */

// Win tier thresholds for animation intensity
export const WIN_TIERS = {
  MINI: { min: 1, max: 2.99, duration: 800, name: 'MINI WIN' },
  STANDARD: { min: 3, max: 9.99, duration: 2000, name: 'BIG WIN' },
  BIG: { min: 10, max: 49.99, duration: 4000, name: 'MEGA WIN' },
  MEGA: { min: 50, max: 99.99, duration: 6000, name: 'SUPER WIN' },
  LEGENDARY: { min: 100, max: Infinity, duration: 10000, name: 'LEGENDARY' }
};

// Get win tier based on multiplier
export const getWinTier = (multiplier) => {
  for (const [tier, config] of Object.entries(WIN_TIERS)) {
    if (multiplier >= config.min && multiplier <= config.max) {
      return { tier, ...config };
    }
  }
  return { tier: 'MINI', ...WIN_TIERS.MINI };
};

/**
 * Standard payline patterns for 3x4, 4x5, 5x4 grids
 * Each pattern is an array of [row, col] coordinates
 */
export const PAYLINE_PATTERNS = {
  '3x4': [
    // Horizontal lines
    [[0,0], [0,1], [0,2], [0,3]], // Top
    [[1,0], [1,1], [1,2], [1,3]], // Middle
    [[2,0], [2,1], [2,2], [2,3]], // Bottom
    
    // Diagonal and zigzag patterns
    [[0,0], [1,1], [2,2], [1,3]], // V shape
    [[2,0], [1,1], [0,2], [1,3]], // ^ shape
    [[1,0], [0,1], [1,2], [2,3]], // W shape
    [[1,0], [2,1], [1,2], [0,3]], // M shape
    [[0,0], [1,1], [1,2], [0,3]], // Valley
    [[2,0], [1,1], [1,2], [2,3]], // Hill
  ],
  
  '4x5': [
    // 20 paylines for 4x5 grid
    // Horizontal
    [[0,0], [0,1], [0,2], [0,3], [0,4]],
    [[1,0], [1,1], [1,2], [1,3], [1,4]],
    [[2,0], [2,1], [2,2], [2,3], [2,4]],
    [[3,0], [3,1], [3,2], [3,3], [3,4]],
    
    // Zigzag patterns
    [[0,0], [1,1], [2,2], [1,3], [0,4]],
    [[3,0], [2,1], [1,2], [2,3], [3,4]],
    [[1,0], [0,1], [1,2], [2,3], [1,4]],
    [[2,0], [3,1], [2,2], [1,3], [2,4]],
    
    // V and W shapes
    [[0,0], [1,1], [2,2], [3,3], [2,4]],
    [[3,0], [2,1], [1,2], [0,3], [1,4]],
    [[1,0], [2,1], [3,2], [2,3], [1,4]],
    [[2,0], [1,1], [0,2], [1,3], [2,4]],
    
    // Complex patterns
    [[0,0], [0,1], [1,2], [2,3], [2,4]],
    [[3,0], [3,1], [2,2], [1,3], [1,4]],
    [[1,0], [1,1], [2,2], [2,3], [2,4]],
    [[2,0], [2,1], [1,2], [1,3], [1,4]],
    [[0,0], [1,1], [1,2], [1,3], [0,4]],
    [[3,0], [2,1], [2,2], [2,3], [3,4]],
    [[1,0], [2,1], [2,2], [2,3], [1,4]],
    [[2,0], [1,1], [1,2], [1,3], [2,4]],
  ],
  
  '5x4': [
    // 25 paylines for 5x4 grid
    // Horizontal
    [[0,0], [0,1], [0,2], [0,3]],
    [[1,0], [1,1], [1,2], [1,3]],
    [[2,0], [2,1], [2,2], [2,3]],
    [[3,0], [3,1], [3,2], [3,3]],
    [[4,0], [4,1], [4,2], [4,3]],
    
    // Zigzag
    [[0,0], [1,1], [2,2], [3,3]],
    [[4,0], [3,1], [2,2], [1,3]],
    [[1,0], [2,1], [3,2], [2,3]],
    [[3,0], [2,1], [1,2], [2,3]],
    
    // Complex patterns (20 total lines)
    [[0,0], [1,1], [2,2], [2,3]],
    [[4,0], [3,1], [2,2], [2,3]],
    [[2,0], [1,1], [0,2], [1,3]],
    [[2,0], [3,1], [4,2], [3,3]],
    [[1,0], [0,1], [1,2], [2,3]],
    [[3,0], [4,1], [3,2], [2,3]],
    [[0,0], [1,1], [1,2], [0,3]],
    [[4,0], [3,1], [3,2], [4,3]],
    [[1,0], [1,1], [2,2], [3,3]],
    [[3,0], [3,1], [2,2], [1,3]],
    [[2,0], [2,1], [1,2], [1,3]],
    [[2,0], [2,1], [3,2], [3,3]],
    [[1,0], [2,1], [2,2], [1,3]],
    [[3,0], [2,1], [2,2], [3,3]],
    [[0,0], [1,1], [3,2], [4,3]],
    [[4,0], [3,1], [1,2], [0,3]],
  ]
};

/**
 * Check if a pattern is a winning combination
 */
export const checkPayline = (grid, pattern, minMatches = 3) => {
  const symbols = pattern.map(([row, col]) => grid[row]?.[col]).filter(Boolean);
  
  if (symbols.length < minMatches) return null;
  
  // Check if first N symbols match
  const firstSymbol = symbols[0];
  if (firstSymbol === '?' || firstSymbol === 'WILD') return null;
  
  let matchCount = 1;
  for (let i = 1; i < symbols.length; i++) {
    if (symbols[i] === firstSymbol || symbols[i] === 'WILD') {
      matchCount++;
    } else {
      break;
    }
  }
  
  if (matchCount >= minMatches) {
    return {
      symbol: firstSymbol,
      matchCount,
      positions: pattern.slice(0, matchCount)
    };
  }
  
  return null;
};

/**
 * Evaluate all paylines and return winning lines
 */
export const evaluatePaylines = (grid, gridSize, symbolPayouts) => {
  const paylines = PAYLINE_PATTERNS[gridSize] || [];
  const winningLines = [];
  let totalWin = 0;
  
  paylines.forEach((pattern, lineIndex) => {
    const result = checkPayline(grid, pattern);
    if (result) {
      const symbolConfig = symbolPayouts[result.symbol];
      if (symbolConfig) {
        const payout = symbolConfig[result.matchCount] || 0;
        if (payout > 0) {
          winningLines.push({
            lineIndex,
            pattern,
            ...result,
            payout,
            positions: result.positions
          });
          totalWin += payout;
        }
      }
    }
  });
  
  return { winningLines, totalWin };
};

/**
 * Find cluster matches (for cluster pays mechanics)
 * Returns groups of 5+ adjacent matching symbols
 */
export const findClusters = (grid, minClusterSize = 5) => {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const visited = Array(rows).fill().map(() => Array(cols).fill(false));
  const clusters = [];
  
  const directions = [[0,1], [1,0], [0,-1], [-1,0]]; // Right, Down, Left, Up
  
  const floodFill = (row, col, symbol) => {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return [];
    if (visited[row][col]) return [];
    if (grid[row][col] !== symbol) return [];
    
    visited[row][col] = true;
    let cluster = [[row, col]];
    
    for (const [dr, dc] of directions) {
      cluster = cluster.concat(floodFill(row + dr, col + dc, symbol));
    }
    
    return cluster;
  };
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!visited[row][col] && grid[row][col] && grid[row][col] !== '?') {
        const cluster = floodFill(row, col, grid[row][col]);
        if (cluster.length >= minClusterSize) {
          clusters.push({
            symbol: grid[row][col],
            positions: cluster,
            size: cluster.length
          });
        }
      }
    }
  }
  
  return clusters;
};

/**
 * Calculate weighted random symbol selection
 */
export const selectWeightedSymbol = (symbols) => {
  const totalWeight = symbols.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const symbol of symbols) {
    random -= symbol.weight;
    if (random <= 0) {
      return symbol.value;
    }
  }
  
  return symbols[symbols.length - 1].value;
};

/**
 * Generate a random grid based on symbol weights
 */
export const generateGrid = (rows, cols, symbolWeights) => {
  const grid = [];
  
  for (let row = 0; row < rows; row++) {
    const rowData = [];
    for (let col = 0; col < cols; col++) {
      rowData.push(selectWeightedSymbol(symbolWeights));
    }
    grid.push(rowData);
  }
  
  return grid;
};

/**
 * Simulate cascade mechanics - remove winning symbols and drop new ones
 */
export const processCascade = (grid, winningPositions) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = grid.map(row => [...row]);
  
  // Sort positions by column, then by row (bottom to top)
  const sortedPositions = [...winningPositions].sort((a, b) => {
    if (a[1] !== b[1]) return a[1] - b[1];
    return b[0] - a[0];
  });
  
  // Mark winning positions as empty
  sortedPositions.forEach(([row, col]) => {
    newGrid[row][col] = null;
  });
  
  // Drop symbols down
  for (let col = 0; col < cols; col++) {
    let writePos = rows - 1;
    
    // Move existing symbols down
    for (let row = rows - 1; row >= 0; row--) {
      if (newGrid[row][col] !== null) {
        if (writePos !== row) {
          newGrid[writePos][col] = newGrid[row][col];
          newGrid[row][col] = null;
        }
        writePos--;
      }
    }
  }
  
  return newGrid;
};

/**
 * Calculate RTP for a given symbol configuration
 */
export const calculateRTP = (symbolWeights, symbolPayouts, gridSize) => {
  const [rows, cols] = gridSize.split('x').map(Number);
  let totalPayout = 0;
  let totalCombinations = 1;
  
  // Simplified RTP calculation
  symbolWeights.forEach(symbol => {
    const probability = symbol.weight / 100; // Assuming weights sum to 100
    const payouts = symbolPayouts[symbol.value];
    
    if (payouts) {
      Object.entries(payouts).forEach(([matches, payout]) => {
        const matchProb = Math.pow(probability, parseInt(matches));
        totalPayout += matchProb * payout;
      });
    }
  });
  
  return totalPayout;
};

/**
 * Symbol configuration templates
 */
export const SYMBOL_CONFIGS = {
  EGYPTIAN: {
    symbols: [
      { value: '🏺', weight: 30, rarity: 'common' },
      { value: '👁️', weight: 25, rarity: 'common' },
      { value: '🐍', weight: 20, rarity: 'uncommon' },
      { value: '🦅', weight: 15, rarity: 'rare' },
      { value: '⚱️', weight: 8, rarity: 'epic' },
      { value: '👑', weight: 2, rarity: 'legendary' },
    ],
    payouts: {
      '🏺': { 3: 2, 4: 5, 5: 15 },
      '👁️': { 3: 3, 4: 8, 5: 20 },
      '🐍': { 3: 5, 4: 15, 5: 40 },
      '🦅': { 3: 8, 4: 25, 5: 75 },
      '⚱️': { 3: 15, 4: 50, 5: 150 },
      '👑': { 3: 50, 4: 200, 5: 1000 },
    },
    wild: '👁️',
    scatter: '👑'
  },
  
  PIRATE: {
    symbols: [
      { value: '⚓', weight: 30, rarity: 'common' },
      { value: '🗺️', weight: 25, rarity: 'common' },
      { value: '🏴‍☠️', weight: 20, rarity: 'uncommon' },
      { value: '💎', weight: 15, rarity: 'rare' },
      { value: '👑', weight: 8, rarity: 'epic' },
      { value: '💰', weight: 2, rarity: 'legendary' },
    ],
    payouts: {
      '⚓': { 3: 2, 4: 5, 5: 15 },
      '🗺️': { 3: 3, 4: 8, 5: 20 },
      '🏴‍☠️': { 3: 5, 4: 15, 5: 40 },
      '💎': { 3: 8, 4: 25, 5: 75 },
      '👑': { 3: 15, 4: 50, 5: 150 },
      '💰': { 3: 50, 4: 200, 5: 1000 },
    },
    wild: '🏴‍☠️',
    scatter: '💰'
  },
  
  SPACE: {
    symbols: [
      { value: '🌍', weight: 30, rarity: 'common' },
      { value: '🌙', weight: 25, rarity: 'common' },
      { value: '⭐', weight: 20, rarity: 'uncommon' },
      { value: '🛸', weight: 15, rarity: 'rare' },
      { value: '🚀', weight: 8, rarity: 'epic' },
      { value: '👽', weight: 2, rarity: 'legendary' },
    ],
    payouts: {
      '🌍': { 3: 2, 4: 5, 5: 15 },
      '🌙': { 3: 3, 4: 8, 5: 20 },
      '⭐': { 3: 5, 4: 15, 5: 40 },
      '🛸': { 3: 8, 4: 25, 5: 75 },
      '🚀': { 3: 15, 4: 50, 5: 150 },
      '👽': { 3: 50, 4: 200, 5: 1000 },
    },
    wild: '⭐',
    scatter: '👽'
  }
};

