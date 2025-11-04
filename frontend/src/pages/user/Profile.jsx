import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../components/ThemeProvider';
import { useAuth } from '../../context/AuthContext';
import CMXLogo from '../../components/CMXLogo';

export default function Profile() {
  const theme = useTheme();
  const { user } = useAuth();

  const tierColors = {
    1: '#9ca3af',
    2: '#3b82f6',
    3: '#8b5cf6',
    4: '#ec4899',
    5: '#f59e0b'
  };

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
        WebkitTextFillColor: 'transparent'
      }}>
        👤 Your Profile
      </h1>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: theme.gradients.card,
          backdropFilter: 'blur(40px)',
          border: '2px solid rgba(255,255,255,0.1)',
          borderRadius: '30px',
          padding: '3rem',
          marginBottom: '3rem',
          maxWidth: '800px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{
            width: '120px',
            height: '120px',
            background: theme.gradients.primary,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem'
          }}>
            <CMXLogo size="80px" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              {user?.username || 'Player'}
            </h2>
            <p style={{ color: theme.colors.secondary, fontSize: '1.2rem' }}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* Tier Display */}
        <div style={{
          background: `linear-gradient(135deg, ${tierColors[user?.tier || 1]}20, ${tierColors[user?.tier || 1]}05)`,
          border: `2px solid ${tierColors[user?.tier || 1]}40`,
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👑</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: tierColors[user?.tier || 1] }}>
            Tier {user?.tier || 1}
          </div>
          <p style={{ color: '#fff9', marginTop: '0.5rem' }}>
            Current tier benefits active
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem'
        }}>
          {[
            { label: 'Games Played', value: user?.gamesPlayed || 0, icon: '🎮' },
            { label: 'Games Won', value: user?.gamesWon || 0, icon: '🏆' },
            { label: 'Tasks Completed', value: user?.tasksCompleted || 0, icon: '✅' },
            { label: 'Total Earned', value: (user?.totalEarned || 0).toLocaleString(), icon: '💰' }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.03 }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: theme.colors.accent }}>
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Account Settings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          background: theme.gradients.card,
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '2rem',
          maxWidth: '800px'
        }}
      >
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '2rem'
        }}>
          ⚙️ Account Settings
        </h2>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {[
            { icon: '🔒', label: 'Change Password', action: 'Update' },
            { icon: '📧', label: 'Email Notifications', action: 'Configure' },
            { icon: '🔔', label: 'Notification Settings', action: 'Manage' },
            { icon: '🎁', label: 'Referral Program', action: 'Invite' }
          ].map((setting, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>{setting.icon}</div>
                <div style={{ fontWeight: '600' }}>{setting.label}</div>
              </div>
              <button style={{
                padding: '0.75rem 1.5rem',
                background: theme.colors.primary,
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                {setting.action}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
