import { useState, useEffect } from 'react';
import api from '../utils/api';
import RouletteGame from '../components/RouletteGame';
import BlackjackGame from '../components/BlackjackGame';
import PokerGame from '../components/PokerGame';

function Games() {
  const [activeGame, setActiveGame] = useState('slots');
  const [betAmount, setBetAmount] = useState(1000);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(25000);
  const [displayReels, setDisplayReels] = useState(['🍒', '🍋', '🍊']);
  
  const betOptions = [500, 1000, 2500, 5000];
  const symbols = ['🍒', '🍋', '🍊', '⭐', '💎', '7️⃣'];

  useEffect(() => {
    if (result && result.reels && !result.error) {
      animateReels(result.reels);
    }
  }, [result]);

  const animateReels = (finalReels) => {
    setDisplayReels(['🍒', '🍋', '🍊']);
    let counter = 0;
    const interval = setInterval(() => {
      setDisplayReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
      counter++;
      if (counter > 25) {
        clearInterval(interval);
        setTimeout(() => setDisplayReels(finalReels), 200);
      }
    }, 60);
  };

  const playSlots = async () => {
    if (betAmount > balance) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await api.post('/games/slots/spin', { betAmount });
      setResult(response.data.data);
      setBalance(response.data.data.newBalance || balance);
    } catch (error) {
      setResult({ error: error.response?.data?.message || 'Game failed' });
    } finally {
      setLoading(false);
    }
  };

  const playRoulette = async (betData) => {
    if (betData.betAmount > balance) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await api.post('/games/roulette/spin', betData);
      setResult(response.data.data);
      setBalance(response.data.data.newBalance || balance);
    } catch (error) {
      setResult({ error: error.response?.data?.message || 'Game failed' });
    } finally {
      setLoading(false);
    }
  };

  const playBlackjack = async (gameData) => {
    if (gameData.betAmount > balance) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await api.post('/games/blackjack/play', gameData);
      setResult(response.data.data);
      setBalance(response.data.data.newBalance || balance);
    } catch (error) {
      setResult({ error: error.response?.data?.message || 'Game failed' });
    } finally {
      setLoading(false);
    }
  };

  const playPoker = async (gameData) => {
    if (gameData.betAmount > balance) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await api.post('/games/poker/play', gameData);
      setResult(response.data.data);
      setBalance(response.data.data.newBalance || balance);
    } catch (error) {
      setResult({ error: error.response?.data?.message || 'Game failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎮 Gaming Hub</h1>
      
      <div style={styles.balanceCard}>
        <div style={styles.balanceAmount}>{balance.toLocaleString()} CMX</div>
        <div style={styles.balanceUSD}>≈ ${(balance / 10000 / 100).toFixed(2)} USD</div>
      </div>
      
      <div style={styles.gameSelector}>
        <button 
          onClick={() => setActiveGame('slots')} 
          style={{...styles.gameButton, ...(activeGame === 'slots' && styles.activeGame)}}
        >
          🎰 Slots
        </button>
        <button 
          onClick={() => setActiveGame('roulette')} 
          style={{...styles.gameButton, ...(activeGame === 'roulette' && styles.activeGame)}}
        >
          🎲 Roulette
        </button>
        <button 
          onClick={() => setActiveGame('blackjack')} 
          style={{...styles.gameButton, ...(activeGame === 'blackjack' && styles.activeGame)}}
        >
          🃏 Blackjack
        </button>
        <button 
          onClick={() => setActiveGame('poker')} 
          style={{...styles.gameButton, ...(activeGame === 'poker' && styles.activeGame)}}
        >
          ♠️ Poker
        </button>
      </div>

      {activeGame === 'slots' && (
        <div style={styles.gameArea}>
          <h2 style={styles.gameTitle}>🎰 Slot Machine</h2>
          
          <div style={styles.slotMachine}>
            <div style={styles.slotFrame}>
              {displayReels.map((reel, i) => (
                <div key={i} style={styles.slotReel}>
                  {reel}
                </div>
              ))}
            </div>
            <div style={styles.payline}></div>
          </div>

          <div style={styles.betSection}>
            <div style={styles.betLabel}>Select Your Bet:</div>
            <div style={styles.betButtons}>
              {betOptions.map((bet) => (
                <button
                  key={bet}
                  onClick={() => setBetAmount(bet)}
                  style={{
                    ...styles.betButton,
                    ...(betAmount === bet && styles.activeBetButton)
                  }}
                  disabled={loading}
                >
                  {bet.toLocaleString()} CMX
                </button>
              ))}
            </div>
          </div>
          
          {result && !result.error && (
            <div style={styles.resultCard}>
              <div style={styles.resultText}>
                {result.result === 'win' ? '🎉 YOU WON!' : '😢 Try Again!'}
              </div>
              {result.winAmount > 0 && (
                <div style={styles.winAmount}>
                  +{result.winAmount.toLocaleString()} CMX
                </div>
              )}
              <div style={styles.newBalance}>
                New Balance: {result.newBalance?.toLocaleString()} CMX
              </div>
            </div>
          )}
          
          {result?.error && (
            <div style={styles.errorCard}>⚠️ {result.error}</div>
          )}
          
          <button 
            onClick={playSlots} 
            disabled={loading || betAmount > balance} 
            style={{
              ...styles.spinButton,
              ...((loading || betAmount > balance) && styles.spinButtonDisabled)
            }}
          >
            {loading ? '⏳ Spinning...' : betAmount > balance ? '❌ Insufficient Balance' : '🎰 SPIN'}
          </button>

          <div style={styles.payoutTable}>
            <h3>💰 Payout Table</h3>
            <div style={styles.payouts}>
              <div style={styles.payoutItem}><span>💎💎💎</span><span>100x</span></div>
              <div style={styles.payoutItem}><span>⭐⭐⭐</span><span>50x</span></div>
              <div style={styles.payoutItem}><span>7️⃣7️⃣7️⃣</span><span>25x</span></div>
              <div style={styles.payoutItem}><span>🍒🍒🍒</span><span>10x</span></div>
            </div>
          </div>
        </div>
      )}

      {activeGame === 'roulette' && (
        <div style={styles.gameArea}>
          <RouletteGame 
            onSpin={playRoulette}
            result={result}
            loading={loading}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            balance={balance}
          />
        </div>
      )}

      {activeGame === 'blackjack' && (
        <div style={styles.gameArea}>
          <BlackjackGame 
            onPlay={playBlackjack}
            result={result}
            loading={loading}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            balance={balance}
          />
        </div>
      )}

      {activeGame === 'poker' && (
        <div style={styles.gameArea}>
          <PokerGame 
            onPlay={playPoker}
            result={result}
            loading={loading}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            balance={balance}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    background: '#0a0e27',
    color: '#fff',
    minHeight: '100vh'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  balanceCard: {
    backgroundColor: '#1a1f3a',
    padding: '1.5rem',
    borderRadius: '12px',
    textAlign: 'center',
    marginBottom: '2rem',
    border: '1px solid #333'
  },
  balanceAmount: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#667eea'
  },
  balanceUSD: {
    fontSize: '1rem',
    color: '#888',
    marginTop: '0.5rem'
  },
  gameSelector: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    justifyContent: 'center'
  },
  gameButton: {
    flex: 1,
    padding: '1rem 2rem',
    backgroundColor: '#1a1f3a',
    color: '#fff',
    border: '2px solid #333',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600'
  },
  activeGame: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
    boxShadow: '0 0 20px rgba(102, 126, 234, 0.5)'
  },
  gameArea: {
    backgroundColor: '#1a1f3a',
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #333',
    maxWidth: '700px',
    margin: '0 auto'
  },
  gameTitle: {
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '2rem'
  },
  slotMachine: {
    marginBottom: '2rem'
  },
  slotFrame: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    backgroundColor: '#2a1f3d',
    padding: '2rem',
    borderRadius: '15px',
    border: '3px solid #667eea',
    boxShadow: '0 0 30px rgba(102, 126, 234, 0.3)'
  },
  slotReel: {
    fontSize: '5rem',
    width: '120px',
    height: '120px',
    backgroundColor: '#0a0e27',
    border: '2px solid #667eea',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  payline: {
    height: '4px',
    backgroundColor: '#ffd700',
    marginTop: '1rem',
    boxShadow: '0 0 15px #ffd700',
    borderRadius: '2px'
  },
  betSection: {
    marginBottom: '2rem'
  },
  betLabel: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    fontWeight: '600',
    textAlign: 'center'
  },
  betButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem'
  },
  betButton: {
    padding: '1rem',
    backgroundColor: '#0a0e27',
    color: '#fff',
    border: '2px solid #333',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600'
  },
  activeBetButton: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
    boxShadow: '0 0 15px rgba(102, 126, 234, 0.5)'
  },
  resultCard: {
    backgroundColor: '#0a0e27',
    padding: '1.5rem',
    borderRadius: '12px',
    textAlign: 'center',
    marginBottom: '1rem',
    border: '2px solid #667eea'
  },
  resultText: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  },
  winAmount: {
    fontSize: '2.5rem',
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  },
  newBalance: {
    fontSize: '1.2rem',
    color: '#aaa'
  },
  errorCard: {
    backgroundColor: '#ff444420',
    padding: '1rem',
    borderRadius: '8px',
    color: '#ff4444',
    marginBottom: '1rem',
    border: '1px solid #ff4444'
  },
  spinButton: {
    width: '100%',
    padding: '1.5rem',
    backgroundColor: '#667eea',
    color: '#fff',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    borderRadius: '12px',
    cursor: 'pointer',
    border: 'none',
    marginBottom: '2rem',
    boxShadow: '0 0 30px rgba(102, 126, 234, 0.5)'
  },
  spinButtonDisabled: {
    backgroundColor: '#333',
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  payoutTable: {
    backgroundColor: '#0a0e27',
    padding: '1.5rem',
    borderRadius: '8px'
  },
  payouts: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginTop: '1rem'
  },
  payoutItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#1a1f3a',
    borderRadius: '6px',
    fontSize: '1.2rem'
  },
  comingSoon: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#1a1f3a',
    borderRadius: '12px'
  }
};

export default Games;
