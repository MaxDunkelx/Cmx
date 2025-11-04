import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeProvider';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import ConfettiEffect from '../ConfettiEffect';

export default function SlotsEnhanced({ gameName = "🎰 CMX Slots", themeColor, symbols = ['🍒', '🍋', '🍊', '⭐', '💎', '7️⃣'] }) {
  const theme = useTheme();
  const { user, setUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [betAmount, setBetAmount] = useState(100);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(['?', '?', '?']);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bigWin, setBigWin] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await api.get('/wallet/balance');
      setBalance(response.data.data.balance);
      
      // Update user context with new balance
      if (user && setUser) {
        setUser({ ...user, balance: response.data.data.balance });
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  const handleSpin = async () => {
    if (spinning) return;
    if (betAmount > balance) {
      setMessage('Insufficient balance!');
      return;
    }
    if (betAmount < 10) {
      setMessage('Minimum bet is 10 CMX');
      return;
    }

    setSpinning(true);
    setResult(null);
    setMessage('Spinning...');

    // Show spinning animation
    const spinInterval = setInterval(() => {
            setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
    }, 50);

    try {
      const response = await api.post('/games/slots/spin', { betAmount });
      const data = response.data.data;

      clearInterval(spinInterval);
      await new Promise(resolve => setTimeout(resolve, 500));

      setReels(data.reels);
      setBalance(data.newBalance);
      
      // Update user context
      if (user && setUser) {
        setUser({ ...user, balance: data.newBalance });
      }

      setResult(data);
      
      if (data.result === 'win') {
        // Check if big win (multiplier > 10x)
        const isBigWin = data.multiplier >= 10;
        setBigWin(isBigWin);
        
        // Trigger confetti
        setShowConfetti(true);
        
        if (isBigWin) {
          setMessage(`🔥 JACKPOT! ${data.winAmount} CMX (${data.multiplier}x)! 🔥`);
        } else {
          setMessage(`🎉 WIN! ${data.winAmount} CMX (${data.multiplier}x)`);
        }
      } else {
        setMessage(`Better luck next time! Lost ${betAmount} CMX`);
      }

      // Add to history
      setHistory(prev => [{
        reels: data.reels,
        win: data.result === 'win',
        amount: data.winAmount,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]);
    } catch (error) {
      clearInterval(spinInterval);
      setMessage(error.response?.data?.message || 'Failed to spin. Please try again.');
    } finally {
      setSpinning(false);
    }
  };

  const betButtons = [50, 100, 250, 500, 1000];

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.gradients.background,
      color: '#fff',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Confetti Effect on Wins */}
      <ConfettiEffect 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      {/* Balance Display */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{
          background: theme.gradients.card,
          backdropFilter: 'blur(40px)',
          border: '2px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '1.5rem 3rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '0.9rem', color: '#fff9', marginBottom: '0.5rem' }}>Your Balance</div>
        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: theme.colors.accent }}>
          {balance.toLocaleString()} CMX
        </div>
      </motion.div>

      {/* Slot Machine */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: theme.gradients.card,
          backdropFilter: 'blur(40px)',
          border: '3px solid rgba(255,255,255,0.2)',
          borderRadius: '30px',
          padding: '3rem',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        <h2 style={{
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '2rem',
          background: theme.gradients.primary,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {gameName}
        </h2>

        {/* Reels */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {reels.map((symbol, idx) => (
            <motion.div
              key={idx}
              animate={spinning ? {
                rotateY: [0, 360],
                scale: [1, 1.2, 1]
              } : {}}
              transition={{ duration: 0.3, repeat: spinning ? Infinity : 0 }}
              style={{
                aspectRatio: '1',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '5rem'
              }}
            >
              {symbol}
            </motion.div>
          ))}
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                textAlign: 'center',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                background: result?.result === 'win' 
                  ? 'rgba(46, 213, 115, 0.2)' 
                  : 'rgba(255, 71, 87, 0.2)',
                color: result?.result === 'win' ? '#6feaa3' : '#ff6b7a',
                fontWeight: '700',
                fontSize: '1.2rem'
              }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bet Amount */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '1rem', color: '#fff9', marginBottom: '1rem', textAlign: 'center' }}>
            Bet Amount: {betAmount} CMX
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {betButtons.map((amount) => (
              <motion.button
                key={amount}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBetAmount(amount)}
                disabled={amount > balance || spinning}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: betAmount === amount ? theme.colors.accent : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: betAmount === amount ? '#000' : '#fff',
                  fontWeight: '700',
                  cursor: amount > balance ? 'not-allowed' : 'pointer',
                  opacity: amount > balance ? 0.5 : 1
                }}
              >
                {amount}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Spin Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSpin}
          disabled={spinning || betAmount > balance}
          style={{
            width: '100%',
            padding: '1.5rem',
            background: spinning
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : theme.gradients.primary,
            border: 'none',
            borderRadius: '20px',
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: '800',
            cursor: spinning || betAmount > balance ? 'not-allowed' : 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}
        >
          {spinning ? '🔄 SPINNING...' : '🎰 SPIN'}
        </motion.button>
      </motion.div>

      {/* History */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            marginTop: '2rem',
            width: '100%',
            maxWidth: '600px'
          }}
        >
          <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Recent Spins</h3>
          <div style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            padding: '1rem 0'
          }}>
            {history.map((spin, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  background: theme.gradients.card,
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '1rem',
                  minWidth: '100px'
                }}
              >
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: '0.5rem'
                }}>
                  {spin.reels.map((s, i) => <span key={i}>{s}</span>)}
                </div>
                <div style={{
                  textAlign: 'center',
                  color: spin.win ? theme.colors.success : theme.colors.error,
                  fontWeight: '700'
                }}>
                  {spin.win ? `+${spin.amount}` : '-50'}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
