import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import ConfettiEffect from '../../ConfettiEffect';

const SYMBOLS = ['🏺', '👁️', '🐍', '🦅', '⚱️', '👑'];
const SYMBOL_HEIGHT = 120;

const PAYLINES = [
  { id: 1, name: 'Top Line', pattern: [[0,0], [0,1], [0,2], [0,3]], color: '#FFD700' },
  { id: 2, name: 'Middle Line', pattern: [[1,0], [1,1], [1,2], [1,3]], color: '#FF6B6B' },
  { id: 3, name: 'Bottom Line', pattern: [[2,0], [2,1], [2,2], [2,3]], color: '#4ECDC4' },
  { id: 4, name: 'V Shape', pattern: [[0,0], [1,1], [2,2], [1,3]], color: '#95E1D3' },
  { id: 5, name: 'Λ Shape', pattern: [[2,0], [1,1], [0,2], [1,3]], color: '#F38181' },
  { id: 6, name: 'W Shape', pattern: [[1,0], [0,1], [1,2], [2,3]], color: '#AA96DA' },
  { id: 7, name: 'M Shape', pattern: [[1,0], [2,1], [1,2], [0,3]], color: '#FCBAD3' },
  { id: 8, name: 'Valley', pattern: [[0,0], [1,1], [1,2], [0,3]], color: '#A8D8EA' },
  { id: 9, name: 'Hill', pattern: [[2,0], [1,1], [1,2], [2,3]], color: '#FFAAA5' },
];

// Easing function for smooth deceleration
function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}

export default function EgyptianTreasureSlot() {
  const { user, setUser } = useAuth();
  
  const [balance, setBalance] = useState(10000);
  const [betAmount, setBetAmount] = useState(500);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [totalSpins, setTotalSpins] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [totalLost, setTotalLost] = useState(0);
  const [biggestWin, setBiggestWin] = useState(0);
  
  const [displayGrid, setDisplayGrid] = useState([
    ['🏺', '👁️', '🐍'],
    ['👁️', '🐍', '🦅'],
    ['🐍', '🦅', '⚱️'],
    ['🦅', '⚱️', '👑']
  ]);
  
  // Animation refs
  const reelPositions = useRef([0, 0, 0, 0]);
  const reelVelocities = useRef([0, 0, 0, 0]);
  const reelTargets = useRef([0, 0, 0, 0]);
  const reelStopTimes = useRef([0, 0, 0, 0]);
  const animationFrames = useRef([null, null, null, null]);
  const startTime = useRef(0);
  const [, forceUpdate] = useState(0);
  
  useEffect(() => {
    fetchBalance();
    return () => {
      // Cleanup animations
      animationFrames.current.forEach(frame => {
        if (frame) cancelAnimationFrame(frame);
      });
    };
  }, []);
  
  useEffect(() => {
    if (balance > 0 && betAmount === 0) {
      setBetAmount(Math.max(10, Math.floor(balance * 0.05)));
    }
  }, [balance]);

  const fetchBalance = async () => {
    try {
      const response = await api.get('/wallet/balance');
      setBalance(response.data.data.balance);
      if (user && setUser) {
        setUser({ ...user, balance: response.data.data.balance });
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  const animateReel = (reelIndex, stopTime) => {
    const animate = (timestamp) => {
      if (!startTime.current) {
        startTime.current = timestamp;
      }
      
      const elapsed = timestamp - startTime.current;
      const maxSpeed = 40; // pixels per frame
      const loopHeight = SYMBOLS.length * SYMBOL_HEIGHT; // 720px
      
      if (elapsed < stopTime) {
        // SPINNING PHASE - Constant high speed
        reelVelocities.current[reelIndex] = maxSpeed;
        reelPositions.current[reelIndex] -= maxSpeed;
        
        // Loop when reaching end
        if (reelPositions.current[reelIndex] <= -loopHeight) {
          reelPositions.current[reelIndex] += loopHeight;
        }
        
        animationFrames.current[reelIndex] = requestAnimationFrame(animate);
        forceUpdate(prev => prev + 1);
      } else if (elapsed < stopTime + 1000) {
        // DECELERATION PHASE - Smooth slow down
        const decelerationProgress = (elapsed - stopTime) / 1000;
        const easedProgress = easeOutQuart(decelerationProgress);
        const currentSpeed = maxSpeed * (1 - easedProgress);
        
        reelVelocities.current[reelIndex] = currentSpeed;
        reelPositions.current[reelIndex] -= currentSpeed;
        
        // Loop during deceleration too
        if (reelPositions.current[reelIndex] <= -loopHeight) {
          reelPositions.current[reelIndex] += loopHeight;
        }
        
        animationFrames.current[reelIndex] = requestAnimationFrame(animate);
        forceUpdate(prev => prev + 1);
      } else {
        // STOPPED - Land on target
        reelVelocities.current[reelIndex] = 0;
        reelPositions.current[reelIndex] = reelTargets.current[reelIndex];
        forceUpdate(prev => prev + 1);
        console.log(`✅ Reel ${reelIndex} stopped at position ${reelTargets.current[reelIndex]}`);
      }
    };
    
    animationFrames.current[reelIndex] = requestAnimationFrame(animate);
  };

  const handleSpin = async () => {
    if (spinning) return;
    if (betAmount > (balance || 0)) {
      setMessage('Insufficient balance!');
      return;
    }

    console.log('🎰 SPIN - IMMEDIATE START!');
    setSpinning(true);
    setResult(null);
    setMessage('');
    setShowConfetti(false);
    setTotalSpins(prev => prev + 1);
    
    // Reset start time
    startTime.current = 0;
    
    // Set stop times (staggered)
    reelStopTimes.current = [2000, 2400, 2800, 3200];
    
    // Set target positions (will be updated when backend responds)
    reelTargets.current = [0, 0, 0, 0];

    try {
      console.log('📡 CALLING BACKEND with:', { betAmount, slotType: 'egyptian', _t: Date.now() });
      const response = await api.post('/games/slots/spin', { 
        betAmount, 
        slotType: 'egyptian',
        timestamp: Date.now() // Force unique request
      });
      const { data } = response.data;
      console.log('📡 BACKEND RESPONDED!');

      console.log('📦 FRONTEND RECEIVED:');
      console.log('  Reels:', data.reels);
      console.log('  Reels length:', data.reels?.length);
      console.log('  Result:', data.result);
      console.log('  Win amount:', data.winAmount);
      console.log('  Multiplier:', data.multiplier);
      console.log('  Balance:', data.balance);

      const backendGrid = [
        [data.reels[0], data.reels[1], data.reels[2], data.reels[3]],
        [data.reels[4], data.reels[5], data.reels[6], data.reels[7]],
        [data.reels[8], data.reels[9], data.reels[10], data.reels[11]]
      ];

      const targetGrid = [
        [backendGrid[0][0], backendGrid[1][0], backendGrid[2][0]],
        [backendGrid[0][1], backendGrid[1][1], backendGrid[2][1]],
        [backendGrid[0][2], backendGrid[1][2], backendGrid[2][2]],
        [backendGrid[0][3], backendGrid[1][3], backendGrid[2][3]]
      ];

      console.log('  Frontend grid (columns):');
      console.log('    Col 0:', targetGrid[0].join(' '));
      console.log('    Col 1:', targetGrid[1].join(' '));
      console.log('    Col 2:', targetGrid[2].join(' '));
      console.log('    Col 3:', targetGrid[3].join(' '));
      
      console.log('  VISUAL GRID:');
      console.log('    ' + backendGrid[0].join(' | '));
      console.log('    ' + backendGrid[1].join(' | '));
      console.log('    ' + backendGrid[2].join(' | '));
      
      setResult(data);
      
      // Start all reels spinning IMMEDIATELY
      for (let i = 0; i < 4; i++) {
        animateReel(i, reelStopTimes.current[i]);
      }
      
      // After all animations complete
      setTimeout(() => {
        console.log('✅ All reels stopped');
        setDisplayGrid(targetGrid);
        setSpinning(false);
        setBalance(data.balance);
        
        if (user && setUser) {
          setUser({ ...user, balance: data.balance });
        }

        if (data.result === 'win') {
          setMessage(`🎉 WIN! +${data.winAmount} CMX`);
          setTotalWon(prev => prev + data.winAmount);
          setBiggestWin(prev => Math.max(prev, data.winAmount));
          if (data.winAmount >= betAmount * 10) {
            setShowConfetti(true);
          }
        } else {
          setMessage(`Try again!`);
          setTotalLost(prev => prev + betAmount);
        }
      }, 4500);

    } catch (error) {
      console.error('❌ Error:', error);
      setMessage('Spin failed.');
      setSpinning(false);
      animationFrames.current.forEach(frame => {
        if (frame) cancelAnimationFrame(frame);
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1410 0%, #3d2a1f 50%, #1a1410 100%)',
      color: '#fff',
      padding: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '2rem',
      maxWidth: '1800px',
      margin: '0 auto'
    }}>
      <ConfettiEffect trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* LEFT - Stats */}
      <div style={{
        width: '280px',
        background: 'rgba(139, 69, 19, 0.3)',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(255, 215, 0, 0.3)',
        borderRadius: '20px',
        padding: '1.5rem'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFD700', marginBottom: '1rem', textAlign: 'center', borderBottom: '2px solid rgba(255, 215, 0, 0.3)', paddingBottom: '0.75rem' }}>
          📊 SESSION STATS
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: '#FFD700', opacity: 0.8 }}>TOTAL SPINS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFD700' }}>{totalSpins}</div>
          </div>
          <div style={{ background: 'rgba(76, 175, 80, 0.2)', padding: '0.75rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: '#4CAF50', opacity: 0.8 }}>TOTAL WON</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#4CAF50' }}>+{totalWon.toLocaleString()}</div>
          </div>
          <div style={{ background: 'rgba(244, 67, 54, 0.2)', padding: '0.75rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: '#F44336', opacity: 0.8 }}>TOTAL LOST</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#F44336' }}>-{totalLost.toLocaleString()}</div>
          </div>
          <div style={{ background: 'rgba(255, 215, 0, 0.2)', padding: '0.75rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: '#FFD700', opacity: 0.8 }}>BIGGEST WIN</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFD700' }}>{biggestWin.toLocaleString()}</div>
          </div>
          <div style={{ background: 'rgba(255, 215, 0, 0.3)', padding: '1rem', borderRadius: '10px', border: '2px solid rgba(255, 215, 0, 0.5)', marginTop: '0.5rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#FFD700', opacity: 0.8 }}>CURRENT BALANCE</div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#FFD700' }}>{(balance || 0).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* CENTER - Slot Machine */}
      <div style={{
        flex: 1,
        maxWidth: '600px',
        background: 'rgba(139, 69, 19, 0.4)',
        backdropFilter: 'blur(40px)',
        border: '3px solid rgba(255, 215, 0, 0.4)',
        borderRadius: '25px',
        padding: '2rem'
      }}>
        <h1 style={{
          fontSize: '2rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '900',
          letterSpacing: '2px'
        }}>
          🏺 EGYPTIAN TREASURE 🏺
        </h1>

        {/* SLOT REELS - CONTINUOUS ANIMATION */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          padding: '1.25rem',
          background: 'rgba(0,0,0,0.6)',
          borderRadius: '20px',
          border: '3px solid rgba(255, 215, 0, 0.4)',
          boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)'
        }}>
          {[0, 1, 2, 3].map((colIdx) => {
            const position = reelPositions.current[colIdx];
            const velocity = reelVelocities.current[colIdx];
            const isMoving = velocity > 0.5;
            
            return (
              <div key={colIdx} style={{
                flex: 1,
                position: 'relative',
                height: '360px',
                overflow: 'hidden',
                background: 'rgba(101, 67, 33, 0.3)',
                borderRadius: '15px',
                border: '2px solid rgba(255, 215, 0, 0.3)'
              }}>
                {/* Top gradient */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '60px',
                  background: 'linear-gradient(180deg, rgba(41, 27, 15, 1) 0%, transparent 100%)',
                  zIndex: 2,
                  pointerEvents: 'none'
                }} />
                
                {/* Bottom gradient */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '60px',
                  background: 'linear-gradient(0deg, rgba(41, 27, 15, 1) 0%, transparent 100%)',
                  zIndex: 2,
                  pointerEvents: 'none'
                }} />
                
                {/* REEL STRIP - CONTINUOUS SCROLLING */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  transform: `translateY(${position % (SYMBOLS.length * SYMBOL_HEIGHT)}px) translateZ(0)`,
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  filter: isMoving ? 'blur(1px)' : 'blur(0px)',
                  transition: 'filter 0.3s ease'
                }}>
                  {/* Render symbols 4 times for seamless infinite loop */}
                  {[...SYMBOLS, ...SYMBOLS, ...SYMBOLS, ...SYMBOLS].map((symbol, idx) => (
                    <div key={idx} style={{
                      height: `${SYMBOL_HEIGHT}px`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '5rem',
                      textShadow: '0 8px 20px rgba(0,0,0,1), 0 0 30px rgba(255,215,0,0.3)',
                      userSelect: 'none',
                      fontWeight: 'bold',
                      lineHeight: 1
                    }}>
                      {symbol}
                    </div>
                  ))}
                </div>

                {/* Dividers */}
                <div style={{
                  position: 'absolute',
                  top: '120px',
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'rgba(255, 215, 0, 0.2)',
                  zIndex: 1
                }} />
                <div style={{
                  position: 'absolute',
                  top: '240px',
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'rgba(255, 215, 0, 0.2)',
                  zIndex: 1
                }} />
              </div>
            );
          })}
        </div>

        {/* Message */}
        <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {message && (
            <div style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              background: result?.result === 'win' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 71, 87, 0.3)',
              border: result?.result === 'win' ? '2px solid rgba(255, 215, 0, 0.6)' : '2px solid rgba(255, 71, 87, 0.5)',
              color: result?.result === 'win' ? '#FFD700' : '#ff6b7a',
              fontWeight: '800',
              fontSize: '1rem'
            }}>
              {message}
            </div>
          )}
        </div>

        {/* Slider */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '15px', border: '2px solid rgba(255, 215, 0, 0.3)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#FFD700', fontWeight: '600' }}>BET AMOUNT</span>
            <span style={{ fontSize: '1.4rem', color: '#FFD700', fontWeight: '900' }}>{(betAmount || 0).toLocaleString()} CMX</span>
          </div>
          <input
            type="range"
            min="10"
            max={Math.max(10, balance || 0)}
            step="10"
            value={betAmount}
            onChange={(e) => setBetAmount(parseInt(e.target.value))}
            disabled={spinning}
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '5px',
              outline: 'none',
              background: `linear-gradient(to right, #FFD700 ${(betAmount / Math.max(balance || 0, 10)) * 100}%, rgba(255, 215, 0, 0.2) ${(betAmount / Math.max(balance || 0, 10)) * 100}%)`,
              cursor: spinning ? 'not-allowed' : 'pointer',
              appearance: 'none'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#FFD700', opacity: 0.6 }}>
            <span>Min: 10</span>
            <span>5% = {Math.floor((balance || 0) * 0.05)}</span>
            <span>Max: {(balance || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSpin}
          disabled={spinning || betAmount > (balance || 0)}
          style={{
            width: '100%',
            padding: '1.5rem',
            background: spinning ? '#666' : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            border: '3px solid rgba(255, 215, 0, 0.8)',
            borderRadius: '18px',
            color: spinning ? '#ccc' : '#000',
            fontSize: '1.8rem',
            fontWeight: '900',
            cursor: spinning ? 'not-allowed' : 'pointer',
            letterSpacing: '2px',
            boxShadow: spinning ? 'none' : '0 10px 40px rgba(255, 215, 0, 0.5)',
            transition: 'all 0.3s ease',
            transform: spinning ? 'scale(0.98)' : 'scale(1)'
          }}
        >
          {spinning ? '⏳ SPINNING...' : '🎰 SPIN NOW'}
        </button>
      </div>

      {/* RIGHT - Paylines */}
      <div style={{
        width: '280px',
        background: 'rgba(139, 69, 19, 0.3)',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(255, 215, 0, 0.3)',
        borderRadius: '20px',
        padding: '1.5rem',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFD700', marginBottom: '1rem', textAlign: 'center', borderBottom: '2px solid rgba(255, 215, 0, 0.3)', paddingBottom: '0.75rem' }}>
          🎯 WINNING PAYLINES
        </h3>
        {PAYLINES.map((p) => (
          <div key={p.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '10px', border: `2px solid ${p.color}40`, marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: p.color, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.8rem' }}>{p.id}</div>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: p.color }}>{p.name}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: '3px', background: 'rgba(0,0,0,0.5)', padding: '6px', borderRadius: '6px' }}>
              {Array(3).fill().map((_, row) =>
                Array(4).fill().map((_, col) => (
                  <div key={`${row}-${col}`} style={{
                    aspectRatio: '1',
                    background: p.pattern.some(([r, c]) => r === row && c === col) ? p.color + '80' : 'rgba(255, 215, 0, 0.1)',
                    borderRadius: '3px',
                    border: p.pattern.some(([r, c]) => r === row && c === col) ? `2px solid ${p.color}` : '1px solid rgba(255, 215, 0, 0.2)'
                  }} />
                ))
              )}
            </div>
          </div>
        ))}
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '12px', border: '2px solid rgba(255, 215, 0, 0.3)', marginTop: '1rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFD700', marginBottom: '0.75rem', textAlign: 'center' }}>💰 SYMBOL PAYOUTS</h4>
          {[
            { symbol: '👑', payout: '50x / 200x' },
            { symbol: '⚱️', payout: '15x / 50x' },
            { symbol: '🦅', payout: '8x / 25x' },
            { symbol: '🐍', payout: '5x / 15x' },
            { symbol: '👁️', payout: '3x / 8x' },
            { symbol: '🏺', payout: '2x / 5x' },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '6px', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{item.symbol}</span>
              <span style={{ color: '#4CAF50', fontWeight: '700', fontSize: '0.75rem' }}>{item.payout}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FFD700;
          cursor: pointer;
          border: 2px solid #000;
          box-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FFD700;
          cursor: pointer;
          border: 2px solid #000;
          box-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
