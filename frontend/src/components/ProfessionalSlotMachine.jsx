import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ProfessionalSlotMachine() {
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState([
    { current: '💎', spinning: false },
    { current: '💎', spinning: false },
    { current: '💎', spinning: false }
  ]);
  const [result, setResult] = useState(null);
  const [spinCount, setSpinCount] = useState(3);
  const [showCTA, setShowCTA] = useState(false);
  
  const intervalRefs = useRef([null, null, null]);

  // Premium casino symbols - ordered by value (high to low)
  const symbols = [
    '💎', // Diamond - Jackpot
    '7️⃣', // Lucky 7 - High Value
    '⭐', // Star - High Value
    '🍒', // Cherry - Classic
    '🔔', // Bell - Classic
    '💰', // Money Bag - Medium
    '🍀', // Clover - Lucky
    '🍋', // Lemon - Classic
    '🍊', // Orange - Classic
    'BAR' // Bar - Classic (using text)
  ];

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes reelBlur {
        0%, 100% { 
          filter: blur(0px);
          transform: translateY(0);
        }
        50% { 
          filter: blur(3px);
          transform: translateY(-2px);
        }
      }
      
      @keyframes reelSettle {
        0% { transform: translateY(0) scale(1); }
        30% { transform: translateY(-8px) scale(1.05); }
        50% { transform: translateY(4px) scale(0.98); }
        70% { transform: translateY(-2px) scale(1.02); }
        85% { transform: translateY(1px) scale(0.99); }
        100% { transform: translateY(0) scale(1); }
      }
      
      @keyframes winGlow {
        0%, 100% { 
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3),
                      inset 0 0 20px rgba(255, 215, 0, 0.1);
        }
        50% { 
          box-shadow: 0 0 40px rgba(255, 215, 0, 0.6),
                      inset 0 0 30px rgba(255, 215, 0, 0.3);
        }
      }
      
      @keyframes celebrate {
        0%, 100% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.1) rotate(-5deg); }
        75% { transform: scale(1.1) rotate(5deg); }
      }
      
      @keyframes spinGlow {
        0% { box-shadow: 0 0 15px rgba(102, 126, 234, 0.3); }
        50% { box-shadow: 0 0 30px rgba(102, 126, 234, 0.6); }
        100% { box-shadow: 0 0 15px rgba(102, 126, 234, 0.3); }
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      .reel-spinning {
        animation: reelBlur 0.08s linear infinite;
      }
      
      .reel-settled {
        animation: reelSettle 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      
      .win-glow {
        animation: winGlow 1.5s ease-in-out infinite;
      }
      
      .confetti-particle {
        position: absolute;
        pointer-events: none;
        font-size: 1.5rem;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSpin = () => {
    if (spinning || spinCount <= 0) return;

    setSpinning(true);
    setResult(null);
    setSpinCount(spinCount - 1);

    // Start all reels spinning with rapid symbol changes
    const newReels = [...reels];
    newReels.forEach((reel, i) => {
      reel.spinning = true;
      
      // Rapid symbol change for each reel independently
      intervalRefs.current[i] = setInterval(() => {
        setReels(prev => {
          const updated = [...prev];
          updated[i] = { 
            ...updated[i], 
            current: symbols[Math.floor(Math.random() * symbols.length)] 
          };
          return updated;
        });
      }, 80); // Fast symbol change
    });
    
    setReels(newReels);

    // Determine final result
    const isWin = Math.random() > 0.35; // 65% win rate for demo
    let finalSymbols;
    
    if (isWin) {
      // Winning combination
      const winSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      finalSymbols = [winSymbol, winSymbol, winSymbol];
    } else {
      // Non-winning combination
      finalSymbols = symbols
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      // Ensure they're not all the same
      while (finalSymbols[0] === finalSymbols[1] && finalSymbols[1] === finalSymbols[2]) {
        finalSymbols[2] = symbols[Math.floor(Math.random() * symbols.length)];
      }
    }

    // Stop reels one by one (cascade effect) - professional timing
    [1500, 2500, 3500].forEach((delay, index) => {
      setTimeout(() => {
        // Clear the rapid change interval
        clearInterval(intervalRefs.current[index]);
        
        // Set final symbol with settle animation
        setReels(prev => {
          const updated = [...prev];
          updated[index] = { 
            current: finalSymbols[index], 
            spinning: false,
            settled: true
          };
          return updated;
        });
        
        // Remove settled flag after animation completes
        setTimeout(() => {
          setReels(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], settled: false };
            return updated;
          });
        }, 600);
        
        // When last reel stops, show result
        if (index === 2) {
          setSpinning(false);
          
          if (isWin) {
            const cmxAmount = (Math.random() * 50000 + 30000).toFixed(0); // 30,000-80,000 CMX
            const usdValue = (cmxAmount / 10000).toFixed(2); // 10,000 CMX = $1
            setResult({ type: 'win', cmx: parseInt(cmxAmount).toLocaleString(), usd: usdValue });
            
            // Show CTA after first win
            if (spinCount === 2) {
              setTimeout(() => setShowCTA(true), 2000);
            }
          } else {
            setResult({ type: 'loss' });
          }
        }
      }, delay);
    });
  };

  const getSymbolValue = (symbol) => {
    const values = {
      '💎': 'JACKPOT',
      '7️⃣': 'BIG WIN',
      '⭐': 'BIG WIN',
      '🍒': 'WIN',
      '🔔': 'WIN',
      '💰': 'WIN',
      '🍀': 'LUCKY',
      '🍋': 'NICE',
      '🍊': 'NICE',
      'BAR': 'GOOD'
    };
    return values[symbol] || 'WIN';
  };

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.slotMachineCard}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.demoLabel}>
            <span style={styles.demoIcon}>🎮</span>
            <span style={styles.demoText}>FREE DEMO - Try Your Luck!</span>
          </div>
          <div style={styles.spinsLeft}>
            <span style={styles.spinsIcon}>🎰</span>
            <span>{spinCount} {spinCount === 1 ? 'spin' : 'spins'}</span>
          </div>
        </div>

        {/* Slot Machine Frame */}
        <div style={styles.slotFrame}>
          {/* Top Display */}
          <div style={styles.topDisplay}>
            <div style={styles.displayText}>SPIN TO WIN</div>
          </div>

          {/* Reels Container */}
          <div style={styles.reelsContainer}>
            {reels.map((reel, index) => (
              <div 
                key={index} 
                style={styles.reelWindow}
              >
                {/* Reel Track */}
                <div style={styles.reelTrack}>
                  <motion.div
                    className={reel.spinning ? 'reel-spinning' : (reel.settled ? 'reel-settled' : '')}
                    style={{
                      ...styles.reel,
                      ...(result?.type === 'win' && !spinning ? styles.reelWin : {})
                    }}
                  >
                    <div style={styles.symbol}>
                      {reel.current === 'BAR' ? (
                        <div style={styles.barText}>BAR</div>
                      ) : (
                        reel.current
                      )}
                    </div>
                  </motion.div>
                </div>
                
                {/* Reel Number */}
                <div style={styles.reelNumber}>{index + 1}</div>
              </div>
            ))}
          </div>

          {/* Bottom Display - Pay Line */}
          <div style={styles.payLine}>
            <div style={styles.payLineIndicator}>PAY LINE</div>
          </div>
        </div>

        {/* Result Display */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.type}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -20 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              style={{
                ...styles.resultBanner,
                ...(result.type === 'win' ? styles.winBanner : styles.lossBanner)
              }}
            >
              {result.type === 'win' ? (
                <div style={styles.winContent}>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                    style={styles.winIcon}
                  >
                    🎉
                  </motion.div>
                  <div style={styles.winTextContainer}>
                    <div style={styles.winLabel}>{getSymbolValue(reels[0].current)}!</div>
                    <div style={styles.winAmount}>+{result.cmx} CMX</div>
                    <div style={styles.winUsdConversion}>~${result.usd} USD</div>
                    <div style={styles.winSubtext}>Demo Win - Sign up to play for real!</div>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                    style={styles.winIcon}
                  >
                    🎊
                  </motion.div>
                </div>
              ) : (
                <div style={styles.lossContent}>
                  <span style={styles.lossIcon}>🎰</span>
                  <div>
                    <div style={styles.lossText}>Almost! Try Again</div>
                    <div style={styles.lossSubtext}>{spinCount} spins remaining</div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spin Button */}
        <motion.button
          onClick={handleSpin}
          disabled={spinning || spinCount <= 0}
          whileHover={!spinning && spinCount > 0 ? { scale: 1.05, y: -2 } : {}}
          whileTap={!spinning && spinCount > 0 ? { scale: 0.95 } : {}}
          style={{
            ...styles.spinButton,
            ...(spinning ? styles.spinButtonSpinning : {}),
            ...(spinCount <= 0 ? styles.spinButtonDisabled : {})
          }}
        >
          {spinning ? (
            <>
              <span style={styles.buttonSpinner}></span>
              <span>SPINNING...</span>
            </>
          ) : spinCount > 0 ? (
            <>
              <span style={styles.buttonIcon}>🎰</span>
              <span style={styles.buttonText}>PULL THE LEVER</span>
              <span style={styles.buttonIcon}>🎰</span>
            </>
          ) : (
            'DEMO COMPLETE - SIGN UP TO CONTINUE'
          )}
        </motion.button>

        {/* Win Multiplier Display */}
        {!spinning && spinCount > 0 && (
          <div style={styles.payoutInfo}>
            <div style={styles.payoutTitle}>💎 Jackpot Payouts 💎</div>
            <div style={styles.payoutGrid}>
              <div style={styles.payoutItem}>
                <span>💎💎💎</span>
                <span style={styles.payoutMultiplier}>50x</span>
              </div>
              <div style={styles.payoutItem}>
                <span>7️⃣7️⃣7️⃣</span>
                <span style={styles.payoutMultiplier}>25x</span>
              </div>
              <div style={styles.payoutItem}>
                <span>⭐⭐⭐</span>
                <span style={styles.payoutMultiplier}>20x</span>
              </div>
              <div style={styles.payoutItem}>
                <span>🍒🍒🍒</span>
                <span style={styles.payoutMultiplier}>10x</span>
              </div>
            </div>
          </div>
        )}

        {/* Sign Up CTA */}
        <AnimatePresence>
          {showCTA && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              style={styles.ctaBox}
            >
              <div style={styles.ctaHeader}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={styles.ctaIcon}
                >
                  💰
                </motion.div>
                <div style={styles.ctaContent}>
                  <div style={styles.ctaTitle}>Loving the Wins?</div>
                  <div style={styles.ctaText}>
                    Imagine playing with REAL money and REAL payouts!
                  </div>
                </div>
              </div>
              <div style={styles.ctaFeatures}>
                <div style={styles.ctaFeature}>
                  <span>✅</span>
                  <span>Provably Fair Technology</span>
                </div>
                <div style={styles.ctaFeature}>
                  <span>✅</span>
                  <span>Instant Crypto Withdrawals</span>
                </div>
                <div style={styles.ctaFeature}>
                  <span>✅</span>
                  <span>95%+ Return-to-Player Rate</span>
                </div>
              </div>
              <div style={styles.ctaButton}>
                <span style={styles.ctaButtonIcon}>🚀</span>
                <span>Sign Up & Get Bonus Spins!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <div style={styles.footer}>
          <div style={styles.footerIcon}>ℹ️</div>
          <div style={styles.footerText}>
            <strong>Demo Mode:</strong> Experience the thrill risk-free! Real version offers actual prizes and withdrawable earnings.
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    marginTop: '2rem',
    marginBottom: '2rem'
  },
  slotMachineCard: {
    background: 'rgba(10, 10, 10, 0.6)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '3px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '28px',
    padding: '2rem',
    boxShadow: '0 12px 50px rgba(255, 215, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  demoLabel: {
    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 165, 0, 0.25))',
    border: '2px solid rgba(255, 215, 0, 0.5)',
    borderRadius: '20px',
    padding: '0.6rem 1.2rem',
    fontSize: '0.9rem',
    fontWeight: '800',
    color: '#FFD700',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.2)'
  },
  demoIcon: {
    fontSize: '1.3rem'
  },
  demoText: {
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
  },
  spinsLeft: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#fff',
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '0.6rem 1.2rem',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  spinsIcon: {
    fontSize: '1.2rem'
  },
  slotFrame: {
    background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(10, 10, 20, 0.8))',
    border: '4px solid rgba(255, 215, 0, 0.4)',
    borderRadius: '24px',
    padding: '2rem',
    position: 'relative',
    marginBottom: '1.5rem',
    boxShadow: 'inset 0 4px 30px rgba(0, 0, 0, 0.5), 0 8px 30px rgba(255, 215, 0, 0.15)'
  },
  topDisplay: {
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(20, 20, 20, 0.6))',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '12px',
    padding: '0.75rem',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  displayText: {
    fontSize: '1.1rem',
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: '3px',
    textShadow: '0 0 15px rgba(255, 215, 0, 0.8)'
  },
  reelsContainer: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    marginBottom: '1.5rem'
  },
  reelWindow: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem'
  },
  reelTrack: {
    width: '110px',
    height: '110px',
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(20, 20, 30, 0.8))',
    border: '3px solid rgba(255, 215, 0, 0.4)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: 'inset 0 4px 20px rgba(0, 0, 0, 0.8), 0 4px 20px rgba(0, 0, 0, 0.3)',
    position: 'relative'
  },
  reel: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '4.5rem',
    transition: 'transform 0.3s ease'
  },
  reelWin: {
    animation: 'celebrate 0.8s ease-in-out 3'
  },
  symbol: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))'
  },
  barText: {
    fontSize: '2rem',
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: '2px',
    textShadow: '0 0 15px rgba(255, 215, 0, 0.8)'
  },
  reelNumber: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'rgba(255, 215, 0, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  payLine: {
    borderTop: '2px dashed rgba(255, 215, 0, 0.3)',
    paddingTop: '1rem',
    textAlign: 'center'
  },
  payLineIndicator: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'rgba(255, 215, 0, 0.7)',
    letterSpacing: '2px'
  },
  resultBanner: {
    marginBottom: '1.5rem',
    padding: '1.5rem',
    borderRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700'
  },
  winBanner: {
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(16, 185, 129, 0.25))',
    border: '3px solid rgba(34, 197, 94, 0.6)',
    boxShadow: '0 8px 30px rgba(34, 197, 94, 0.3)'
  },
  lossBanner: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid rgba(255, 255, 255, 0.15)'
  },
  winContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  winIcon: {
    fontSize: '3rem'
  },
  winTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    alignItems: 'center'
  },
  winLabel: {
    fontSize: '1.3rem',
    fontWeight: '900',
    color: '#4ade80',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  },
  winAmount: {
    fontSize: '2.2rem',
    fontWeight: '900',
    color: '#FFD700',
    textShadow: '0 0 25px rgba(255, 215, 0, 0.8)',
    lineHeight: '1',
    letterSpacing: '0.5px'
  },
  winUsdConversion: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    marginTop: '0.15rem',
    fontStyle: 'italic'
  },
  winSubtext: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginTop: '0.35rem'
  },
  lossContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  lossIcon: {
    fontSize: '2.5rem'
  },
  lossText: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.9)'
  },
  lossSubtext: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)'
  },
  spinButton: {
    width: '100%',
    padding: '1.75rem',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    border: 'none',
    borderRadius: '18px',
    color: '#000',
    fontSize: '1.1rem',
    fontWeight: '900',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    boxShadow: '0 8px 30px rgba(255, 215, 0, 0.5)',
    transition: 'all 0.3s ease',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    position: 'relative',
    overflow: 'hidden'
  },
  spinButtonSpinning: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))',
    cursor: 'wait',
    animation: 'spinGlow 1.5s ease-in-out infinite'
  },
  spinButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    background: 'rgba(255, 255, 255, 0.1)'
  },
  buttonIcon: {
    fontSize: '1.8rem',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
  },
  buttonText: {
    fontSize: '1.2rem'
  },
  buttonSpinner: {
    width: '24px',
    height: '24px',
    border: '3px solid rgba(0, 0, 0, 0.3)',
    borderTopColor: '#000',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  payoutInfo: {
    marginTop: '1.5rem',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '1.25rem'
  },
  payoutTitle: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: '1rem',
    letterSpacing: '1px'
  },
  payoutGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem'
  },
  payoutItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.6rem 0.9rem',
    background: 'rgba(255, 255, 255, 0.04)',
    borderRadius: '10px',
    fontSize: '1.2rem',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  payoutMultiplier: {
    fontSize: '0.9rem',
    fontWeight: '800',
    color: '#4ade80',
    textShadow: '0 0 10px rgba(74, 222, 128, 0.5)'
  },
  ctaBox: {
    marginTop: '1.5rem',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))',
    border: '2px solid rgba(139, 92, 246, 0.4)',
    borderRadius: '20px',
    padding: '1.75rem',
    boxShadow: '0 8px 30px rgba(139, 92, 246, 0.3)'
  },
  ctaHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    marginBottom: '1.25rem'
  },
  ctaIcon: {
    fontSize: '3.5rem',
    filter: 'drop-shadow(0 4px 15px rgba(255, 215, 0, 0.5))'
  },
  ctaContent: {
    flex: 1
  },
  ctaTitle: {
    fontSize: '1.4rem',
    fontWeight: '900',
    color: '#fff',
    marginBottom: '0.35rem',
    letterSpacing: '0.5px'
  },
  ctaText: {
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: '1.5'
  },
  ctaFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.25rem'
  },
  ctaFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600'
  },
  ctaButton: {
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    padding: '1rem',
    borderRadius: '14px',
    textAlign: 'center',
    fontSize: '1.1rem',
    fontWeight: '900',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    letterSpacing: '1px',
    boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  ctaButtonIcon: {
    fontSize: '1.5rem'
  },
  footer: {
    marginTop: '1.5rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem'
  },
  footerIcon: {
    fontSize: '1.3rem',
    flexShrink: 0,
    marginTop: '0.1rem'
  },
  footerText: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: '1.6',
    fontWeight: '500'
  }
};

export default ProfessionalSlotMachine;

