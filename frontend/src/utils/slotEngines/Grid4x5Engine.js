/**
 * GRID 4x5 SLOT ENGINE WITH CASCADE
 * For: Pirate Cascade (4 rows × 5 columns), Dragon Fortune (4 rows × 5 columns)
 * 
 * Features:
 * - Professional spinning animation
 * - CASCADE MECHANICS: Winning symbols explode and new ones drop from above
 * - Chain reactions for multiple consecutive wins
 * - Multiplier increases with each cascade
 */

const ICON_HEIGHT = 100; // Height of each symbol in pixels
const STRIP_LENGTH = 30;
const SYMBOLS_VISIBLE = 4; // 4 rows
const NUM_REELS = 5; // 5 columns

// Animation constants
const SPIN_DURATION_BASE = 2000;
const REEL_STAGGER_DELAY = 350;
const ACCELERATION_TIME = 200;
const DECELERATION_TIME = 800;
const SPIN_SPEED_MAX = 38;
const BOUNCE_DISTANCE = 12;
const BOUNCE_DURATION = 150;

// Cascade constants
const CASCADE_DROP_SPEED = 15; // Pixels per frame for dropping symbols
const CASCADE_DELAY = 800; // Delay before starting cascade
const EXPLOSION_DURATION = 300; // Duration of symbol explosion animation

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
  strip.push(...targetSymbols);
  for (let i = 0; i < 11; i++) {
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

/**
 * Cascade animator for dropping symbols
 */
class CascadeAnimator {
  constructor(symbols, onComplete) {
    this.symbols = symbols;
    this.onComplete = onComplete;
    this.isAnimating = false;
  }
  
  /**
   * Drop new symbols into empty positions
   * @param {Array} emptyPositions - Array of {row, col} objects
   * @param {Function} updateGrid - Callback to update the grid
   */
  dropSymbols(emptyPositions, updateGrid) {
    this.isAnimating = true;
    
    // Generate new random symbols
    const newSymbols = emptyPositions.map(() => 
      this.symbols[Math.floor(Math.random() * this.symbols.length)]
    );
    
    // Simulate drop animation (in real impl, this would be animated)
    setTimeout(() => {
      updateGrid(emptyPositions, newSymbols);
      this.isAnimating = false;
      this.onComplete();
    }, 500);
  }
}

export class Grid4x5Engine {
  constructor(symbols, onAllReelsComplete, enableCascade = true) {
    this.symbols = symbols;
    this.onAllReelsComplete = onAllReelsComplete;
    this.enableCascade = enableCascade;
    this.reels = [];
    this.completedReels = 0;
    this.cascadeMultiplier = 1;
    this.cascadeAnimator = new CascadeAnimator(symbols, this.handleCascadeComplete);
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
    console.log(`✅ Reel ${reelIndex} complete (${this.completedReels}/${NUM_REELS})`);
    
    if (this.completedReels === NUM_REELS) {
      console.log('🎰 All reels complete!');
      this.onAllReelsComplete();
    }
  }
  
  handleCascadeComplete = () => {
    console.log('💥 Cascade complete!');
  }
  
  /**
   * Process cascade after a win
   * @param {Array} winningPositions - Array of winning positions
   * @param {Function} updateGrid - Callback to update grid
   * @param {Function} checkWins - Callback to check for new wins
   */
  processCascade(winningPositions, updateGrid, checkWins) {
    if (!this.enableCascade) return;
    
    this.cascadeMultiplier++;
    console.log(`💥 CASCADE x${this.cascadeMultiplier}`);
    
    // Remove winning symbols and drop new ones
    this.cascadeAnimator.dropSymbols(winningPositions, (positions, newSymbols) => {
      updateGrid(positions, newSymbols);
      
      // Check for new wins after cascade
      setTimeout(() => {
        const newWins = checkWins();
        if (newWins.isWin) {
          // Recursive cascade!
          this.processCascade(newWins.positions, updateGrid, checkWins);
        } else {
          // No more wins, reset multiplier
          this.cascadeMultiplier = 1;
        }
      }, 300);
    });
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
 * Check winning combinations for 4x5 grid
 */
export function checkWins4x5(grid) {
  const wins = [];
  
  const paylines = [
    { name: 'Top', pattern: [[0,0], [0,1], [0,2], [0,3], [0,4]], id: 1 },
    { name: 'Second', pattern: [[1,0], [1,1], [1,2], [1,3], [1,4]], id: 2 },
    { name: 'Third', pattern: [[2,0], [2,1], [2,2], [2,3], [2,4]], id: 3 },
    { name: 'Bottom', pattern: [[3,0], [3,1], [3,2], [3,3], [3,4]], id: 4 },
    { name: 'V', pattern: [[0,0], [1,1], [2,2], [1,3], [0,4]], id: 5 },
    { name: 'Λ', pattern: [[3,0], [2,1], [1,2], [2,3], [3,4]], id: 6 },
    { name: 'Zigzag 1', pattern: [[0,0], [1,1], [2,2], [3,3], [2,4]], id: 7 },
    { name: 'Zigzag 2', pattern: [[3,0], [2,1], [1,2], [0,3], [1,4]], id: 8 }
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

export default Grid4x5Engine;

