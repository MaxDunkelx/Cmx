import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../components/ThemeProvider';
import api from '../../utils/api';

function Tasks() {
  const theme = useTheme();
  const [balance, setBalance] = useState(25000);
  const [tasks, setTasks] = useState([]);

  // Earning containers ready for integration
  const earningMethods = [
    {
      type: 'survey',
      title: 'Surveys',
      icon: '📋',
      description: 'Complete surveys to earn CMX',
      availability: 'Available Now',
      color: theme.colors.primary
    },
    {
      type: 'ads',
      title: 'Watch Ads',
      icon: '📺',
      description: 'Watch video ads and earn rewards',
      availability: '5 ads available',
      color: theme.colors.secondary
    },
    {
      type: 'social',
      title: 'Social Tasks',
      icon: '👥',
      description: 'Follow, like, share for CMX',
      availability: '12 tasks available',
      color: theme.colors.accent
    },
    {
      type: 'download',
      title: 'App Installs',
      icon: '📱',
      description: 'Download and try apps',
      availability: '3 apps available',
      color: theme.colors.success
    }
  ];

  const dailyQuests = [
    { id: 1, task: 'Play 3 games', progress: 0, target: 3, reward: 500 },
    { id: 2, task: 'Complete 2 surveys', progress: 0, target: 2, reward: 1000 },
    { id: 3, task: 'Win 1 game', progress: 0, target: 1, reward: 800 },
    { id: 4, task: 'Login streak', progress: 1, target: 7, reward: 2000 }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.gradients.background,
      color: '#fff',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        margin: '0 0 3rem 0',
        background: theme.gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center'
      }}>
        💰 Earn CMX Hub
      </h1>

      {/* Earning Methods Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        marginBottom: '4rem'
      }}>
        {earningMethods.map((method, idx) => (
          <motion.div
            key={method.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            style={{
              background: theme.gradients.card,
              backdropFilter: 'blur(40px)',
              border: `2px solid ${method.color}40`,
              borderRadius: '24px',
              padding: '2rem',
              cursor: 'pointer',
              boxShadow: `0 8px 32px ${method.color}20`
            }}
          >
            <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '1rem' }}>
              {method.icon}
            </div>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: method.color,
              marginBottom: '0.5rem',
              textAlign: 'center'
            }}>
              {method.title}
            </h3>
            <p style={{
              color: '#fff9',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {method.description}
            </p>
            <div style={{
              background: `${method.color}20`,
              borderRadius: '12px',
              padding: '0.75rem',
              textAlign: 'center',
              color: method.color,
              fontWeight: '600'
            }}>
              {method.availability}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: '100%',
                marginTop: '1.5rem',
                padding: '1rem',
                background: method.color,
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '1.1rem',
                cursor: 'pointer'
              }}
            >
              Start Earning →
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Daily Quests */}
      <h2 style={{
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '2rem',
        color: theme.colors.accent
      }}>
        ⚡ Daily Quests
      </h2>
      <div style={{
        display: 'grid',
        gap: '1rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {dailyQuests.map((quest, idx) => {
          const percentage = (quest.progress / quest.target) * 100;
          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              style={{
                background: theme.gradients.card,
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '1.5rem'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem'
              }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>
                    {quest.task}
                  </h4>
                </div>
                <div style={{
                  background: theme.colors.accent,
                  color: '#000',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.9rem'
                }}>
                  +{quest.reward} CMX
                </div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                height: '8px',
                overflow: 'hidden',
                marginBottom: '0.5rem'
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1 }}
                  style={{
                    background: theme.colors.success,
                    height: '100%',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <p style={{ margin: 0, color: '#fff9', fontSize: '0.9rem' }}>
                {quest.progress} / {quest.target} completed
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Tasks;
