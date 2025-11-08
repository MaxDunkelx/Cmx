import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';
import CMXLogo from '../components/CMXLogo';
import LiquidParticles from '../components/LiquidParticles';

function DashboardGlass() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBalance();
  }, [user, navigate]);

  const fetchBalance = async () => {
    try {
      setError(null);
      const response = await api.get('/wallet/balance');
      setBalance(response.data.data.balance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setError('Failed to load balance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <ErrorDisplay error={error} onRetry={fetchBalance} />
      </div>
    );
  }

  const currentPath = location.pathname;
  const tierPercentage = ((user?.tier || 1) / 5) * 100;

  return (
    <div style={styles.container}>
      <LiquidParticles count={25} />
      {/* Floating Background Blobs */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>
      <div style={styles.blob3}></div>

      {/* Header with Liquid Glass */}
      <div style={styles.header}>
        <div style={styles.logoSection}>
          <CMXLogo size="60px" animated={true} />
          <div>
            <p style={styles.welcomeText}>Welcome back, {user?.username || user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="liquid-glass-button" style={styles.logoutButton}>
          🚪 Logout
        </button>
      </div>
      
      {/* Liquid Glass Navigation */}
      <div style={styles.navContainer}>
        <nav style={styles.navBar}>
          <Link to="/dashboard" style={{...styles.navItem, ...(currentPath === '/dashboard' && styles.navItemActive)}}>
            <div style={styles.navIcon}>🏠</div>
            <span>Dashboard</span>
          </Link>
          <Link to="/tasks" style={{...styles.navItem, ...(currentPath === '/tasks' && styles.navItemActive)}}>
            <div style={styles.navIcon}>💼</div>
            <span>Earn CMX</span>
          </Link>
          <Link to="/games" style={{...styles.navItem, ...(currentPath === '/games' && styles.navItemActive)}}>
            <div style={styles.navIcon}>🎲</div>
            <span>Games</span>
          </Link>
          <Link to="/wallet" style={{...styles.navItem, ...(currentPath === '/wallet' && styles.navItemActive)}}>
            <div style={styles.navIcon}>💰</div>
            <span>Wallet</span>
          </Link>
          {user?.isAdmin && (
            <Link to="/admin" style={{...styles.navItem, ...(currentPath === '/admin' && styles.navItemActive)}}>
              <div style={styles.navIcon}>🛡️</div>
              <span>Admin</span>
            </Link>
          )}
        </nav>
      </div>

      {/* Main Content with Floating Glass Cards */}
      <div style={styles.content}>
        {/* Tier Card - Liquid Glass */}
        <div className="glass-card" style={styles.glassCard}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>👑</div>
            <h3 style={styles.cardTitle}>Your Tier</h3>
          </div>
          <div style={styles.tierDisplay}>
            <div style={styles.tierLevel}>{user?.tier || 1}/5</div>
            <div style={styles.tierLabel}>Level {user?.tier || 1}</div>
          </div>
          <div style={styles.progressContainer}>
            <div style={styles.progressTrack}>
              <div style={{...styles.progressFill, width: `${tierPercentage}%`}}></div>
            </div>
            <p style={styles.progressText}>
              {5 - (user?.tier || 1)} levels until maximum tier
            </p>
          </div>
        </div>

        {/* Balance Card - Liquid Glass with Glow */}
        <div className="glass-card" style={{...styles.glassCard, ...styles.balanceCard}}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>💵</div>
            <h3 style={styles.cardTitle}>Balance</h3>
          </div>
          <div style={styles.balanceDisplay}>
            <h2>{balance.toLocaleString()} CMX</h2>
            <p>≈ ${ (balance / 10000).toFixed(2) } USD</p>
          </div>
          <Link to="/wallet" className="liquid-glass-button" style={styles.withdrawButton}>
            Request Withdrawal →
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="glass-card" style={styles.glassCard}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>⚡</div>
            <h3 style={styles.cardTitle}>Quick Actions</h3>
          </div>
          <div style={styles.quickActions}>
            <Link to="/games" className="liquid-glass-button" style={styles.actionBtn}>
              <div style={styles.actionIcon}>🎰</div>
              <div style={styles.actionLabel}>Play Games</div>
            </Link>
            <Link to="/tasks" className="liquid-glass-button" style={styles.actionBtn}>
              <div style={styles.actionIcon}>💼</div>
              <div style={styles.actionLabel}>Earn More</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%)',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden'
  },
  
  // Floating Blobs Background
  blob1: {
    position: 'absolute',
    top: '-10%',
    right: '-5%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
    filter: 'blur(80px)',
    animation: 'float 8s ease-in-out infinite'
  },
  blob2: {
    position: 'absolute',
    bottom: '-10%',
    left: '-5%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(118, 75, 162, 0.3) 0%, transparent 70%)',
    filter: 'blur(80px)',
    animation: 'float 10s ease-in-out infinite reverse'
  },
  blob3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
    filter: 'blur(60px)',
    animation: 'float 12s ease-in-out infinite'
  },
  
  header: {
    padding: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10
  },
  
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  
  logoEmoji: {
    fontSize: '3.5rem',
    animation: 'float 3s ease-in-out infinite'
  },
  
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: 0,
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  
  welcomeText: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.6)',
    margin: 0
  },
  
  logoutButton: {
    padding: '0.875rem 2rem',
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
  },
  
  navContainer: {
    padding: '0 2rem 2rem',
    position: 'relative',
    zIndex: 10
  },
  
  navBar: {
    display: 'flex',
    gap: '1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '0.75rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
  },
  
  navItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    borderRadius: '16px',
    textDecoration: 'none',
    color: 'rgba(255,255,255,0.5)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  
  navItemActive: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.2)'
  },
  
  navIcon: {
    fontSize: '1.5rem'
  },
  
  content: {
    padding: '2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '2rem',
    position: 'relative',
    zIndex: 10
  },
  
  glassCard: {
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '28px',
    padding: '2.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: 'fadeInUp 0.6s ease'
  },
  
  balanceCard: {
    borderColor: 'rgba(102, 126, 234, 0.3)',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
  },
  
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem'
  },
  
  cardIcon: {
    fontSize: '2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: 0
  },
  
  tierDisplay: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  
  tierLevel: {
    fontSize: '4rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1
  },
  
  tierLabel: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.5)',
    marginTop: '0.5rem'
  },
  
  progressContainer: {
    marginTop: '1.5rem'
  },
  
  progressTrack: {
    height: '12px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative'
  },
  
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 0 20px rgba(102, 126, 234, 0.6)'
  },
  
  progressText: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.5)',
    marginTop: '0.75rem',
    textAlign: 'center'
  },
  
  balanceDisplay: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  },
  
  balanceAmount: {
    fontSize: '3.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  
  balanceCurrency: {
    fontSize: '1.5rem',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600'
  },
  
  usdEquivalent: {
    fontSize: '1.2rem',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '2rem'
  },
  
  withdrawButton: {
    width: '100%',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'block',
    textAlign: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    marginTop: 'auto'
  },
  
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem'
  },
  
  actionBtn: {
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '20px',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  actionIcon: {
    fontSize: '2.5rem'
  },
  
  actionLabel: {
    fontSize: '0.95rem',
    color: '#fff',
    fontWeight: '500'
  }
};

// Add CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .liquid-glass-button {
      position: relative;
      overflow: hidden;
    }
    
    .liquid-glass-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s;
    }
    
    .liquid-glass-button:hover::before {
      left: 100%;
    }
    
    .liquid-glass-button:hover {
      background: rgba(255, 255, 255, 0.12) !important;
      border-color: rgba(255, 255, 255, 0.25) !important;
      transform: translateY(-3px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2) !important;
    }
    
    .glass-card:hover {
      transform: translateY(-8px);
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    
    .navItem:hover {
      background: rgba(255, 255, 255, 0.08) !important;
      color: rgba(255,255,255,0.8) !important;
    }
  `;
  document.head.appendChild(style);
}

export default DashboardGlass;

