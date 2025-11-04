import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeProvider';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function PokerEnhanced() {
  const theme = useTheme();
  const { user, setUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [betAmount, setBetAmount] = useState(1000);
  const [hand, setHand] = useState([]);
  const [heldCards, setHeldCards] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);

  const betOptions = [500, 1000, 2500, 5000, 10000];
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

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

  const dealCards = () => {
    const newHand = [];
    for (let i = 0; i < 5; i++) {
      const suit = suits[Math.floor(Math.random() * 4)];
      const rank = ranks[Math.floor(Math.random() * 13)];
      newHand.push(rank + suit);
    }
    setHand(newHand);
    setGameStarted(true);
    setGameOver(false);
    setHeldCards([]);
  };

  const toggleHold = (index) => {
    if (gameOver) return;
    setHeldCards(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const drawCards = async () => {
    const newHand = hand.map((card, i) => 
      heldCards.includes(i) ? card : ranks[Math.floor(Math.random() * 13)] + suits[Math.floor(Math.random() * 4)]
    );
    
    try {
      const response = await api.post('/games/poker/play', {
        betAmount,
        hand: newHand,
        handType: 'test',
        winAmount: betAmount
      });
      setResult(response.data.data);
      setBalance(response.data.data.newBalance);
      if (user && setUser) {
        setUser({ ...user, balance: response.data.data.newBalance });
      }
      setHand(newHand);
      setGameOver(true);
    } catch (error) {
      console.error('Poker play failed:', error);
    }
  };

  const newGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setHand([]);
    setHeldCards([]);
    setResult(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.gradients.background,
      color: '#fff',
      padding: '2rem'
    }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{
          background: theme.gradients.card,
          backdropFilter: 'blur(40px)',
          border: '2px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '1.5rem 3rem',
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

      <div style={{
        background: theme.gradients.card,
        backdropFilter: 'blur(40px)',
        border: '3px solid rgba(255,255,255,0.2)',
        borderRadius: '30px',
        padding: '2rem',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '2rem',
          background: theme.gradients.primary,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ♠️ Video Poker
        </h2>

        {!gameStarted ? (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '1rem', textAlign: 'center', fontWeight: '600' }}>
                Select Your Bet
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {betOptions.map((amount) => (
                  <motion.button
                    key={amount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setBetAmount(amount)}
                    disabled={amount > balance}
                    style={{
                      padding: '1rem 2rem',
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

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={dealCards}
              disabled={betAmount > balance}
              style={{
                width: '100%',
                padding: '1.5rem',
                background: betAmount > balance ? theme.colors.secondary : theme.gradients.primary,
                border: 'none',
                borderRadius: '20px',
                color: '#fff',
                fontSize: '1.8rem',
                fontWeight: '800',
                cursor: betAmount > balance ? 'not-allowed' : 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}
            >
              {betAmount > balance ? '❌ INSUFFICIENT BALANCE' : '♠️ DEAL CARDS'}
            </motion.button>
          </>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {hand.map((card, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <motion.button
                    whileHover={{ scale: heldCards.includes(index) ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleHold(index)}
                    disabled={gameOver}
                    style={{
                      width: '100%',
                      aspectRatio: '3/4',
                      background: '#fff',
                      border: heldCards.includes(index) ? '3px solid #ffd700' : '2px solid rgba(255,255,255,0.3)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#000',
                      cursor: gameOver ? 'not-allowed' : 'pointer',
                      boxShadow: heldCards.includes(index) ? '0 0 20px #ffd700' : '0 8px 16px rgba(0,0,0,0.2)'
                    }}
                  >
                    {card}
                  </motion.button>
                  {heldCards.includes(index) && !gameOver && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '0.9rem',
                      color: '#ffd700',
                      fontWeight: 'bold'
                    }}>
                      HELD
                    </div>
                  )}
                </div>
              ))}
            </div>

            {result && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  padding: '2rem',
                  background: result.result === 'win' ? 'rgba(46, 213, 115, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                  borderRadius: '20px',
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  {result.result === 'win' ? '🎉 You Won!' : '😢 You Lost!'}
                </div>
                {result.winAmount > 0 && (
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#2ed571', marginTop: '0.5rem' }}>
                    +{result.winAmount.toLocaleString()} CMX
                  </div>
                )}
              </motion.div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              {!gameOver && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={drawCards}
                  style={{
                    flex: 1,
                    maxWidth: '300px',
                    padding: '1.5rem',
                    background: theme.gradients.primary,
                    border: 'none',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                >
                  DRAW
                </motion.button>
              )}
              {gameOver && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={newGame}
                  style={{
                    flex: 1,
                    maxWidth: '300px',
                    padding: '1.5rem',
                    background: theme.colors.accent,
                    border: 'none',
                    borderRadius: '16px',
                    color: '#000',
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                >
                  NEW GAME
                </motion.button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
