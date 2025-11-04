import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfettiEffect({ trigger, onComplete }) {
  const count = 50;
  
  return (
    <AnimatePresence>
      {trigger && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          overflow: 'hidden'
        }}>
          {Array.from({ length: count }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${Math.random() * 100}%`,
                y: -20,
                rotate: 0,
                scale: Math.random() * 0.8 + 0.2
              }}
              animate={{
                y: window.innerHeight + 100,
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                x: `${Math.random() * 100}%`,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: Math.random() * 2 + 1,
                ease: 'easeOut'
              }}
              style={{
                position: 'absolute',
                fontSize: Math.random() * 20 + 15,
                color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FF9FF3', '#F7B731', '#EE5A6F'][Math.floor(Math.random() * 7)],
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
              onAnimationComplete={() => {
                if (i === count - 1 && onComplete) {
                  onComplete();
                }
              }}
            >
              {['💰', '✨', '💎', '👑', '🔥', '⚡', '⭐'][Math.floor(Math.random() * 7)]}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

