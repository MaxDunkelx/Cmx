/**
 * GRID 3x5 SLOT ENGINE
 * For: Wild West Bonanza (3 rows × 5 columns)
 * 
 * Features:
 * - Classic 3-row layout with 5 reels
 * - Fast-paced Western action
 * - Smooth galloping animation
 * - 5 traditional paylines
 */

const ICON_HEIGHT = 120; // Standard height for 3 rows
const STRIP_LENGTH = 30;
const SYMBOLS_VISIBLE = 3;
const NUM_REELS = 5; // 5 columns

// Animation constants - quick western feel
const SPIN_DURATION_BASE = 1800; // Faster for action-packed feel
const REEL_STAGGER_DELAY = 250;
const ACCELERATION_TIME = 180;
const DECELERATION_TIME = 600;
const SPIN_SPEED_MAX = 38;
const BOUNCE_DISTANCE = 10;
const BOUNCE_DURATION = 120;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInQuad(t) {
  return t * t;
}

function createReelStrip(symbols, targetSymbols) {
  const strip = [];
  for (let i = 0; i < 15; i++) {
    strip.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }
  strip.push(...targetSymbols); // 3 target symbols
  for (let i = 0; i < 12; i++) {
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
    const targetPosition = calculateTargetPosition(15);
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

export class Grid3x5Engine {
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
      const targetSymbols = targetGrid[col]; // 3 symbols
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
    console.log(`🤠 Reel ${reelIndex} complete (${this.completedReels}/${NUM_REELS})`);
    
    if (this.completedReels === NUM_REELS) {
      console.log('🏇 YEEHAW! All reels complete!');
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
 * Check winning combinations for 3x5 grid
 */
export function checkWins3x5(grid) {
  const wins = [];
  
  const paylines = [
    { name: 'Top Trail', pattern: [[0,0], [0,1], [0,2], [0,3], [0,4]], id: 1 },
    { name: 'Middle Trail', pattern: [[1,0], [1,1], [1,2], [1,3], [1,4]], id: 2 },
    { name: 'Bottom Trail', pattern: [[2,0], [2,1], [2,2], [2,3], [2,4]], id: 3 },
    { name: 'V Gallop', pattern: [[0,0], [1,1], [2,2], [1,3], [0,4]], id: 4 },
    { name: 'Λ Gallop', pattern: [[2,0], [1,1], [0,2], [1,3], [2,4]], id: 5 }
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
        positions: payline.pattern
      });
    }
    // Check first 4 match
    else if (symbols[0] === symbols[1] && symbols[1] === symbols[2] && symbols[2] === symbols[3]) {
      wins.push({
        paylineId: payline.id,
        paylineName: payline.name,
        symbol: symbols[0],
        count: 4,
        positions: payline.pattern.slice(0, 4)
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

export default Grid3x5Engine;

