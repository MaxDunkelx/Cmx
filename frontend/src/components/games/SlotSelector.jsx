import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeProvider';
import { useAuth } from '../../context/AuthContext';

// Import all slot variations
import ClassicCasinoSlots from './slots/ClassicCasinoSlots';
import PirateTreasureSlots from './slots/PirateTreasureSlots';
import BankHeistSlots from './slots/BankHeistSlots';
import SpaceAdventureSlots from './slots/SpaceAdventureSlots';
import EgyptianPyramidSlots from './slots/EgyptianPyramidSlots';
import FantasyCastleSlots from './slots/FantasyCastleSlots';

const slotGames = [
  {
    id: 'classic',
    name: 'Classic Casino',
    icon: '🎰',
    description: 'Classic 3-reel slots with lucky symbols',
    theme: '#8b5cf6',
    reelConfig: '3x3',
    component: ClassicCasinoSlots
  },
  {
    id: 'pirate',
    name: 'Pirate Treasure',
    icon: '🏴‍☠️',
    description: 'Sail the seas for buried treasure! 3x5 reels',
    theme: '#f59e0b',
    reelConfig: '3x5',
    component: PirateTreasureSlots
  },
  {
    id: 'bankheist',
    name: 'Bank Heist',
    icon: '💰',
    description: 'Break into the vault! 4x4 bonus reels',
    theme: '#ef4444',
    reelConfig: '4x4',
    component: BankHeistSlots
  },
  {
    id: 'space',
    name: 'Space Adventure',
    icon: '🚀',
    description: 'Journey through the cosmos! 3x3 cosmic',
    theme: '#3b82f6',
    reelConfig: '3x3',
    component: SpaceAdventureSlots
  },
  {
    id: 'egyptian',
    name: 'Egyptian Pyramid',
    icon: '🏺',
    description: 'Ancient riches await! 5x3 mega rows',
    theme: '#10b981',
    reelConfig: '5x3',
    component: EgyptianPyramidSlots
  },
  {
    id: 'fantasy',
    name: 'Fantasy Castle',
    icon: '🏰',
    description: 'Magical realm of wizards and dragons!',
    theme: '#ec4899',
    reelConfig: '3x3',
    component: FantasyCastleSlots
  }
];

export default function SlotSelector() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [activeSlot, setActiveSlot] = useState(null);
  const theme = useTheme();
  const { user } = useAuth();

  if (activeSlot) {
    const SlotComponent = slotGames.find(s => s.id === activeSlot)?.component;
    if (SlotComponent) {
      return (
        <div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setActiveSlot(null)}
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
            ← Back to Slot Selection
          </motion.button>
          <SlotComponent />
        </div>
      );
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.gradients.background,
      padding: '2rem'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '800',
          margin: '0 0 1rem 0',
          background: theme.gradients.primary,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🎰 Choose Your Slot Adventure
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#fff9' }}>
          Each slot has unique payouts, animations, and themes!
        </p>
      </motion.div>

      {/* Ad Banner Placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'center',
          border: '2px solid rgba(255,255,255,0.2)'
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎁 Bonus Offer!</div>
        <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>
          Complete surveys to earn free CMX credits!
        </div>
        <button style={{
          marginTop: '1rem',
          padding: '0.75rem 2rem',
          background: 'rgba(255,255,255,0.2)',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '12px',
          color: '#fff',
          fontWeight: '700',
          cursor: 'pointer'
        }}>
          Complete Survey →
        </button>
      </motion.div>

      {/* Slot Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {slotGames.map((slot, idx) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSlot(slot.id)}
            onMouseEnter={() => setSelectedSlot(slot.id)}
            onMouseLeave={() => setSelectedSlot(null)}
            style={{
              background: theme.gradients.card,
              backdropFilter: 'blur(40px)',
              border: `3px solid ${selectedSlot === slot.id ? slot.theme : 'rgba(255,255,255,0.2)'}`,
              borderRadius: '24px',
              padding: '2.5rem',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `0 12px 48px ${slot.theme}30`
            }}
          >
            {/* Theme Background Animation */}
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
                background: `linear-gradient(135deg, ${slot.theme}15 0%, transparent 100%)`,
                pointerEvents: 'none'
              }}
            />
            
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{slot.icon}</div>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '800',
                color: slot.theme,
                marginBottom: '0.5rem'
              }}>
                {slot.name}
              </h3>
              <p style={{ color: '#fff9', fontSize: '1rem', marginBottom: '1rem' }}>
                {slot.description}
              </p>
              <div style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.1)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '700',
                color: slot.theme,
                marginBottom: '1rem'
              }}>
                {slot.reelConfig} Reels
              </div>
              <div style={{
                background: slot.theme,
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

      {/* Earning Opportunities Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          marginTop: '3rem',
          background: theme.gradients.card,
          backdropFilter: 'blur(40px)',
          border: '2px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '2rem',
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '800',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          💰 Other Ways to Earn CMX
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1 recombinationfr))',
          gap: '1rem'
        }}>
          {[
            { icon: '📝', label: 'Complete Surveys', earning: '50-500 CMX per survey' },
            { icon: '🎥', label: 'Watch Ads', earning: '10-100 CMX per ad' },
            { icon: '🎮', label: 'Play Mini-Games', earning: '25-250 CMX per game' },
            { icon: '📱', label: 'Download Apps', earning: '100-1000 CMX per app' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '1.5rem',
                borderRadius: '16px',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{item.label}</div>
              <div style={{ fontSize: '0.9rem', color: theme.colors.accent }}>{item.earning}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

