import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeProvider';
import EgyptianTreasureSlot from './slots/EgyptianTreasureSlot';
import PirateCascadeSlot from './slots/PirateCascadeSlot';
import SpaceMegawaysSlot from './slots/SpaceMegawaysSlot';
import CandyClusterSlot from './slots/CandyClusterSlot';
import DragonFortuneSlot from './slots/DragonFortuneSlot';
import WildWestBonanzaSlot from './slots/WildWestBonanzaSlot';
import OceanDepthsSlot from './slots/OceanDepthsSlot';

const SLOT_MACHINES = [
  {
    id: 'egyptian',
    name: 'Egyptian Treasure',
    icon: '🏺',
    description: 'Ancient mysteries with 9 paylines',
    grid: '3x4',
    features: ['Vibrant Paylines', 'Wild Symbols', 'Classic Gameplay'],
    color: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    bgColor: 'linear-gradient(135deg, #1a1410 0%, #3d2a1f 50%, #1a1410 100%)',
    component: EgyptianTreasureSlot,
    volatility: 'Medium',
    maxWin: '1000x'
  },
  {
    id: 'pirate',
    name: 'Pirate Cascade',
    icon: '🏴‍☠️',
    description: 'Cascading wins on the high seas',
    grid: '4x5',
    features: ['Cascade Reels', 'Multipliers', 'Chain Reactions'],
    color: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
    bgColor: 'linear-gradient(135deg, #0a1628 0%, #1a3a52 50%, #0a1628 100%)',
    component: PirateCascadeSlot,
    volatility: 'High',
    maxWin: '5000x'
  },
  {
    id: 'space',
    name: 'Space Megaways',
    icon: '🚀',
    description: 'Up to 117,649 ways to win',
    grid: '5x4',
    features: ['Megaways', '25 Paylines', 'Cosmic Wins'],
    color: 'linear-gradient(135deg, #00FFFF 0%, #FF00FF 100%)',
    bgColor: 'linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0a0e27 100%)',
    component: SpaceMegawaysSlot,
    volatility: 'Very High',
    maxWin: '10000x'
  },
  {
    id: 'candy',
    name: 'Candy Cluster',
    icon: '🍬',
    description: 'Sweet cluster pays system',
    grid: '5x5',
    features: ['Cluster Pays', 'Match 5+', 'Explosive Wins'],
    color: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
    bgColor: 'linear-gradient(135deg, #ff6b9d 0%, #c06c84 50%, #ff6b9d 100%)',
    component: CandyClusterSlot,
    volatility: 'Medium',
    maxWin: '2500x'
  },
  {
    id: 'dragon',
    name: 'Dragon Fortune',
    icon: '🐉',
    description: 'Progressive jackpot adventure',
    grid: '4x5',
    features: ['Expanding Wilds', 'Jackpot', 'Fire Breathing Wins'],
    color: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
    bgColor: 'linear-gradient(135deg, #1a0a00 0%, #4a1a0a 50%, #1a0a00 100%)',
    component: DragonFortuneSlot,
    volatility: 'Very High',
    maxWin: 'JACKPOT!'
  },
  {
    id: 'west',
    name: 'Wild West Bonanza',
    icon: '🤠',
    description: 'Sticky wilds and free spins',
    grid: '3x5',
    features: ['Sticky Wilds', 'Free Spins', '3x Multiplier'],
    color: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)',
    bgColor: 'linear-gradient(135deg, #2c1810 0%, #5d4037 50%, #2c1810 100%)',
    component: WildWestBonanzaSlot,
    volatility: 'Medium',
    maxWin: '800x'
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    icon: '🧜‍♀️',
    description: 'Dive into underwater riches',
    grid: '4x6',
    features: ['15 Paylines', 'Mermaid Bonus', 'Deep Sea Treasures'],
    color: 'linear-gradient(135deg, #64C8FF 0%, #00CED1 100%)',
    bgColor: 'linear-gradient(180deg, #001f3f 0%, #006494 50%, #001f3f 100%)',
    component: OceanDepthsSlot,
    volatility: 'High',
    maxWin: '2000x'
  }
];

export default function SlotMachineHub() {
  const theme = useTheme();
  const [selectedSlot, setSelectedSlot] = useState(null);

  if (selectedSlot) {
    const SlotComponent = selectedSlot.component;
    return (
      <div style={{ position: 'relative' }}>
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedSlot(null)}
          style={{
            position: 'fixed',
            top: '2rem',
            left: '2rem',
            zIndex: 1000,
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(50,50,50,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '15px',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>←</span>
          Back to Slot Hub
        </motion.button>
        
        <SlotComponent />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      color: '#fff',
      padding: '3rem 2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(138, 43, 226, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(138, 43, 226, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(138, 43, 226, 0.2) 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          marginBottom: '3rem',
          position: 'relative',
          zIndex: 1
        }}
      >
        <motion.h1
          animate={{
            textShadow: [
              '0 0 20px rgba(138, 43, 226, 0.8)',
              '0 0 40px rgba(138, 43, 226, 1)',
              '0 0 20px rgba(138, 43, 226, 0.8)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontSize: '4rem',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #fff 0%, #8a2be2 50%, #fff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            letterSpacing: '3px'
          }}
        >
          🎰 SLOT MACHINE HUB 🎰
        </motion.h1>
        <p style={{
          fontSize: '1.3rem',
          color: '#ccc',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          Choose from 7 spectacular slot machines, each with unique themes, mechanics, and winning potential!
        </p>
      </motion.div>

      {/* Slot Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {SLOT_MACHINES.map((slot, index) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -10 }}
            onClick={() => setSelectedSlot(slot)}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: '25px',
              padding: '2rem',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Background gradient */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: slot.color,
              opacity: 0.1,
              zIndex: 0
            }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Icon & Name */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    fontSize: '4rem',
                    filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))'
                  }}
                >
                  {slot.icon}
                </motion.div>
                <div>
                  <h3 style={{
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    marginBottom: '0.25rem',
                    background: slot.color,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {slot.name}
                  </h3>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#bbb',
                    fontWeight: '600'
                  }}>
                    {slot.grid} Grid
                  </div>
                </div>
              </div>

              {/* Description */}
              <p style={{
                color: '#ddd',
                fontSize: '1rem',
                marginBottom: '1.5rem',
                lineHeight: '1.5'
              }}>
                {slot.description}
              </p>

              {/* Stats */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                padding: '1rem',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.25rem' }}>VOLATILITY</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>{slot.volatility}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.25rem' }}>MAX WIN</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#FFD700' }}>{slot.maxWin}</div>
                </div>
              </div>

              {/* Features */}
              <div>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#999',
                  marginBottom: '0.75rem',
                  fontWeight: '600'
                }}>
                  FEATURES:
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {slot.features.map((feature, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '0.4rem 0.8rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: '#fff'
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Play Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: '100%',
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: slot.color,
                  border: 'none',
                  borderRadius: '15px',
                  color: '#000',
                  fontSize: '1.2rem',
                  fontWeight: '900',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                Play Now
              </motion.button>
            </div>

            {/* Corner Badge */}
            {(slot.id === 'dragon' || slot.id === 'space') && (
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: '900',
                  color: '#000',
                  boxShadow: '0 5px 20px rgba(255, 215, 0, 0.5)',
                  zIndex: 2
                }}
              >
                🔥 HOT
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          textAlign: 'center',
          marginTop: '4rem',
          padding: '2rem',
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          maxWidth: '800px',
          margin: '4rem auto 0',
          position: 'relative',
          zIndex: 1
        }}
      >
        <h3 style={{
          fontSize: '1.5rem',
          marginBottom: '1rem',
          color: '#fff'
        }}>
          🎲 Provably Fair Gaming
        </h3>
        <p style={{
          color: '#ccc',
          fontSize: '1rem',
          lineHeight: '1.6'
        }}>
          All our slot machines use provably fair algorithms with a target RTP of 94-96%.
          Each spin is cryptographically verifiable for complete transparency and fairness.
        </p>
      </motion.div>
    </div>
  );
}

