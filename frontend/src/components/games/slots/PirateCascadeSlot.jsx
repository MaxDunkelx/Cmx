import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import ConfettiEffect from '../../ConfettiEffect';

const SYMBOLS = ['🏴‍☠️', '💀', '⚓', '🗡️', '💎', '👑'];

const PAYLINES = [
  { id: 1, name: 'Top Line', pattern: [[0,0], [0,1], [0,2], [0,3], [0,4]], color: '#FF6B6B' },
  { id: 2, name: 'Second Line', pattern: [[1,0], [1,1], [1,2], [1,3], [1,4]], color: '#4ECDC4' },
  { id: 3, name: 'Third Line', pattern: [[2,0], [2,1], [2,2], [2,3], [2,4]], color: '#95E1D3' },
  { id: 4, name: 'Bottom Line', pattern: [[3,0], [3,1], [3,2], [3,3], [3,4]], color: '#FFD93D' },
  { id: 5, name: 'V Shape', pattern: [[0,0], [1,1], [2,2], [1,3], [0,4]], color: '#F38181' },
  { id: 6, name: 'Λ Shape', pattern: [[3,0], [2,1], [1,2], [2,3], [3,4]], color: '#AA96DA' },
  { id: 7, name: 'Zigzag 1', pattern: [[0,0], [1,1], [2,2], [3,3], [2,4]], color: '#FCBAD3' },
  { id: 8, name: 'Zigzag 2', pattern: [[3,0], [2,1], [1,2], [0,3], [1,4]], color: '#A8D8EA' },
];

export default function PirateCascadeSlot() {
  const { user, setUser } = useAuth();
  
  const [balance, setBalance] = useState(10000);
  const [betAmount, setBetAmount] = useState(500);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Statistics
  const [totalSpins, setTotalSpins] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [totalLost, setTotalLost] = useState(0);
  const [biggestWin, setBiggestWin] = useState(0);
  
  // Grid display (4 rows x 5 columns) - DISPLAYED AS COLUMNS
  const [grid, setGrid] = useState([
    ['🏴‍☠️', '💀', '⚓', '🗡️'],  // Column 0
    ['💀', '⚓', '🗡️', '💎'],    // Column 1
    ['⚓', '🗡️', '💎', '👑'],    // Column 2
    ['🗡️', '💎', '👑', '🏴‍☠️'],  // Column 3
    ['💎', '👑', '🏴‍☠️', '💀']   // Column 4
  ]);
  
  useEffect(() => {
    fetchBalance();
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

  const handleSpin = async () => {
    if (spinning) return;
    if (betAmount > (balance || 0)) {
      setMessage('Insufficient balance!');
      return;
    }

    setSpinning(true);
    setResult(null);
    setMessage('');
    setShowConfetti(false);
    setTotalSpins(prev => prev + 1);

    try {
      const response = await api.post('/games/slots/spin', { betAmount, slotType: 'pirate' });
      const { data } = response.data;

      console.log('📦 Backend Response:', data);

      // Map backend reels to 4x5 grid
      const backendGrid = [
        [data.reels[0], data.reels[1], data.reels[2], data.reels[3], data.reels[4]],
        [data.reels[5], data.reels[6], data.reels[7], data.reels[8], data.reels[9]],
        [data.reels[10], data.reels[11], data.reels[12], data.reels[13], data.reels[14]],
        [data.reels[15], data.reels[16], data.reels[17], data.reels[18], data.reels[19]]
      ];

      // Transpose to columns
      const newGrid = [
        [backendGrid[0][0], backendGrid[1][0], backendGrid[2][0], backendGrid[3][0]],
        [backendGrid[0][1], backendGrid[1][1], backendGrid[2][1], backendGrid[3][1]],
        [backendGrid[0][2], backendGrid[1][2], backendGrid[2][2], backendGrid[3][2]],
        [backendGrid[0][3], backendGrid[1][3], backendGrid[2][3], backendGrid[3][3]],
        [backendGrid[0][4], backendGrid[1][4], backendGrid[2][4], backendGrid[3][4]]
      ];

      // TODO: ADD CASCADE ANIMATION LOGIC HERE
      setTimeout(() => {
        setGrid(newGrid);
        setSpinning(false);
        setBalance(data.balance);
        if (user && setUser) {
          setUser({ ...user, balance: data.balance });
        }

        if (data.result === 'win') {
          setMessage(`⚓ PIRATE WIN! +${data.winAmount} CMX 💎`);
          setTotalWon(prev => prev + data.winAmount);
          setBiggestWin(prev => Math.max(prev, data.winAmount));
          if (data.winAmount >= betAmount * 10) {
            setShowConfetti(true);
          }
        } else {
          setMessage(`🏴‍☠️ Try again, matey!`);
          setTotalLost(prev => prev + betAmount);
        }
      }, 2500);

    } catch (error) {
      console.error('Spin error:', error);
      setMessage('Spin failed. Please try again.');
      setSpinning(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1628 0%, #1a3a52 50%, #0a1628 100%)',
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
        background: 'rgba(26, 58, 82, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(255, 165, 0, 0.3)',
        borderRadius: '20px',
        padding: '1.5rem'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFA500', marginBottom: '1rem', textAlign: 'center', borderBottom: '2px solid rgba(255, 165, 0, 0.3)', paddingBottom: '0.75rem' }}>
          ☠️ PIRATE STATS
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: '#FFA500', opacity: 0.8 }}>TOTAL SPINS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFA500' }}>{totalSpins}</div>
          </div>
          <div style={{ background: 'rgba(76, 175, 80, 0.2)', padding: '0.75rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: '#4CAF50', opacity: 0.8 }}>TREASURE WON</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#4CAF50' }}>+{totalWon.toLocaleString()}</div>
          </div>
          <div style={{ background: 'rgba(244, 67, 54, 0.2)', padding: '0.75rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: '#F44336', opacity: 0.8 }}>LOST AT SEA</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#F44336' }}>-{totalLost.toLocaleString()}</div>
          </div>
          <div style={{ background: 'rgba(255, 165, 0, 0.2)', padding: '0.75rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: '#FFA500', opacity: 0.8 }}>BIGGEST BOUNTY</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFA500' }}>{biggestWin.toLocaleString()}</div>
          </div>
          <div style={{ background: 'rgba(255, 165, 0, 0.3)', padding: '1rem', borderRadius: '10px', border: '2px solid rgba(255, 165, 0, 0.5)', marginTop: '0.5rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#FFA500', opacity: 0.8 }}>CURRENT BALANCE</div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#FFA500' }}>{(balance || 0).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* CENTER - Slot Machine */}
      <div style={{
        flex: 1,
        maxWidth: '700px',
        background: 'rgba(26, 58, 82, 0.5)',
        backdropFilter: 'blur(40px)',
        border: '3px solid rgba(255, 165, 0, 0.4)',
        borderRadius: '25px',
        padding: '2rem'
      }}>
        <h1 style={{
          fontSize: '2rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '900',
          letterSpacing: '2px'
        }}>
          🏴‍☠️ PIRATE CASCADE 🏴‍☠️
        </h1>

        {/* Slot Grid - 5 COLUMNS x 4 ROWS */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          padding: '1.25rem',
          background: 'rgba(0,0,0,0.6)',
          borderRadius: '20px',
          border: '3px solid rgba(255, 165, 0, 0.4)',
          boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)'
        }}>
          {grid.map((column, colIdx) => (
            <div key={colIdx} style={{
              flex: 1,
              position: 'relative',
              height: '400px', // 4 symbols × 100px each
              overflow: 'hidden',
              background: 'rgba(26, 58, 82, 0.4)',
              borderRadius: '15px',
              border: '2px solid rgba(255, 165, 0, 0.3)'
            }}>
              {/* Top gradient */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '50px',
                background: 'linear-gradient(180deg, rgba(10, 22, 40, 1) 0%, transparent 100%)',
                zIndex: 2,
                pointerEvents: 'none'
              }} />
              
              {/* Bottom gradient */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50px',
                background: 'linear-gradient(0deg, rgba(10, 22, 40, 1) 0%, transparent 100%)',
                zIndex: 2,
                pointerEvents: 'none'
              }} />
              
              {/* Display 4 symbols */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%'
              }}>
                {column.map((symbol, rowIdx) => (
                  <div key={rowIdx} style={{
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                    textShadow: '0 8px 20px rgba(0,0,0,1), 0 0 30px rgba(255,165,0,0.4)',
                    userSelect: 'none',
                    fontWeight: 'bold',
                    lineHeight: 1
                  }}>
                    {symbol}
                  </div>
                ))}
              </div>

              {/* Dividers */}
              {[100, 200, 300].map(pos => (
                <div key={pos} style={{
                  position: 'absolute',
                  top: `${pos}px`,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'rgba(255, 165, 0, 0.2)',
                  zIndex: 1
                }} />
              ))}
            </div>
          ))}
        </div>

        {/* Message */}
        <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {message && (
            <div style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              background: result?.result === 'win' ? 'rgba(255, 165, 0, 0.3)' : 'rgba(255, 71, 87, 0.3)',
              border: result?.result === 'win' ? '2px solid rgba(255, 165, 0, 0.6)' : '2px solid rgba(255, 71, 87, 0.5)',
              color: result?.result === 'win' ? '#FFA500' : '#ff6b7a',
              fontWeight: '800',
              fontSize: '1rem'
            }}>
              {message}
            </div>
          )}
        </div>

        {/* Slider */}
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.5rem', borderRadius: '15px', border: '2px solid rgba(255, 165, 0, 0.3)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#FFA500', fontWeight: '600' }}>BET AMOUNT</span>
            <span style={{ fontSize: '1.4rem', color: '#FFA500', fontWeight: '900' }}>{(betAmount || 0).toLocaleString()} CMX</span>
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
              background: `linear-gradient(to right, #FFA500 ${(betAmount / Math.max(balance || 0, 10)) * 100}%, rgba(255, 165, 0, 0.2) ${(betAmount / Math.max(balance || 0, 10)) * 100}%)`,
              cursor: spinning ? 'not-allowed' : 'pointer',
              appearance: 'none'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#FFA500', opacity: 0.6 }}>
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
            background: spinning ? '#666' : 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
            border: '3px solid rgba(255, 165, 0, 0.8)',
            borderRadius: '18px',
            color: spinning ? '#ccc' : '#000',
            fontSize: '1.8rem',
            fontWeight: '900',
            cursor: spinning ? 'not-allowed' : 'pointer',
            letterSpacing: '2px',
            boxShadow: spinning ? 'none' : '0 10px 40px rgba(255, 165, 0, 0.5)',
            transition: 'all 0.3s ease'
          }}
        >
          {spinning ? '⏳ SPINNING...' : '⚓ SPIN NOW'}
        </button>
      </div>

      {/* RIGHT - Paylines */}
      <div style={{
        width: '280px',
        background: 'rgba(26, 58, 82, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(255, 165, 0, 0.3)',
        borderRadius: '20px',
        padding: '1.5rem',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFA500', marginBottom: '1rem', textAlign: 'center', borderBottom: '2px solid rgba(255, 165, 0, 0.3)', paddingBottom: '0.75rem' }}>
          🎯 PAYLINES
        </h3>
        {PAYLINES.map((p) => (
          <div key={p.id} style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '10px', border: `2px solid ${p.color}40`, marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: p.color, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.8rem' }}>{p.id}</div>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: p.color }}>{p.name}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: '2px', background: 'rgba(0,0,0,0.5)', padding: '6px', borderRadius: '6px' }}>
              {Array(4).fill().map((_, row) =>
                Array(5).fill().map((_, col) => (
                  <div key={`${row}-${col}`} style={{
                    aspectRatio: '1',
                    background: p.pattern.some(([r, c]) => r === row && c === col) ? p.color + '80' : 'rgba(255, 165, 0, 0.1)',
                    borderRadius: '2px',
                    border: p.pattern.some(([r, c]) => r === row && c === col) ? `2px solid ${p.color}` : '1px solid rgba(255, 165, 0, 0.2)'
                  }} />
                ))
              )}
            </div>
          </div>
        ))}
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '12px', border: '2px solid rgba(255, 165, 0, 0.3)', marginTop: '1rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFA500', marginBottom: '0.75rem', textAlign: 'center' }}>💰 SYMBOL PAYOUTS</h4>
          {[
            { symbol: '👑', payout: '100x / 500x' },
            { symbol: '💎', payout: '50x / 200x' },
            { symbol: '🗡️', payout: '25x / 100x' },
            { symbol: '⚓', payout: '15x / 50x' },
            { symbol: '💀', payout: '10x / 30x' },
            { symbol: '🏴‍☠️', payout: '5x / 20x' },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'rgba(255, 165, 0, 0.1)', borderRadius: '6px', marginBottom: '0.4rem' }}>
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
          background: #FFA500;
          cursor: pointer;
          border: 2px solid #000;
          box-shadow: 0 2px 8px rgba(255, 165, 0, 0.5);
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FFA500;
          cursor: pointer;
          border: 2px solid #000;
          box-shadow: 0 2px 8px rgba(255, 165, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
