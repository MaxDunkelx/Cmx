/**
 * GRID 4x6 SLOT ENGINE - OCEAN DEPTHS
 * For: Ocean Depths (4 rows × 6 columns)
 * 
 * Features:
 * - LARGEST GRID! 6 columns × 4 rows = 24 symbols
 * - 15 paylines for maximum winning potential
 * - Flowing underwater animation
 * - Extended spin time for dramatic deep-sea effect
 */

const ICON_HEIGHT = 95; // Balanced for 4 rows
const STRIP_LENGTH = 35; // Longer strip for variety
const SYMBOLS_VISIBLE = 4;
const NUM_REELS = 6; // 6 columns - biggest!

// Animation constants - flowing underwater feel
const SPIN_DURATION_BASE = 2400; // Longer for dramatic effect
const REEL_STAGGER_DELAY = 280;
const ACCELERATION_TIME = 300; // Slower acceleration (underwater)
const DECELERATION_TIME = 1000; // Longer deceleration (water resistance)
const SPIN_SPEED_MAX = 35; // Moderate speed (underwater)
const BOUNCE_DISTANCE = 8; // Subtle bounce (water dampens)
const BOUNCE_DURATION = 200;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInQuad(t) {
  return t * t;
}

// Smooth wave-like easing
function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function createReelStrip(symbols, targetSymbols) {
  const strip = [];
  for (let i = 0; i < 16; i++) {
    strip.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }
  strip.push(...targetSymbols); // 4 target symbols
  for (let i = 0; i < 15; i++) {
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
        // Use sine easing for smooth wave-like deceleration
        this.velocity = SPIN_SPEED_MAX * (1 - easeInOutSine(decelProgress));
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

export class Grid4x6Engine {
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
      const targetSymbols = targetGrid[col]; // 4 symbols
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
    console.log(`🧜‍♀️ Reel ${reelIndex} complete (${this.completedReels}/${NUM_REELS})`);
    
    if (this.completedReels === NUM_REELS) {
      console.log('🌊 OCEAN DEPTHS complete!');
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
 * Check winning combinations for 4x6 grid
 * Most paylines of any grid! (15 total)
 */
export function checkWins4x6(grid) {
  const wins = [];
  
  const paylines = [
    // 4 Horizontal paylines
    { name: 'Surface', pattern: [[0,0], [0,1], [0,2], [0,3], [0,4], [0,5]], id: 1 },
    { name: 'Shallow', pattern: [[1,0], [1,1], [1,2], [1,3], [1,4], [1,5]], id: 2 },
    { name: 'Deep', pattern: [[2,0], [2,1], [2,2], [2,3], [2,4], [2,5]], id: 3 },
    { name: 'Abyss', pattern: [[3,0], [3,1], [3,2], [3,3], [3,4], [3,5]], id: 4 },
    
    // 2 Diagonal paylines
    { name: 'Wave 1', pattern: [[0,0], [1,1], [2,2], [3,3], [2,4], [1,5]], id: 5 },
    { name: 'Wave 2', pattern: [[3,0], [2,1], [1,2], [0,3], [1,4], [2,5]], id: 6 },
    
    // Complex patterns for 6 columns
    { name: 'Coral Rise', pattern: [[1,0], [2,1], [3,2], [3,3], [2,4], [1,5]], id: 7 },
    { name: 'Coral Dive', pattern: [[2,0], [1,1], [0,2], [0,3], [1,4], [2,5]], id: 8 },
    { name: 'Current 1', pattern: [[0,0], [1,1], [1,2], [2,3], [2,4], [3,5]], id: 9 },
    { name: 'Current 2', pattern: [[3,0], [2,1], [2,2], [1,3], [1,4], [0,5]], id: 10 },
    { name: 'Tide 1', pattern: [[1,0], [0,1], [0,2], [1,3], [2,4], [3,5]], id: 11 },
    { name: 'Tide 2', pattern: [[2,0], [3,1], [3,2], [2,3], [1,4], [0,5]], id: 12 },
    { name: 'Whirlpool 1', pattern: [[1,0], [1,1], [2,2], [2,3], [1,4], [1,5]], id: 13 },
    { name: 'Whirlpool 2', pattern: [[2,0], [2,1], [1,2], [1,3], [2,4], [2,5]], id: 14 },
    { name: 'Mermaid Path', pattern: [[0,0], [1,1], [2,2], [1,3], [0,4], [1,5]], id: 15 }
  ];
  
  paylines.forEach(payline => {
    const symbols = payline.pattern.map(([row, col]) => grid[row]?.[col]);
    if (symbols.some(s => !s)) return;
    
    // Check all 6 match (JACKPOT!)
    if (symbols.every(s => s === symbols[0])) {
      wins.push({
        paylineId: payline.id,
        paylineName: payline.name,
        symbol: symbols[0],
        count: 6,
        positions: payline.pattern
      });
    }
    // Check first 5 match
    else if (symbols[0] === symbols[1] && symbols[1] === symbols[2] && 
             symbols[2] === symbols[3] && symbols[3] === symbols[4]) {
      wins.push({
        paylineId: payline.id,
        paylineName: payline.name,
        symbol: symbols[0],
        count: 5,
        positions: payline.pattern.slice(0, 5)
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

export default Grid4x6Engine;

