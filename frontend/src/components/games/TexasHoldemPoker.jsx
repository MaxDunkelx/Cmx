import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeProvider';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const AI_PLAYERS = [
  { name: 'Alex', avatar: '🎮', personality: 'aggressive' },
  { name: 'Jordan', avatar: '🧑‍💼', personality: 'conservative' },
  { name: 'Sam', avatar: '🎭', personality: 'balanced' }
];

export default function TexasHoldemPoker() {
  const theme = useTheme();
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [gameState, setGameState] = useState('waiting');
  const [pot, setPot] = useState(0);
  const [players, setPlayers] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [yourCards, setYourCards] = useState([]);
  const [betAmount, setBetAmount] = useState(50);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState('human');
  const [aiThinking, setAiThinking] = useState(null);

  useEffect(() => {
    fetchBalance();
  }, []);

  useEffect(() => {
    if (timerActive && timeLeft > 0 && isMyTurn) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isMyTurn) {
      autoFold();
    }
  }, [timerActive, timeLeft, isMyTurn]);

  const fetchBalance = async () => {
    try {
      const response = await api.get('/wallet/balance');
      setBalance(response.data.data.balance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  const createDeck = () => {
    const suits = ['♠️', '♥️', '♦️', '♣️'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank, display: `${rank}${suit}` });
      }
    }
    return shuffle(deck);
  };

  const shuffle = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startNewHand = () => {
    const deck = createDeck();
    const humanPlayer = {
      id: 'human',
      name: user?.username || 'You',
      cards: [deck[0], deck[1]],
      chips: 1000,
      hasFolded: false,
      isHuman: true,
      avatar: '😎',
      totalInvested: 0
    };
    
    const aiPlayers = AI_PLAYERS.map((ai, i) => ({
      id: `ai-${i}`,
      name: ai.name,
      cards: [deck[2+i*2], deck[3+i*2]],
      chips: 1000,
      hasFolded: false,
      isHuman: false,
      avatar: ai.avatar,
      personality: ai.personality,
      totalInvested: 0
    }));
    
    setPlayers([humanPlayer, ...aiPlayers]);
    setYourCards([deck[0], deck[1]]);
    setGameState('preFlop');
    setPot(150);
    setCurrentPlayerId('human');
    setIsMyTurn(true);
    setTimerActive(true);
    setTimeLeft(30);
    setMessage('Your turn!');
  };

  const autoFold = () => {
    setTimerActive(false);
    setIsMyTurn(false);
    setPlayers(prev => prev.map(p => p.id === 'human' ? { ...p, hasFolded: true } : p));
    setMessage('Time up! Auto-folded');
    setTimeout(() => nextPlayer(), 1000);
  };

  const handleAction = (action) => {
    if (!isMyTurn) return;
    setTimerActive(false);
    setIsMyTurn(false);
    
    if (action === 'fold') {
      setPlayers(prev => prev.map(p => p.id === 'human' ? { ...p, hasFolded: true } : p));
      setMessage('You folded');
    } else if (action === 'check') {
      setMessage('Check');
    } else if (action === 'bet') {
      setPot(prev => prev + betAmount);
      setPlayers(prev => prev.map(p => p.id === 'human' ? {
        ...p,
        chips: p.chips - betAmount,
        totalInvested: p.totalInvested + betAmount
      } : p));
      setMessage(`You bet ${betAmount} CMX`);
    }
    
    setTimeout(() => nextPlayer(), 1000);
  };

  const nextPlayer = () => {
    const currentIndex = players.findIndex(p => p.id === currentPlayerId);
    const nextIndex = (currentIndex + 1) % players.length;
    const nextPlayer = players[nextIndex];
    
    if (!nextPlayer.hasFolded && nextPlayer) {
      setCurrentPlayerId(nextPlayer.id);
      
      if (nextPlayer.isHuman) {
        setIsMyTurn(true);
        setTimerActive(true);
        setTimeLeft(30);
        setMessage('Your turn!');
      } else {
        makeAIMove(nextPlayer);
      }
    }
  };

  const makeAIMove = (aiPlayer) => {
    setAiThinking(aiPlayer.id);
    
    setTimeout(() => {
      setAiThinking(null);
      
      const decision = Math.random();
      const personality = aiPlayer.personality;
      
      let action;
      if (personality === 'aggressive') {
        if (decision < 0.6) action = 'bet';
        else if (decision < 0.95) action = 'call';
        else action = 'fold';
      } else if (personality === 'conservative') {
        if (decision < 0.5) action = 'fold';
        else if (decision < 0.8) action = 'call';
        else action = 'bet';
      } else {
        if (decision < 0.4) action = 'call';
        else if (decision < 0.7) action = 'bet';
        else action = 'fold';
      }
      
      if (action === 'fold') {
        setMessage(`${aiPlayer.name} folds`);
        setPlayers(prev => prev.map(p => p.id === aiPlayer.id ? { ...p, hasFolded: true } : p));
      } else if (action === 'call') {
        setMessage(`${aiPlayer.name} calls`);
        setPot(prev => prev + betAmount);
      } else {
        const betSize = Math.min(aiPlayer.chips, betAmount * 2);
        setMessage(`${aiPlayer.name} bets ${betSize}`);
        setPot(prev => prev + betSize);
      }
      
      setTimeout(() => nextPlayer(), 1500);
    }, 2000 + Math.random() * 2000);
  };

  const dealFlop = () => {
    setGameState('flop');
    setCommunityCards([
      { suit: '♠️', rank: 'A', display: 'A♠️' },
      { suit: '♥️', rank: 'K', display: 'K♥️' },
      { suit: '♦️', rank: 'Q', display: 'Q♦️' }
    ]);
    setMessage('Flop dealt!');
  };

  const dealTurn = () => {
    setGameState('turn');
    setCommunityCards(prev => [...prev, { suit: '♣️', rank: 'J', display: 'J♣️' }]);
    setMessage('Turn card dealt!');
  };

  const dealRiver = () => {
    setGameState('river');
    setCommunityCards(prev => [...prev, { suit: '♠️', rank: '10', display: '10♠️' }]);
    setMessage('River card dealt!');
  };

  useEffect(() => {
    if (gameState === 'preFlop' && communityCards.length === 0) {
      setTimeout(() => dealFlop(), 12000);
    } else if (gameState === 'flop' && communityCards.length === 3) {
      setTimeout(() => dealTurn(), 10000);
    } else if (gameState === 'turn' && communityCards.length === 4) {
      setTimeout(() => dealRiver(), 10000);
    } else if (gameState === 'river' && communityCards.length === 5) {
      setTimeout(() => {
        setGameState('showdown');
        setMessage('Showdown! Hand complete!');
        setTimeout(() => {
          setGameState('waiting');
          setCommunityCards([]);
          setMessage('');
        }, 3000);
      }, 8000);
    }
  }, [gameState, communityCards.length]);

  const timerColor = timeLeft > 20 ? '#2ed571' : timeLeft > 10 ? '#ffd700' : '#ff3b30';

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.gradients.background,
      color: '#fff',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* Balance */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        left: '2rem',
        background: theme.gradients.card,
        backdropFilter: 'blur(40px)',
        border: '2px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '1.5rem 2rem',
        zIndex: 10
      }}>
        <div style={{ fontSize: '0.9rem', color: '#fff9', marginBottom: '0.25rem' }}>Your Balance</div>
        <div style={{ fontSize: '2rem', fontWeight: '800', color: theme.colors.accent }}>
          {balance.toLocaleString()} CMX
        </div>
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', marginTop: '6rem', marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '800',
          background: theme.gradients.primary,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0
        }}>
          🃏 Texas Hold'em Poker
        </h1>
        <div style={{ color: '#fff9', marginTop: '0.5rem', fontSize: '1.1Jim...rem' }}>
          {gameState === 'waiting' && 'Ready to play'}
          {gameState === 'preFlop成名' && '🃏 Pre-Flop'}
          {gameState === 'flop' && '🃏 Flop'}
          {gameState === 'turn' && '🃏 Turn'}
          {gameState === 'river' && '🃏 River'}
          {gameState === 'showdown' && '🃏 Showdown'}
        </div>
      </div>

      {/* Table */}
      <div style={{ maxWidth: '1400px', margin: '2rem auto', position: 'relative', width: '100%' }}>
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          style={{
            background: 'radial-gradient(ellipse at center, #0f5132 0%, #082f1d 100%)',
            border: '35px solid #8b5a2b',
            borderRadius: '50%',
            aspectRatio: '2 / 1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
            overflow: 'hidden'
          }}
        >
          {/* POT Display */}
          {pot > 0 && (
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgyme(0,0,0,0.8)',
              backdropFilter: 'blur(40px)',
              border: '4px solid rgba(255,العربية215,0,0.5)',
              borderRadius: '24px',
              padding: '1.5rem 3rem',
              textAlign: 'center',
              zIndex: 20
            }}>
              <div style={{ fontSize: '1rem', color: '#fff9' }}>💰 POT</div>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: theme.colors.accent }}>
                {pot.toLocaleString()} CMX
              </div>
            </div>
          )}

          {/* Community Cards */}
          {communityCards.length > 0 && (
            <div style={{
              position: 'absolute',
              bottom: '32%',
              display: 'flex',
              gap: '1rem'
            }}>
              {communityCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: idx * 0.15, type: 'spring' }}
                  style={{
                    width: '75px',
                    height: '110px',
                    background: '#fff',
                    border: '3px solid #000',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: card.suit === '♥️' || card.suit === '♦️' ? '#d32f2f' : '#000'
                  }}
                >
                  {card.display}
                </motion.div>
              ))}
            </div>
          )}

          {/* Card Stack */}
          {communityCards.length === 0 && gameState !== 'waiting' && (
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{
                position: 'absolute',
                bottom: '35%',
                width: '220px',
                height: '130px',
                background: 'linear-gradient(145deg, #1a0e0e, #0d0000)',
                border: '10px solid #3d1f1f',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '5rem'
              }}
            >
              🃏
            </motion.div>
          )}
        </motion.div>

        {/* AI Players */}
        {players.filter(p => !p.isHuman).map((player, idx) => {
          const isCurrentTurn = currentPlayerId === player.id;
          const isThinking = aiThinking === player.id;
          
          return (
            <div
              key={player.id}
              style={{
                position: 'absolute',
                top: idx === 0 ? '5%' : idx === 1 ? '50%' : '95%',
                left: idx === 0 ? '5%' : idx === 1 ? '95%' : '5%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              {isCurrentTurn && (
                <div style={{
                  position: 'absolute',
                  top: '-60px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: theme.colors.accent,
                  color: '#000',
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  zIndex: 12
                }}>
                  {player.name}'s Turn
                </div>
              )}
              
              {isThinking && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.7)',
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    zIndex: 11
                  }}
                >
                  🤔 Thinking...
                </motion.div>
              )}
              
              <div style={{
                background: theme.gradients.card,
                backdropFilter: 'blur(40px)',
                border: isCurrentTurn ? `3px solid ${theme.colors.accent}` : '2px solid rgba(255,255,255,0.2)',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                textAlign: 'center',
                minWidth: '160px'
              }}>
                <div style={{ fontSize: '2.5rem' }}>{player.avatar}</div>
                <div style={{ fontWeight: '700' }}>{player.name}</div>
                <div style={{ color: theme.colors.accent }}>{player.chips} CMX</div>
                {player.hasFolded && <div style={{ color: '#ff3b30', fontWeight: '700' }}>FOLDED</div>}
              </div>
            </div>
          );
        })}

        {/* Human Player */}
        <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)' }}>
          {isMyTurn && (
            <div style={{
              position: 'absolute',
              top: '-80px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: theme.colors.accent,
              color: '#000',
              padding: '0.75rem 1.5rem',
              borderRadius: '16px',
              fontWeight: '800',
              fontSize: '1rem',
              zIndex: 12
            }}>
              Your Turn! ⏱️ {timeLeft}s
            </div>
          )}
          
          <div style={{
            position: 'relative',
            background: theme.gradients.card,
            backdropFilter: 'blur(40px)',
            border: isMyTurn ? `3px solid ${theme.colors.accent}` : '2px solid rgba(255,255,255,0.3)',
            borderRadius: '20px',
            padding: '1.5rem 2rem',
            textAlign: 'center'
          }}>
            {isMyTurn && (
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  position: 'absolute',
                  inset: '-15px',
                  borderRadius: '20px',
                  background: `radial-gradient(circle, ${timerColor}80 0%, transparent 70%)`,
                  pointerEvents: 'none',
                  zIndex: -1
                }}
              />
            )}
            
            <div style={{ fontSize: '2.5rem' }}>😎</div>
            <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{user?.username || 'You'}</div>
            <div style={{ color: theme.colors.accent }}>{balance} CMX</div>
          </div>

          {yourCards.length > 0 && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              {yourCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ x: -800, y: 500, rotate: -90, opacity: 0 }}
                  animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.3, duration: 1.2, type: 'spring' }}
                  style={{
                    width: '75px',
                    height: '110px',
                    background: '#fff',
                    border: '3px solid #000',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: card.suit === '♥️' || card.suit === '♦️' ? '#d32f2f' : '#000'
                  }}
                >
                  {card.display}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
        {gameState === 'waiting' ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startNewHand}
            style={{
              padding: '1.5rem 4rem',
              background: theme.colors.success,
              border: 'none',
              borderRadius: '24px',
              color: '#fff',
              fontSize: '1.3rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            🎰 Start New Hand
          </motion.button>
        ) : isMyTurn ? (
          <div style={{
            background: theme.gradients.card,
            backdropFilter: 'blur(40px)',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: '24px',
            padding: '2rem',
            maxWidth: '700px',
            width: '100%'
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: '#fff9' }}>💰 Bet Amount</span>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: timerColor }}>
                  {betAmount.toLocaleString()} CMX
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={balance || 1000}
                value={betAmount}
                onChange={(e) => setBetAmount(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '14px',
                  background: `linear-gradient(to right, ${timerColor} 0%, ${timerColor} ${((betAmount - 50) / ((balance || 1000) - 50)) * 100}%, rgba(255,255,255,0.2) 100%)`,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction('check')}
                style={{
                  padding: '1.25rem 2.5rem',
                  background: theme.colors.success,
                  border: 'none',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                ✓ Check
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction('bet')}
                style={{
                  padding: '1.25rem 2.5rem',
                  background: theme.colors.accent,
                  border: 'none',
                  borderRadius: '16px',
                  color: '#000',
                  fontSize: '1.1rem',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                💰 Bet {betAmount}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction('fold')}
                style={{
                  padding: '1.25rem 2.5rem',
                  background: '#ff3b30',
                  border: 'none',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                ❌ Fold
              </motion.button>
            </div>
          </div>
        ) : null}
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: theme.gradients.card,
            backdropFilter: 'blur(40px)',
            border: '2px solid rgba(255,255,255,0.2)',
            padding: '1rem 2rem',
            borderRadius: '16px',
            fontSize: '1.1rem',
            fontWeight: '700',
            zIndex: 100
          }}
        >
          {message}
        </motion.div>
      )}
    </div>
  );
}

