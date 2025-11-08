import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import CMXLogo from '../../components/CMXLogo';
import api from '../../utils/api';
import gamesCardImage from '../../assets/images/games.png';
import cmxLogoImage from '../../assets/images/CMX-logo.png';
import profileCardImage from '../../assets/images/profile.jpg';
import walletCardImage from '../../assets/images/wallet.jpg';
import balanceCardImage from '../../assets/images/balance.jpg';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    tasksCompleted: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        api.get('/wallet/balance'),
        api.get('/wallet/transactions').catch(() => ({ data: { data: [] } }))
      ]);
      
      setBalance(balanceRes.data.data.balance || 0);
      setTransactions(transactionsRes.data.data || []);
      
      // Get stats from user object
      setStats({
        gamesPlayed: user?.gamesPlayed || 0,
        gamesWon: user?.gamesWon || 0,
        tasksCompleted: user?.tasksCompleted || 0
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Use user data if API fails
      setBalance(user?.balance || 0);
      setStats({
        gamesPlayed: user?.gamesPlayed || 0,
        gamesWon: user?.gamesWon || 0,
        tasksCompleted: user?.tasksCompleted || 0
      });
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    if (type.includes('game') || type.includes('win') || type.includes('play')) return '🎮';
    if (type.includes('task') || type.includes('offer') || type.includes('survey')) return '📋';
    if (type.includes('video') || type.includes('ad')) return '📺';
    if (type.includes('withdraw') || type.includes('withdrawal')) return '💸';
    if (type.includes('deposit') || type.includes('credit')) return '💰';
    return '📊';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      .liquid-glass-dash {
        background: rgba(255, 255, 255, 0.04);
        backdrop-filter: blur(50px) saturate(180%);
        -webkit-backdrop-filter: blur(50px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 20px;
        padding: 2.5rem;
        position: relative;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 
          0 8px 32px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }
      .liquid-glass-dash::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.08),
          transparent
        );
        transition: left 0.7s ease;
        pointer-events: none;
        z-index: 0;
      }
      .liquid-glass-dash:hover::before {
        left: 100%;
      }
      .liquid-glass-dash:hover {
        border-color: rgba(255, 255, 255, 0.25);
        transform: translateY(-2px);
        box-shadow: 
          0 12px 40px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.15),
          0 0 60px rgba(118, 75, 162, 0.2);
      }
      .activity-scroll {
        max-height: 500px;
        overflow-y: auto;
        padding-right: 0.5rem;
      }
      .activity-scroll::-webkit-scrollbar {
        width: 8px;
      }
      .activity-scroll::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
      }
      .activity-scroll::-webkit-scrollbar-thumb {
        background: rgba(255, 215, 0, 0.3);
        border-radius: 10px;
      }
      .activity-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 215, 0, 0.5);
      }
      .text-glow {
        text-shadow: 0 0 20px rgba(255, 215, 0, 0.5),
                     0 0 40px rgba(255, 215, 0, 0.3);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const balanceCardStyle = {
    ...styles.balanceCard,
    backgroundImage: `linear-gradient(180deg, rgba(7, 11, 28, 0.55), rgba(7, 11, 28, 0.92)), url(${balanceCardImage})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundColor: '#050a1e',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    boxShadow: '0 28px 48px rgba(6, 10, 28, 0.45)'
  };

  const imageActionCardStyle = (action) =>
    action.iconImage
      ? {
          ...styles.actionCard,
          ...styles.imageActionCard,
          borderColor: `${action.color}80`,
          boxShadow: `0 16px 36px ${action.color}33`,
          backgroundImage: `linear-gradient(180deg, rgba(7, 11, 28, 0.4), rgba(7, 11, 28, 0.92)), url(${action.iconImage})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: '#050a1e'
        }
      : styles.actionCard;

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1f 50%, #0a0a0a 100%)',
        color: '#fff'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.header}
      >
        <div style={styles.headerLeft}>
          <CMXLogo size="50px" animated={false} />
          <div>
            <h1 style={styles.welcomeTitle}>Welcome, {user?.username || 'User'}</h1>
            <p style={styles.welcomeSubtitle}>Tier {user?.tier || 1} • Ready to Earn</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          style={styles.logoutButton}
        >
          Logout
        </motion.button>
      </motion.div>

      {/* Balance Card with Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={balanceCardStyle}
      >
        <div style={styles.balanceCardOverlay} />
        <div style={styles.balanceContent}>
          <h3 style={styles.balanceLabel}>Total Balance</h3>
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={styles.balanceAmount}
          >
            {balance.toLocaleString()}
          </motion.div>
          <div style={styles.logoContainer}>
            <CMXLogo size="60px" animated={false} />
          </div>
          <div style={styles.usdValue}>≈ ${ (balance / 10000).toFixed(2) } USD</div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={styles.actionsGrid}
      >
        {[
          {
            iconImage: gamesCardImage,
            label: 'Play Games',
            path: '/games',
            color: '#667eea',
            subtitle: 'Dive into every live game without leaving your dashboard.',
            ctaLabel: 'Play Now →'
          },
          {
            iconImage: cmxLogoImage,
            label: 'Earn CMX',
            path: '/tasks',
            color: '#FFD700',
            subtitle: 'Complete quests, offers, and missions to grow your CMX balance fast.',
            ctaLabel: 'Start Earning →'
          },
          {
            iconImage: walletCardImage,
            label: 'Wallet',
            path: '/wallet',
            color: '#764ba2',
            subtitle: 'Check balances, review payouts, and manage withdrawals instantly.',
            ctaLabel: 'Open Wallet →'
          },
          {
            iconImage: profileCardImage,
            label: 'Profile',
            path: '/profile',
            color: '#5ac8fa',
            subtitle: 'Track your tier, stats, and personalize the way you play.',
            ctaLabel: 'View Profile →'
          }
        ].map((action, idx) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={action.path} style={{ textDecoration: 'none' }}>
              <div className="liquid-glass-dash" style={imageActionCardStyle(action)}>
                {action.iconImage ? (
                  <div style={styles.imageActionContent}>
                    <div>
                      <span style={styles.imageActionLabel}>{action.label}</span>
                      {action.subtitle && <p style={styles.imageActionSubtitle}>{action.subtitle}</p>}
                    </div>
                    {action.ctaLabel && (
                      <span style={{ ...styles.imageActionButton, borderColor: action.color }}>
                        {action.ctaLabel}
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    <div style={{ ...styles.actionIcon, color: action.color }}>{action.icon}</div>
                    <div style={{ ...styles.actionLabel, color: action.color }}>{action.label}</div>
                  </>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats and Activity Grid */}
      <div style={styles.bottomGrid}>
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={styles.statsSection}
        >
          {[
            { label: 'Tier Level', value: `${user?.tier || 1}/5`, icon: '👑', color: '#FFD700' },
            { label: 'Games Played', value: stats.gamesPlayed, icon: '🎮', color: '#667eea' },
            { label: 'Total Won', value: stats.gamesWon, icon: '🏆', color: '#764ba2' },
            { label: 'Tasks Completed', value: stats.tasksCompleted, icon: '✅', color: '#5ac8fa' }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="liquid-glass-dash"
              style={styles.statCard}
            >
              <div style={styles.statIcon}>{stat.icon}</div>
              <div>
                <div style={styles.statLabel}>{stat.label}</div>
                <div style={{...styles.statValue, color: stat.color}}>{stat.value}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Activity History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="liquid-glass-dash"
          style={styles.activityCard}
        >
          <h3 className="text-glow" style={styles.activityTitle}>Activity History</h3>
          <div className="activity-scroll" style={styles.activityScroll}>
            {transactions.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📋</div>
                <p style={styles.emptyText}>No activity yet</p>
                <p style={styles.emptySubtext}>Start playing games or completing tasks to see your history here</p>
              </div>
            ) : (
              transactions.map((transaction, idx) => (
                <motion.div
                  key={transaction._id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + idx * 0.05 }}
                  style={styles.activityItem}
                >
                  <div style={styles.activityIconContainer}>
                    <div style={styles.activityIcon}>
                      {getActivityIcon(transaction.type || transaction.description || '')}
                    </div>
                  </div>
                  <div style={styles.activityContent}>
                    <div style={styles.activityDescription}>
                      {transaction.description || transaction.type || 'Activity'}
                    </div>
                    <div style={styles.activityMeta}>
                      <span style={styles.activityDate}>
                        {formatDate(transaction.timestamp || transaction.createdAt)}
                      </span>
                      {transaction.amount !== undefined && (
                        <span style={{
                          ...styles.activityAmount,
                          color: transaction.amount >= 0 ? '#4ade80' : '#ff6b6b'
                        }}>
                          {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toLocaleString()} CMX
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1f 30%, #0f0a20 60%, #0a0a0a 100%)',
    color: '#fff',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
    opacity: 0.4
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2.5rem',
    position: 'relative',
    zIndex: 10
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  welcomeTitle: {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.5px'
  },
  welcomeSubtitle: {
    margin: '0.25rem 0 0 0',
    fontSize: '1rem',
    color: '#FFD700',
    fontWeight: '500'
  },
  logoutButton: {
    padding: '0.875rem 1.75rem',
    background: 'rgba(255, 68, 68, 0.15)',
    border: '1px solid rgba(255, 68, 68, 0.3)',
    borderRadius: '12px',
    color: '#ff6b6b',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease'
  },
  balanceCard: {
    marginBottom: '2rem',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '3rem',
    borderRadius: '26px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    transition: 'transform 0.4s ease, box-shadow 0.4s ease'
  },
  balanceCardOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(7, 11, 28, 0.35), rgba(4, 7, 20, 0.78))',
    backdropFilter: 'blur(4px)',
    zIndex: 0
  },
  balanceContent: {
    position: 'relative',
    zIndex: 1
  },
  balanceLabel: {
    margin: '0 0 1.5rem 0',
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    letterSpacing: '0.5px'
  },
  balanceAmount: {
    fontSize: '4.5rem',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #FFD700 0%, #ffa500 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1rem',
    letterSpacing: '-1px',
    lineHeight: '1'
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  usdValue: {
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '500',
    marginTop: '0.5rem'
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
    position: 'relative',
    zIndex: 10
  },
  actionCard: {
    padding: '2rem',
    textAlign: 'center',
    cursor: 'pointer',
    minHeight: '140px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageActionCard: {
    padding: '2.25rem',
    textAlign: 'left',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    minHeight: '220px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderWidth: '2px'
  },
  imageActionContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '1.5rem',
    height: '100%'
  },
  imageActionLabel: {
    display: 'inline-block',
    fontSize: '1.35rem',
    fontWeight: '800',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#f8fafc',
    marginBottom: '0.5rem'
  },
  imageActionSubtitle: {
    margin: 0,
    fontSize: '0.95rem',
    color: 'rgba(226, 232, 240, 0.78)',
    maxWidth: '16rem',
    lineHeight: 1.45,
    minHeight: '2.9em'
  },
  imageActionButton: {
    alignSelf: 'flex-start',
    padding: '0.65rem 1.5rem',
    borderRadius: '12px',
    border: '1px solid rgba(148, 163, 184, 0.45)',
    color: '#0b1220',
    background: 'rgba(226, 232, 240, 0.92)',
    fontWeight: '700',
    letterSpacing: '0.04em'
  },
  actionIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    filter: 'drop-shadow(0 0 10px currentColor)'
  },
  actionLabel: {
    fontSize: '1.2rem',
    fontWeight: '700',
    letterSpacing: '-0.3px'
  },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '2rem',
    position: 'relative',
    zIndex: 10
  },
  statsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem'
  },
  statCard: {
    padding: '1.75rem',
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'center',
    minHeight: '100px'
  },
  statIcon: {
    fontSize: '2.5rem',
    flexShrink: 0
  },
  statLabel: {
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.65)',
    marginBottom: '0.5rem',
    fontWeight: '500'
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: '800',
    letterSpacing: '-0.5px'
  },
  activityCard: {
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column'
  },
  activityTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: '1.5rem',
    letterSpacing: '-0.3px'
  },
  activityScroll: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 2rem',
    textAlign: 'center',
    minHeight: '300px'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    opacity: 0.5
  },
  emptyText: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '0.5rem'
  },
  emptySubtext: {
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.5)',
    maxWidth: '300px'
  },
  activityItem: {
    display: 'flex',
    gap: '1.25rem',
    padding: '1.25rem',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  activityIconContainer: {
    flexShrink: 0
  },
  activityIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'rgba(255, 215, 0, 0.1)',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.75rem'
  },
  activityContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  activityDescription: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: '1.4'
  },
  activityMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem'
  },
  activityDate: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '400'
  },
  activityAmount: {
    fontSize: '0.95rem',
    fontWeight: '700',
    letterSpacing: '0.3px'
  }
};

export default Dashboard;
