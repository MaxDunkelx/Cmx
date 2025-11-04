import { useState, useEffect } from 'react';
import SLOT_TYPES from './SlotVariations';

function MultiSlotMachine({ onSpin, betAmount, selectedType }) {
  const [reels, setReels] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [finalReels, setFinalReels] = useState(null);
  
  const config = SLOT_TYPES[selectedType] || SLOT_TYPES.CLASSIC_3;
  
  // Initialize reels
  useEffect(() => {
    const initialReels = [];
    for (let row = 0; row < config.rows; row++) {
      initialReels[row] = [];
      for (let reel = 0; reel < config.reels; reel++) {
        initialReels[row][reel] = config.symbols[Math.floor(Math.random() * config.symbols.length)];
      }
    }
    setReels(initialReels);
  }, [selectedType]);

  const getSecureRandom = () => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / (0xFFFFFFFF + 1);
  };

  const spin = async () => {
    setSpinning(true);
    
    // Generate random results
    const newReels = [];
    for (let row = 0; row < config.rows; row++) {
      newReels[row] = [];
      for (let reel = 0; reel < config.reels; reel++) {
        newReels[row][reel] = config.symbols[Math.floor(getSecureRandom() * config.symbols.length)];
      }
    }
    
    // Animate spinning
    let spinCount = 0;
    const maxSpins = 30;
    const spinInterval = setInterval(() => {
      const spinningReels = [];
      for (let row = 0; row < config.rows; row++) {
        spinningReels[row] = [];
        for (let reel = 0; reel < config.reels; reel++) {
          spinningReels[row][reel] = config.symbols[Math.floor(Math.random() * config.symbols.length)];
        }
      }
      setReels(spinningReels);
      spinCount++;
      
      if (spinCount >= maxSpins) {
        clearInterval(spinInterval);
        setFinalReels(newReels);
        setTimeout(() => {
          setReels(newReels);
          setSpinning(false);
          
          // Calculate win
          const win = calculateWin(newReels);
          if (onSpin) {
            onSpin({ reels: newReels, win });
          }
        }, 300);
      }
    }, 100);
  };

  const calculateWin = (reelsToCheck) => {
    if (config.rows === 1) {
      // Single row payout
      const row = reelsToCheck[0];
      return checkRowMatch(row);
    } else if (config.rows > 1) {
      // Multi-row payouts
      return checkMultiRow(reelsToCheck);
    }
    return 0;
  };

  const checkRowMatch = (row) => {
    // Check for all matching symbols
    const firstSymbol = row[0];
    if (row.every(s => s === firstSymbol)) {
      const symbolKey = Array(row.length).fill(firstSymbol).join('');
      const payout = config.payouts[symbolKey];
      return payout ? payout.multiplier : 0;
    }
    return 0;
  };

  const checkMultiRow = (reels) => {
    // Check for diagonal matches
    if (config.payouts.diagonal) {
      // Top-left to bottom-right
      const diagonal1 = [];
      for (let i = 0; i < Math.min(config.rows, config.reels); i++) {
        diagonal1.push(reels[i][i]);
      }
      
      // Bottom-left to top-right
      const diagonal2 = [];
      for (let i = 0; i < Math.min(config.rows, config.reels); i++) {
        diagonal2.push(reels[config.rows - 1 - i][i]);
      }
      
      if (isAllMatch(diagonal1) || isAllMatch(diagonal2)) {
        return config.payouts.diagonal.multiplier;
      }
    }
    
    // Check horizontal lines
    if (config.payouts.horizontal) {
      for (let row of reels) {
        if (isAllMatch(row)) {
          return config.payouts.horizontal.multiplier;
        }
      }
    }
    
    // Check vertical lines
    if (config.payouts.vertical) {
      for (let col = 0; col < config.reels; col++) {
        const colSymbols = [];
        for (let row = 0; row < config.rows; row++) {
          colSymbols.push(reels[row][col]);
        }
        if (isAllMatch(colSymbols)) {
          return config.payouts.vertical.multiplier;
        }
      }
    }
    
    return 0;
  };

  const isAllMatch = (symbols) => {
    return symbols.every(s => s === symbols[0]) && symbols.length > 1;
  };

  return (
    <div style={styles.container}>
      <div style={styles.gameInfo}>
        <h3 style={styles.gameName}>{config.name}</h3>
        <p style={styles.dimensions}>{config.reels} Reels × {config.rows} Rows</p>
      </div>
      
      <div style={{
        ...styles.slotGrid,
        gridTemplateColumns: `repeat(${config.reels}, 1fr)`,
        gridTemplateRows: `repeat(${config.rows}, 1fr)`
      }}>
        {Array(config.rows).fill(0).map((_, rowIndex) => 
          Array(config.reels).fill(0).map((_, reelIndex) => (
            <div 
              key={`${rowIndex}-${reelIndex}`}
              style={{
                ...styles.slotCell,
                animation: spinning ? 'spin 0.1s infinite' : 'none'
              }}
            >
              {reels[rowIndex] && reels[rowIndex][reelIndex]}
            </div>
          ))
        )}
      </div>
      
      <button 
        onClick={spin} 
        disabled={spinning}
        className="liquid-glass-button"
        style={styles.spinButton}
      >
        {spinning ? '🎰 Spinning...' : '🎰 SPIN'}
      </button>
      
      {finalReels && (
        <div style={styles.payoutInfo}>
          {Object.keys(config.payouts).map(key => {
            const payout = typeof config.payouts[key] === 'object' ? config.payouts[key] : null;
            if (!payout) return null;
            return (
              <div key={key} style={styles.payout}>
                <span style={styles.payoutSymbol}>{key}</span>
                <span style={styles.payoutValue}>{payout.multiplier}x</span>
              </div>
            );
          })}
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '2.5rem',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
  },
  gameInfo: {
    marginBottom: '2rem'
  },
  gameName: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '0.5rem'
  },
  dimensions: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.5)'
  },
  slotGrid: {
    display: 'grid',
    gap: '1rem',
    marginBottom: '2rem',
    maxWidth: '600px',
    margin: '0 auto 2rem'
  },
  slotCell: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    padding: '2rem',
    fontSize: '4rem',
    minHeight: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  },
  spinButton: {
    padding: '1.5rem 4rem',
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: '700',
    cursor: spinning ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '2rem'
  },
  payoutInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '1rem'
  },
  payout: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '1rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  payoutSymbol: {
    fontSize: '1.5rem'
  },
  payoutValue: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#4CAF50'
  }
};

export default MultiSlotMachine;

