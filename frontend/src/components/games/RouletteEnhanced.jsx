import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeProvider';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function RouletteEnhanced() {
  const theme = useTheme();
  const { user, setUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [betAmount, setBetAmount] = useState(1000);
  const [betType, setBetType] = useState('red');
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const betOptions = [500, 1000, 2500, 5000, 10000];
  const numbers = Array.from({ length: 37 }, (_, i) => i);
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  useEffect(() => {
    fetchBalance();
  }, []);

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
    if (spinning || betAmount > balance) return;

    setSpinning(true);
    setResult(null);

    try {
      const betData = selectedNumber !== null 
        ? { betAmount, betType: 'number', betNumber: selectedNumber }
        : { betAmount, betType: 'color', betNumber: betType };

      const response = await api.post('/games/roulette/spin', betData);
      const data = response.data.data;

      setBalance(data.newBalance);
      if (user && setUser) {
        setUser({ ...user, balance: data.newBalance });
      }

      setResult(data);
      setHistory([{ number: data.winningNumber, win: data.result === 'win', amount: data.winAmount }, ...history.slice(0, 9)]);
    } catch (error) {
      console.error('Roulette spin failed:', error);
    } finally {
      setSpinning(false);
    }
  };

  const getNumberColor = (num) => {
    if (num === 0) return '#4CAF50';
    if (redNumbers.includes(num)) return '#ff4444';
    return '#333';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.gradients.background,
      color: '#fff',
      padding: '2rem'
    }}>
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
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto 2rem'
        }}
      >
        <div style={{ fontSize: '0.9rem', color: '#fff9', marginBottom: '0.5rem' }}>Your Balance</div>
        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: theme.colors.accent }}>
          {balance.toLocaleString()} CMX
        </div>
      </motion.div>

      {/* Bet Selection */}
      <div style={{
        background: theme.gradients.card,
        backdropFilter: 'blur(40px)',
        border: '3px solid rgba(255,255,255,0.2)',
        borderRadius: '30px',
        padding: '2rem',
        maxWidth: '900px',
        margin: '0 auto 2rem'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '2rem',
          background: theme.gradients.primary,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🎲 European Roulette
        </h2>

        {/* Bet Type Selection */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
          {['red', 'black'].map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setBetType(type); setSelectedNumber(null); }}
              disabled={spinning}
              style={{
                padding: '1rem 2rem',
                background: betType === type ? (type === 'red' ? '#ff4444' : '#333') : 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontWeight: '700',
                cursor: spinning ? 'not-allowed' : 'pointer',
                opacity: spinning ? 0.5 : 1
              }}
            >
              {type === 'red' ? '🔴 RED (2x)' : '⚫ BLACK (2x)'}
            </motion.button>
          ))}
        </div>

        {/* Number Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '0.5rem',
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem'
        }}>
          {numbers.map((num) => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setSelectedNumber(num); setBetType(null); }}
              disabled={spinning}
              style={{
                padding: '0.75rem',
                background: getNumberColor(num),
                border: selectedNumber === num ? '3px solid #ffd700' : '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                color: num === 0 || redNumbers.includes(num) ? '#fff' : '#fff',
                fontWeight: 'bold',
                cursor: spinning ? 'not-allowed' : 'pointer',
                boxShadow: selectedNumber === num ? '0 0 20px #ffd700' : 'none'
              }}
            >
              {num}
            </motion.button>
          ))}
        </div>

        {/* Result Display */}
        {result && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              padding: '2rem',
              background: result.result === 'win' ? 'rgba(46, 213, 115, 0.2)' : 'rgba(255, 71, 87, 0.2)',
              borderRadius: '20px',
              marginBottom: '2rem',
              textAlign: 'center',
              border: `2px solid ${result.result === 'win' ? 'rgba(46, 213, 115, 0.5)' : 'rgba(255, 71, 87, 0.5)'}`
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem', color: getNumberColor(result.winningNumber) }}>
              {result.winningNumber}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              {result.result === 'win' ? '🎉 YOU WON!' : '😢 Try Again!'}
            </div>
            {result.winAmount > 0 && (
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#2ed571' }}>
                +{result.winAmount.toLocaleString()} CMX
              </div>
            )}
          </motion.div>
        )}

        {/* Bet Amount Selector */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '1rem', color: '#fff9', marginBottom: '1rem', textAlign: 'center' }}>
            Bet Amount: {betAmount} CMX
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {betOptions.map((amount) => (
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
          disabled={spinning || betAmount > balance || (betType === null && selectedNumber === null)}
          style={{
            width: '100%',
            padding: '1.5rem',
            background: spinning || betAmount > balance ? theme.colors.secondary : theme.gradients.primary,
            border: 'none',
            borderRadius: '20px',
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: '800',
            cursor: spinning || betAmount > balance ? 'not-allowed' : 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}
        >
          {spinning ? '🔄 SPINNING...' : betAmount > balance ? '❌ INSUFFICIENT BALANCE' : (betType === null && selectedNumber === null ? 'Select a bet' : '🎲 SPIN WHEEL')}
        </motion.button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: theme.gradients.card,
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}
        >
          <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Recent Spins</h3>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '1rem 0' }}>
            {history.map((spin, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '1rem',
                  minWidth: '100px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: getNumberColor(spin.number) }}>
                  {spin.number}
                </div>
                <div style={{ color: spin.win ? theme.colors.success : theme.colors.error, fontWeight: '700' }}>
                  {spin.win ? `+${spin.amount}` : '-1000'}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
