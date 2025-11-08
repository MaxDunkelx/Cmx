/**
 * GRID 5x4 SLOT ENGINE - MEGAWAYS
 * For: Space Megaways (5 rows × 4 columns)
 * 
 * Features:
 * - Maximum rows (5) for MEGAWAYS feel
 * - High volatility with more paylines
 * - Extended animation for dramatic effect
 * - Smooth 60fps animation
 */

const ICON_HEIGHT = 90; // Slightly smaller to fit 5 rows
const STRIP_LENGTH = 35; // Longer strip for variety
const SYMBOLS_VISIBLE = 5; // 5 rows
const NUM_REELS = 4; // 4 columns

// Animation constants - slightly faster for space theme
const SPIN_DURATION_BASE = 2200;
const REEL_STAGGER_DELAY = 350;
const ACCELERATION_TIME = 250;
const DECELERATION_TIME = 900;
const SPIN_SPEED_MAX = 45; // Faster for space theme
const BOUNCE_DISTANCE = 12;
const BOUNCE_DURATION = 180;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInQuad(t) {
  return t * t;
}

function createReelStrip(symbols, targetSymbols) {
  const strip = [];
  for (let i = 0; i < 16; i++) {
    strip.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }
  strip.push(...targetSymbols); // 5 target symbols
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

export class Grid5x4Engine {
  constructor(symbols, onAllReelsComplete) {
    this.symbols = symbols;
    this.onAllReelsComplete = onAllReelsComplete;
    this.reels = [];
    this.completedReels = 0;
  }
  
  spin(targetGrid) {
    this.completedReels = 0;
    this.reels = [];
    
    for (let col = 0; col < NUM_REELS; col++) {
      const targetSymbols = targetGrid[col]; // 5 symbols
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
    console.log(`🚀 Reel ${reelIndex} complete (${this.completedReels}/${NUM_REELS})`);
    
    if (this.completedReels === NUM_REELS) {
      console.log('🌌 MEGAWAYS complete!');
      this.onAllReelsComplete();
    }
  }
  
  getReelsState() {
    return this.reels.map(reel => reel.getState());
  }
  
  stopAll() {
    this.reels.forEach(reel => reel.stop());
  }
}

/**
 * Check winning combinations for 5x4 grid (MEGAWAYS style)
 */
export function checkWins5x4(grid) {
  const wins = [];
  
  const paylines = [
    { name: 'Cosmic 1', pattern: [[0,0], [0,1], [0,2], [0,3]], id: 1 },
    { name: 'Cosmic 2', pattern: [[1,0], [1,1], [1,2], [1,3]], id: 2 },
    { name: 'Cosmic 3', pattern: [[2,0], [2,1], [2,2], [2,3]], id: 3 },
    { name: 'Cosmic 4', pattern: [[3,0], [3,1], [3,2], [3,3]], id: 4 },
    { name: 'Cosmic 5', pattern: [[4,0], [4,1], [4,2], [4,3]], id: 5 },
    { name: 'Meteor', pattern: [[0,0], [1,1], [2,2], [3,3]], id: 6 },
    { name: 'Star Trail', pattern: [[4,0], [3,1], [2,2], [1,3]], id: 7 },
    { name: 'Galaxy V', pattern: [[2,0], [1,1], [0,2], [1,3]], id: 8 },
    { name: 'Nebula Λ', pattern: [[2,0], [3,1], [4,2], [3,3]], id: 9 }
  ];
  
  paylines.forEach(payline => {
    const symbols = payline.pattern.map(([row, col]) => grid[row]?.[col]);
    if (symbols.some(s => !s)) return;
    
    // Check all 4 match
    if (symbols.every(s => s === symbols[0])) {
      wins.push({
        paylineId: payline.id,
        paylineName: payline.name,
        symbol: symbols[0],
        count: 4,
        positions: payline.pattern
      });
    }
    // Check first 3 match
    else if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
      wins.push({
        paylineId: payline.id,
        paylineName: payline.name,
        symbol: symbols[0],
        count: 3,
        positions: payline.pattern.slice(0, 3)
      });
    }
  });
  
  return {
    isWin: wins.length > 0,
    wins: wins,
    totalWins: wins.length
  };
}

export default Grid5x4Engine;

