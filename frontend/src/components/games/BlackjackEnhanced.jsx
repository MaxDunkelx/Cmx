import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeProvider';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function BlackjackEnhanced() {
  const theme = useTheme();
  const { user, setUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [betAmount, setBetAmount] = useState(1000);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);
  const [deck, setDeck] = useState([]);

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

  const createDeck = () => {
    const newDeck = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        newDeck.push(rank + suit);
      }
    }
    return newDeck;
  };

  const shuffleDeck = (deckToShuffle) => {
    const shuffled = [...deckToShuffle];
    const getSecureRandom = () => {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return array[0] / (0xFFFFFFFF + 1);
    };
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(getSecureRandom() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getCardDisplay = (card) => {
    return card;
  };

  const calculateHandValue = (hand) => {
    let value = 0;
    let aces = 0;
    
    for (const card of hand) {
      const rank = card[0];
      if (rank === 'A') {
        aces++;
        value += 11;
      } else if (['J', 'Q', 'K'].includes(rank)) {
        value += 10;
      } else if (rank === '1' && card[1] === '0') {
        value += 10;
      } else {
        value += parseInt(rank) || 0;
      }
    }
    
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    
    return value;
  };

  const startGame = () => {
    const freshDeck = shuffleDeck(createDeck());
    const newPlayerHand = [freshDeck[0], freshDeck[1]];
    const newDealerHand = [freshDeck[2], freshDeck[3]];
    
    setDeck(freshDeck.slice(4));
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setGameStarted(true);
    setGameOver(false);
    setResult(null);
  };

  const hit = () => {
    if (deck.length === 0) {
      const freshDeck = shuffleDeck(createDeck());
      setDeck(freshDeck);
      const newHand = [...playerHand, freshDeck[0]];
      setPlayerHand(newHand);
      setDeck(freshDeck.slice(1));
      
      if (calculateHandValue(newHand) > 21) {
        stand(newHand);
      }
      return;
    }
    
    const newHand = [...playerHand, deck[0]];
    setPlayerHand(newHand);
    setDeck(deck.slice(1));
    
    if (calculateHandValue(newHand) > 21) {
      stand(newHand);
    }
  };

  const stand = async (hand = playerHand) => {
    let dealerHands = [...dealerHand];
    let currentDeck = [...deck];
    
    while (calculateHandValue(dealerHands) < 17) {
      if (currentDeck.length === 0) {
        const freshDeck = shuffleDeck(createDeck());
        currentDeck = freshDeck;
      }
      dealerHands.push(currentDeck[0]);
      currentDeck = currentDeck.slice(1);
    }
    
    setDealerHand(dealerHands);
    setGameOver(true);
    
    // Send to backend for result processing
    try {
      const response = await api.post('/games/blackjack/play', {
        betAmount,
        playerHand: hand,
        dealerHand: dealerHands
      });
      const data = response.data.data;
      setResult(data);
      setBalance(data.newBalance);
      if (user && setUser) {
        setUser({ ...user, balance: data.newBalance });
      }
    } catch (error) {
      console.error('Blackjack play failed:', error);
    }
  };

  const newGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setPlayerHand([]);
    setDealerHand([]);
    setResult(null);
  };

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

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

      {/* Game Container */}
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
           Blackjack
        </h2>

        {!gameStarted ? (
          <>
            {/* Bet Selection */}
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

            {/* Deal Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
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
              {betAmount > balance ? '❌ INSUFFICIENT BALANCE' : ' DEAL CARDS'}
            </motion.button>
          </>
        ) : (
          <>
            {/* Game Area */}
            <div style={{ marginBottom: '2rem' }}>
              {/* Dealer Hand */}
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', textAlign: 'center' }}>
                  Dealer ({gameOver ? dealerValue : '?'})
                </h3>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {dealerHand.map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ rotateY: 180 }}
                      animate={{ rotateY: 0 }}
                      transition={{ delay: i * 0.2 }}
                      style={{
                        width: '80px',
                        height: '110px',
                        background: '#fff',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#000',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                      }}
                    >
                      {i === 1 && !gameOver ? '??' : getCardDisplay(card)}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Player Hand */}
              <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', textAlign: 'center' }}>
                  Your Hand ({playerValue})
                </h3>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {playerHand.map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ rotateY: 180 }}
                      animate={{ rotateY: 0 }}
                      transition={{ delay: i * 0.2 }}
                      style={{
                        width: '80px',
                        height: '110px',
                        background: '#fff',
                        border: playerValue > 21 ? '3px solid #ff4747' : '2px solid rgba(255,255,255,0.3)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#000',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                      }}
                    >
                      {getCardDisplay(card)}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
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
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  {result.result === 'win' && '🎉 YOU WON!'}
                  {result.result === 'loss' && '😢 YOU LOST!'}
                  {result.result === 'draw' && '🤝 PUSH!'}
                </div>
                {result.winAmount > 0 && (
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#2ed571' }}>
                    +{result.winAmount.toLocaleString()} CMX
                  </div>
                )}
              </motion.div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              {!gameOver && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={hit}
                    disabled={playerValue >= 21}
                    style={{
                      flex: 1,
                      maxWidth: '200px',
                      padding: '1rem 2rem',
                      background: playerValue >= 21 ? 'rgba(255,255,255,0.1)' : theme.colors.primary,
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      cursor: playerValue >= 21 ? 'not-allowed' : 'pointer',
                      opacity: playerValue >= 21 ? 0.5 : 1
                    }}
                  >
                    Hit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => stand()}
                    style={{
                      flex: 1,
                      maxWidth: '200px',
                      padding: '1rem 2rem',
                      background: theme.colors.accent,
                      border: 'none',
                      borderRadius: '12px',
                      color: '#000',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Stand
                  </motion.button>
                </>
              )}
              {gameOver && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={newGame}
                  style={{
                    flex: 1,
                    maxWidth: '300px',
                    padding: '1rem 2rem',
                    background: theme.gradients.primary,
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                    }}
                  >
                    New Game
                  </motion.button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
