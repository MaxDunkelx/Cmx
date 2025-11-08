import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../components/ThemeProvider';
import SlotMachineHub from '../../components/games/SlotMachineHub';
import RouletteEnhanced from '../../components/games/RouletteEnhanced';
import BlackjackEnhanced from '../../components/games/BlackjackEnhanced';
import TexasHoldemPoker from '../../components/games/TexasHoldemPoker';
import blackjackBackdrop from '../../assets/images/black-jack.png';
import gamesCardImage from '../../assets/images/games.png';
import rouletteCardImage from '../../assets/images/roulete.png';
import backgroundVideo from '../../assets/background-vidio.mp4';

function Games() {
  const theme = useTheme();
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    {
      id: 'slots',
      name: 'Slots',
      description: 'Spin the reels and win big!',
      color: theme.colors.primary,
      image: gamesCardImage
    },
    {
      id: 'roulette',
      name: 'Roulette',
      description: 'Bet on your lucky number',
      color: theme.colors.secondary,
      image: rouletteCardImage
    },
    { id: 'blackjack', name: 'Blackjack', description: 'Beat the dealer to 21', color: theme.colors.accent },
    { id: 'poker', name: 'Texas Hold\'em', description: 'The ultimate poker experience', color: theme.colors.success }
  ];

  const styles = {
    backgroundWrapper: {
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden'
    },
    backgroundVideo: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: 'translate(-50%, -50%)',
      zIndex: -2
    },
    backgroundOverlay: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(circle at top, rgba(4,7,20,0.55), rgba(4,7,20,0.92))',
      backdropFilter: 'blur(4px)',
      zIndex: -1
    },
    blackjackCardContent: {
      position: 'absolute',
      inset: '0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2.5rem',
      background: 'linear-gradient(180deg, rgba(4,7,20,0.3) 0%, rgba(4,7,20,0.85) 65%)'
    },
    blackjackTitle: {
      fontSize: '2.4rem',
      fontWeight: 800,
      marginBottom: '0.5rem'
    },
    blackjackSubtitle: {
      fontSize: '1.1rem',
      color: 'rgba(226, 232, 240, 0.75)'
    },
    blackjackPlayCue: {
      alignSelf: 'flex-start',
      background: 'rgba(226, 232, 240, 0.92)',
      color: '#0b1220',
      padding: '0.85rem 1.75rem',
      borderRadius: '14px',
      fontWeight: 700,
      letterSpacing: '0.04em'
    },
    imageCardContent: {
      position: 'absolute',
      inset: '0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2.5rem',
      background: 'linear-gradient(180deg, rgba(4,7,20,0.35) 0%, rgba(4,7,20,0.85) 75%)'
    },
    imageCardTitle: {
      fontSize: '2.3rem',
      fontWeight: 800,
      marginBottom: '0.5rem'
    },
    imageCardSubtitle: {
      fontSize: '1.05rem',
      color: 'rgba(226, 232, 240, 0.82)'
    },
    imageCardPlayCue: {
      alignSelf: 'flex-start',
      padding: '0.85rem 1.75rem',
      borderRadius: '14px',
      fontWeight: 700,
      letterSpacing: '0.04em',
      background: 'rgba(226, 232, 240, 0.92)',
      color: '#0b1220',
      border: '1px solid transparent',
      boxShadow: '0 12px 28px rgba(15, 23, 42, 0.45)'
    }
  };

  return (
    <div style={styles.backgroundWrapper}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={styles.backgroundVideo}
        src={backgroundVideo}
      />
      <div style={styles.backgroundOverlay} />
      <div style={{
        minHeight: '100vh',
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
            {games.map((game, idx) => {
              const isBlackjack = game.id === 'blackjack';
              const hasShowcaseImage = Boolean(game.image);
              const isShowcaseCard = isBlackjack || hasShowcaseImage;
              const showcaseBackground = isBlackjack ? blackjackBackdrop : game.image;
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveGame(game.id)}
                  style={
                    isShowcaseCard
                      ? {
                          position: 'relative',
                          height: '360px',
                          borderRadius: '24px',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          boxShadow: `0 12px 48px ${game.color}40`,
                          border: `3px solid ${game.color}60`,
                          backgroundImage: `linear-gradient(180deg, rgba(4, 7, 20, 0.45), rgba(4, 7, 20, 0.85)), url(${showcaseBackground})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }
                      : {
                          background: theme.gradients.card,
                          backdropFilter: 'blur(40px)',
                          border: `3px solid ${game.color}60`,
                          borderRadius: '24px',
                          padding: '3rem',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: `0 12px 48px ${game.color}30`
                        }
                  }
                >
                  {isBlackjack ? (
                    <div style={styles.blackjackCardContent}>
                      <div>
                        <h3 style={{ ...styles.blackjackTitle, color: game.color }}>Blackjack</h3>
                        <p style={styles.blackjackSubtitle}>Master the table and prove your edge.</p>
                      </div>
                      <div style={styles.blackjackPlayCue}>Play Now →</div>
                    </div>
                  ) : hasShowcaseImage ? (
                    <div style={styles.imageCardContent}>
                      <div>
                        <h3 style={{ ...styles.imageCardTitle, color: game.color }}>{game.name}</h3>
                        <p style={styles.imageCardSubtitle}>{game.description}</p>
                      </div>
                      <div
                        style={{
                          ...styles.imageCardPlayCue,
                          borderColor: game.color,
                          boxShadow: `0 12px 32px ${game.color}38`
                        }}
                      >
                        Play Now →
                      </div>
                    </div>
                  ) : (
                    <>
                      <motion.div
                        animate={{
                          backgroundPosition: ['0% 0%', '100% 100%']
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
                          {game.name.charAt(0)}
                        </div>
                        <h3 style={{
                          fontSize: '2rem',
                          fontWeight: '800',
                          color: game.color,
                          marginBottom: '0.5rem'
                        }}>
                          {game.name}
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
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setActiveGame(null)}
            style={{
              position: 'fixed',
              left: '2rem',
              bottom: '2rem',
              padding: '0.75rem 1.5rem',
              background: theme.colors.secondary,
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              zIndex: 5
            }}
          >
            ← Back to Games
          </motion.button>
          
          <AnimatePresence mode="wait">
            {activeGame === 'slots' && <SlotMachineHub key="slots" />}
            {activeGame === 'roulette' && <RouletteEnhanced key="roulette" />}
            {activeGame === 'blackjack' && <BlackjackEnhanced key="blackjack" />}
            {activeGame === 'poker' && <TexasHoldemPoker key="poker" />}
          </AnimatePresence>
        </>
      )}
      </div>
    </div>
  );
}

export default Games;

