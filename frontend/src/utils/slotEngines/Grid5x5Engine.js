/**
 * GRID 5x5 SLOT ENGINE - CLUSTER PAYS
 * For: Candy Cluster (5 rows × 5 columns)
 * 
 * Features:
 * - CLUSTER PAYS: Match 5+ adjacent symbols (horizontal/vertical)
 * - CASCADE MECHANICS: Winners explode, new symbols drop
 * - Chain reactions with multiplier
 * - Sweet smooth animations
 */

const ICON_HEIGHT = 85; // Fit 5x5 grid nicely
const STRIP_LENGTH = 35;
const SYMBOLS_VISIBLE = 5;
const NUM_REELS = 5; // 5 columns for square grid

// Animation constants - bouncy candy feel
const SPIN_DURATION_BASE = 2000;
const REEL_STAGGER_DELAY = 280; // Faster for playful feel
const ACCELERATION_TIME = 180;
const DECELERATION_TIME = 700;
const SPIN_SPEED_MAX = 35;
const BOUNCE_DISTANCE = 15; // More bounce for candy theme
const BOUNCE_DURATION = 200;

// Cascade constants
const CASCADE_DROP_SPEED = 12;
const CASCADE_DELAY = 600;
const EXPLOSION_DURATION = 400;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInQuad(t) {
  return t * t;
}

function easeOutBounce(t) {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
}

function createReelStrip(symbols, targetSymbols) {
  const strip = [];
  for (let i = 0; i < 16; i++) {
    strip.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }
  strip.push(...targetSymbols);
  for (let i = 0; i < 14; i++) {
    strip.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }
  return strip;
}

function calculateTargetPosition(targetStartIndex) {
  return -(targetStartIndex * ICON_HEIGHT);
}

class ReelAnimator {
  constructor(reelIndex, symbols, targetSymbols, onComplete) {
    this.reelIndex = reelIndex;
    this.symbols = symbols;
    this.targetSymbols = targetSymbols;
    this.onComplete = onComplete;
    this.strip = createReelStrip(symbols, targetSymbols);
    this.position = 0;
    this.velocity = 0;
    this.isSpinning = false;
    this.animationFrame = null;
    this.startTime = null;
    this.duration = SPIN_DURATION_BASE + (reelIndex * REEL_STAGGER_DELAY);
  }
  
  start() {
    this.isSpinning = true;
    this.startTime = null;
    this.position = 0;
    this.animate();
  }
  
  animate = (timestamp) => {
    if (!this.isSpinning) return;
    
    if (!this.startTime) {
      this.startTime = timestamp;
    }
    
    const elapsed = timestamp - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);
    
    if (progress < 1) {
      if (elapsed < ACCELERATION_TIME) {
        const accelProgress = elapsed / ACCELERATION_TIME;
        this.velocity = SPIN_SPEED_MAX * easeInQuad(accelProgress);
      } else if (elapsed > this.duration - DECELERATION_TIME) {
        const decelStart = this.duration - DECELERATION_TIME;
        const decelProgress = (elapsed - decelStart) / DECELERATION_TIME;
        this.velocity = SPIN_SPEED_MAX * (1 - easeOutCubic(decelProgress));
      } else {
        this.velocity = SPIN_SPEED_MAX;
      }
      
      this.position -= this.velocity;
      const maxScroll = this.strip.length * ICON_HEIGHT;
      if (Math.abs(this.position) >= maxScroll) {
        this.position = 0;
      }
      
      this.animationFrame = requestAnimationFrame(this.animate);
    } else {
      this.landOnTarget();
    }
  }
  
  landOnTarget() {
    const targetPosition = calculateTargetPosition(16);
    this.position = targetPosition - BOUNCE_DISTANCE;
    
    setTimeout(() => {
      this.position = targetPosition;
      this.isSpinning = false;
      setTimeout(() => {
        this.onComplete(this.reelIndex);
      }, 100);
    }, BOUNCE_DURATION);
  }
  
  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.isSpinning = false;
  }
  
  getState() {
    return {
      position: this.position,
      strip: this.strip,
      isSpinning: this.isSpinning
    };
  }
}

export class Grid5x5Engine {
  constructor(symbols, onAllReelsComplete) {
    this.symbols = symbols;
    this.onAllReelsComplete = onAllReelsComplete;
    this.reels = [];
    this.completedReels = 0;
    this.cascadeMultiplier = 1;
  }
  
  spin(targetGrid) {
    this.completedReels = 0;
    this.reels = [];
    this.cascadeMultiplier = 1;
    
    for (let col = 0; col < NUM_REELS; col++) {
      const targetSymbols = targetGrid[col];
      const animator = new ReelAnimator(
        col,
        this.symbols,
        targetSymbols,
        this.handleReelComplete
      );
      this.reels.push(animator);
      animator.start();
    }
  }
  
  handleReelComplete = (reelIndex) => {
    this.completedReels++;
    console.log(`🍬 Reel ${reelIndex} complete (${this.completedReels}/${NUM_REELS})`);
    
    if (this.completedReels === NUM_REELS) {
      console.log('🎂 CANDY complete!');
      this.onAllReelsComplete();
    }
  }
  
  getReelsState() {
    return this.reels.map(reel => reel.getState());
  }
  
  getCascadeMultiplier() {
    return this.cascadeMultiplier;
  }
  
  stopAll() {
    this.reels.forEach(reel => reel.stop());
  }
}

/**
 * Find clusters of matching symbols (5+ adjacent)
 * Uses flood-fill algorithm to find connected groups
 */
function findClusters(grid, symbol, startRow, startCol, visited) {
  if (startRow < 0 || startRow >= 5 || startCol < 0 || startCol >= 5) {
    return [];
  }
  
  const key = `${startRow},${startCol}`;
  if (visited.has(key)) {
    return [];
  }
  
  if (grid[startRow][startCol] !== symbol) {
    return [];
  }
  
  visited.add(key);
  const cluster = [[startRow, startCol]];
  
  // Check 4 adjacent positions (up, down, left, right)
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  for (const [dr, dc] of directions) {
    const newRow = startRow + dr;
    const newCol = startCol + dc;
    const adjacentCells = findClusters(grid, symbol, newRow, newCol, visited);
    cluster.push(...adjacentCells);
  }
  
  return cluster;
}

/**
 * Check cluster pays for 5x5 grid
 */
export function checkWins5x5(grid) {
  const wins = [];
  const visited = new Set();
  
  // Check each cell for potential cluster start
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const key = `${row},${col}`;
      if (visited.has(key)) continue;
      
      const symbol = grid[row][col];
      if (!symbol) continue;
      
      const cluster = findClusters(grid, symbol, row, col, visited);
      
      // Cluster pays require 5+ matching symbols
      if (cluster.length >= 5) {
        wins.push({
          symbol: symbol,
          count: cluster.length,
          positions: cluster,
          type: 'cluster'
        });
      }
    }
  }
  
  // Also check traditional paylines for variety
  const paylines = [
    { name: 'Top', pattern: [[0,0], [0,1], [0,2], [0,3], [0,4]], id: 1 },
    { name: 'Middle', pattern: [[2,0], [2,1], [2,2], [2,3], [2,4]], id: 2 },
    { name: 'Bottom', pattern: [[4,0], [4,1], [4,2], [4,3], [4,4]], id: 3 },
    { name: 'Diagonal 1', pattern: [[0,0], [1,1], [2,2], [3,3], [4,4]], id: 4 },
    { name: 'Diagonal 2', pattern: [[4,0], [3,1], [2,2], [1,3], [0,4]], id: 5 }
  ];
  
  paylines.forEach(payline => {
    const symbols = payline.pattern.map(([row, col]) => grid[row]?.[col]);
    if (symbols.some(s => !s)) return;
    
    // Check all 5 match
    if (symbols.every(s => s === symbols[0])) {
      wins.push({
        paylineId: payline.id,
        paylineName: payline.name,
        symbol: symbols[0],
        count: 5,
        positions: payline.pattern,
        type: 'payline'
      });
    }
    // Check first 3 match
    else if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
      wins.push({
        paylineId: payline.id,
        paylineName: payline.name,
        symbol: symbols[0],
        count: 3,
        positions: payline.pattern.slice(0, 3),
        type: 'payline'
      });
    }
  });
  
  return {
    isWin: wins.length > 0,
    wins: wins,
    totalWins: wins.length,
    hasCluster: wins.some(w => w.type === 'cluster')
  };
}

export default Grid5x5Engine;

