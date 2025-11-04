import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../components/ThemeProvider';
import SlotSelector from '../../components/games/SlotSelector';
import RouletteEnhanced from '../../components/games/RouletteEnhanced';
import BlackjackEnhanced from '../../components/games/BlackjackEnhanced';
import TexasHoldemPoker from '../../components/games/TexasHoldemPoker';

function Games() {
  const theme = useTheme();
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    { id: 'slots', name: '🎰 Slots', description: 'Spin the reels and win big!', color: theme.colors.primary },
    { id: 'roulette', name: '🎲 Roulette', description: 'Bet on your lucky number', color: theme.colors.secondary },
    { id: 'blackjack', name: '🃏 Blackjack', description: 'Beat the dealer to 21', color: theme.colors.accent },
    { id: 'poker', name: '♠️ Texas Hold\'em', description: 'The ultimate poker experience', color: theme.colors.success }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.gradients.background,
      color: '#fff',
      padding: '2rem'
    }}>
      {!activeGame ? (
        <>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            margin: '0 0 1rem 0',
            background: theme.gradients.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
          }}>
            🎮 Gaming Hub
          </h1>
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#fff9', marginBottom: '3rem' }}>
            Choose your game and start winning CMX
          </p>

          {/* Game Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            {games.map((game, idx) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveGame(game.id)}
                style={{
                  background: theme.gradients.card,
                  backdropFilter: 'blur(40px)',
                  border: `3px solid ${game.color}60`,
                  borderRadius: '24px',
                  padding: '3rem',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: `0 12px 48px ${game.color}30`
                }}
              >
                {/* Animated Background */}
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${game.color}10 0%, transparent 100%)`,
                    pointerEvents: 'none'
                  }}
                />
                <div style={{ position: 'relative', textAlign: 'center' }}>
                  <div style={{
                    fontSize: '5rem',
                    marginBottom: '1rem',
                    filter: `drop-shadow(0 0 20px ${game.color})`
                  }}>
                    {game.name.split(' ')[0]}
                  </div>
                  <h3 style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: game.color,
                    marginBottom: '0.5rem'
                  }}>
                    {game.name.split(' ').slice(1).join(' ')}
                  </h3>
                  <p style={{
                    color: '#fff9',
                    fontSize: '1.1rem',
                    marginBottom: '1.5rem'
                  }}>
                    {game.description}
                  </p>
                  <div style={{
                    background: game.color,
                    color: '#000',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    fontWeight: '700',
                    display: 'inline-block'
                  }}>
                    Play Now →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setActiveGame(null)}
            style={{
              padding: '0.75rem 1.5rem',
              background: theme.colors.secondary,
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '2rem'
            }}
          >
            ← Back to Games
          </motion.button>
          
          <AnimatePresence mode="wait">
            {activeGame === 'slots' && <SlotSelector key="slots" />}
            {activeGame === 'roulette' && <RouletteEnhanced key="roulette" />}
            {activeGame === 'blackjack' && <BlackjackEnhanced key="blackjack" />}
            {activeGame === 'poker' && <TexasHoldemPoker key="poker" />}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default Games;

