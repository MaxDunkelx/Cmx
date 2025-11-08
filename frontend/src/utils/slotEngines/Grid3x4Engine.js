/**
 * GRID 3x4 SLOT ENGINE
 * For: Egyptian Treasure (3 rows × 4 columns)
 * 
 * Professional slot machine animation engine with:
 * - Smooth 60fps requestAnimationFrame animation
 * - Realistic easing with acceleration and deceleration
 * - Infinite looping symbol strips
 * - Precise landing on target symbols
 * - Staggered reel stopping for authentic casino feel
 */

const ICON_HEIGHT = 120; // Height of each symbol in pixels
const STRIP_LENGTH = 30; // Number of symbols in the virtual strip
const SYMBOLS_VISIBLE = 3; // Number of symbols visible per reel (rows)
const NUM_REELS = 4; // Number of reels (columns)

// Physics constants for realistic motion
const SPIN_DURATION_BASE = 2000; // Base spin duration in ms
const REEL_STAGGER_DELAY = 300; // Delay between each reel stopping
const ACCELERATION_TIME = 200; // Time to reach full speed
const DECELERATION_TIME = 800; // Time to slow down
const SPIN_SPEED_MAX = 40; // Max pixels per frame at full speed
const BOUNCE_DISTANCE = 10; // Pixels for bounce-back effect
const BOUNCE_DURATION = 150; // Bounce animation duration

/**
 * Easing function for smooth deceleration (ease-out-cubic)
 */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Easing function for acceleration (ease-in-quad)
 */
function easeInQuad(t) {
  return t * t;
}

/**
 * Creates a reel strip with random symbols and target symbols positioned correctly
 */
function createReelStrip(symbols, targetSymbols) {
  const strip = [];
  
  // Add random symbols before target
  for (let i = 0; i < 15; i++) {
    strip.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }
  
  // Add target symbols (3 symbols for this reel)
  strip.push(...targetSymbols);
  
  // Add random symbols after target
  for (let i = 0; i < 12; i++) {
    strip.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }
  
  return strip;
}

/**
 * Calculate the target position to show the correct symbols
 */
function calculateTargetPosition(stripLength, targetStartIndex) {
  // We want the target symbols (at indices 15, 16, 17) centered in the visible area
  return -(targetStartIndex * ICON_HEIGHT);
}

/**
 * Main animation controller for a single reel
 */
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
      // Still spinning - calculate velocity based on phase
      if (elapsed < ACCELERATION_TIME) {
        // Acceleration phase
        const accelProgress = elapsed / ACCELERATION_TIME;
        this.velocity = SPIN_SPEED_MAX * easeInQuad(accelProgress);
      } else if (elapsed > this.duration - DECELERATION_TIME) {
        // Deceleration phase
        const decelStart = this.duration - DECELERATION_TIME;
        const decelProgress = (elapsed - decelStart) / DECELERATION_TIME;
        this.velocity = SPIN_SPEED_MAX * (1 - easeOutCubic(decelProgress));
      } else {
        // Constant speed phase
        this.velocity = SPIN_SPEED_MAX;
      }
      
      // Update position
      this.position -= this.velocity;
      
      // Loop position if needed
      const maxScroll = this.strip.length * ICON_HEIGHT;
      if (Math.abs(this.position) >= maxScroll) {
        this.position = 0;
      }
      
      this.animationFrame = requestAnimationFrame(this.animate);
    } else {
      // Spin complete - land on target with bounce
      this.landOnTarget();
    }
  }
  
  landOnTarget() {
    const targetPosition = calculateTargetPosition(this.strip.length, 15);
    
    // Overshoot slightly for bounce effect
    this.position = targetPosition - BOUNCE_DISTANCE;
    
    // Bounce back to exact position
    setTimeout(() => {
      this.position = targetPosition;
      this.isSpinning = false;
      
      // Notify completion after bounce settles
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

/**
 * Main slot machine controller for 3x4 grid
 */
export class Grid3x4Engine {
  constructor(symbols, onAllReelsComplete) {
    this.symbols = symbols;
    this.onAllReelsComplete = onAllReelsComplete;
    this.reels = [];
    this.completedReels = 0;
  }
  
  /**
   * Start spinning with target symbols
   * @param {Array} targetGrid - 2D array [column][row] of target symbols
   */
  spin(targetGrid) {
    this.completedReels = 0;
    this.reels = [];
    
    // Create animator for each reel
    for (let col = 0; col < NUM_REELS; col++) {
      const targetSymbols = targetGrid[col]; // Array of 3 symbols for this column
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
    console.log(`✅ Reel ${reelIndex} complete (${this.completedReels}/${NUM_REELS})`);
    
    if (this.completedReels === NUM_REELS) {
      console.log('🎰 All reels complete!');
      this.onAllReelsComplete();
    }
  }
  
  /**
   * Get current state of all reels for rendering
   */
  getReelsState() {
    return this.reels.map(reel => reel.getState());
  }
  
  /**
   * Stop all animations
   */
  stopAll() {
    this.reels.forEach(reel => reel.stop());
  }
}

/**
 * Check winning combinations for 3x4 grid
 * @param {Array} grid - 2D array [row][column] of symbols
 * @returns {Object} - { isWin, paylines, multiplier }
 */
export function checkWins3x4(grid) {
  const wins = [];
  
  // Define all 9 paylines for 3x4 grid
  const paylines = [
    { name: 'Top', pattern: [[0,0], [0,1], [0,2], [0,3]], id: 1 },
    { name: 'Middle', pattern: [[1,0], [1,1], [1,2], [1,3]], id: 2 },
    { name: 'Bottom', pattern: [[2,0], [2,1], [2,2], [2,3]], id: 3 },
    { name: 'V Shape', pattern: [[0,0], [1,1], [2,2], [1,3]], id: 4 },
    { name: 'Λ Shape', pattern: [[2,0], [1,1], [0,2], [1,3]], id: 5 },
    { name: 'W Shape', pattern: [[1,0], [0,1], [1,2], [2,3]], id: 6 },
    { name: 'M Shape', pattern: [[1,0], [2,1], [1,2], [0,3]], id: 7 },
    { name: 'Valley', pattern: [[0,0], [1,1], [1,2], [0,3]], id: 8 },
    { name: 'Hill', pattern: [[2,0], [1,1], [1,2], [2,3]], id: 9 }
  ];
  
  paylines.forEach(payline => {
    const symbols = payline.pattern.map(([row, col]) => grid[row]?.[col]);
    
    // Check if all symbols exist
    if (symbols.some(s => !s)) return;
    
    // Check for matches (3 or 4 consecutive)
    // Check all 4 match
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2] && symbols[2] === symbols[3]) {
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
    // Check last 3 match
    else if (symbols[1] === symbols[2] && symbols[2] === symbols[3]) {
      wins.push({
        paylineId: payline.id,
        paylineName: payline.name,
        symbol: symbols[1],
        count: 3,
        positions: payline.pattern.slice(1, 4)
      });
    }
  });
  
  return {
    isWin: wins.length > 0,
    wins: wins,
    totalWins: wins.length
  };
}

export default Grid3x4Engine;

