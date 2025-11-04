import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';

function Dashboard() {
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>🎮</div>
          <div>
            <h1 style={styles.title}>CMX Platform</h1>
            <p style={styles.welcome}>Welcome back, {user?.username || user?.email}!</p>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          <span>🚪</span> Logout
        </button>
      </div>
      
      <div style={styles.navBar}>
        <Link 
          to="/dashboard" 
          style={{...styles.navLink, ...(currentPath === '/dashboard' && styles.activeNavLink)}}
        >
          <span style={styles.navIcon}>🏠</span> Dashboard
        </Link>
        <Link 
          to="/tasks" 
          style={{...styles.navLink, ...(currentPath === '/tasks' && styles.activeNavLink)}}
        >
          <span style={styles.navIcon}>💼</span> Earn CMX
        </Link>
        <Link 
          to="/games" 
          style={{...styles.navLink, ...(currentPath === '/games' && styles.activeNavLink)}}
        >
          <span style={styles.navIcon}>🎲</span> Play Games
        </Link>
        <Link 
          to="/wallet" 
          style={{...styles.navLink, ...(currentPath === '/wallet' && styles.activeNavLink)}}
        >
          <span style={styles.navIcon}>💰</span> Wallet
        </Link>
        {user?.isAdmin && (
          <Link 
            to="/admin" 
            style={{...styles.navLink, ...(currentPath === '/admin' && styles.activeNavLink)}}
          >
            <span style={styles.navIcon}>🛡️</span> Admin
          </Link>
        )}
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Profile</h2>
          </div>
          <div style={styles.profileContent}>
            <div style={styles.tierBadge}>
              <span style={styles.tierLevel}>Tier {user?.tier || 1}/5</span>
            </div>
            <p style={styles.info}>Earn more to increase your tier and get better rewards!</p>
            <div style={styles.tierProgress}>
              <div style={styles.progressBar}>
                <div style={{...styles.progressFill, width: `${(user?.tier || 1) * 20}%`}}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>CMX Balance</h2>
          </div>
          <div style={styles.balanceContent}>
            <p style={styles.balance}>{balance.toLocaleString()} CMX</p>
            <p style={styles.usdValue}>≈ ${(balance / 10000 / 100).toFixed(2)} USD</p>
            <div style={styles.infoBox}>
              <span style={styles.infoIcon}>ℹ️</span>
              <span style={styles.infoText}>Minimum withdrawal: 5,000,000 CMX ($5)</span>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Quick Actions</h2>
          </div>
          <div style={styles.quickActions}>
            <Link to="/games" style={styles.actionButton}>
              <div style={styles.actionIcon}>🎰</div>
              <div style={styles.actionText}>Play Games</div>
            </Link>
            <Link to="/wallet" style={styles.actionButton}>
              <div style={styles.actionIcon}>💸</div>
              <div style={styles.actionText}>Request Withdrawal</div>
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
    background: '#0a0e27',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  logo: {
    fontSize: '3rem',
    animation: 'bounce 3s infinite'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0
  },
  welcome: {
    fontSize: '1rem',
    opacity: 0.9,
    margin: 0
  },
  logoutButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    borderRadius: '10px',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease'
  },
  navBar: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem 2rem',
    backgroundColor: '#1a1f3a',
    borderBottom: '1px solid #333'
  },
  navLink: {
    padding: '0.75rem 1.5rem',
    color: '#888',
    textDecoration: 'none',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  activeNavLink: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    color: '#667eea'
  },
  navIcon: {
    fontSize: '1.2rem'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
    padding: '2rem'
  },
  card: {
    backgroundColor: '#1a1f3a',
    padding: '2rem',
    borderRadius: '20px',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    transition: 'all 0.3s ease',
    animation: 'fadeInUp 0.6s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
  },
  cardHeader: {
    marginBottom: '1.5rem',
    borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
    paddingBottom: '1rem'
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  profileContent: {
    textAlign: 'center'
  },
  tierBadge: {
    display: 'inline-block',
    padding: '0.75rem 2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '25px',
    marginBottom: '1rem'
  },
  tierLevel: {
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  info: {
    fontSize: '0.95rem',
    color: '#aaa',
    marginBottom: '1rem'
  },
  tierProgress: {
    marginTop: '1rem'
  },
  progressBar: {
    width: '100%',
    height: '10px',
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '10px',
    transition: 'width 0.5s ease'
  },
  balanceContent: {
    textAlign: 'center'
  },
  balance: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    margin: '1rem 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  usdValue: {
    fontSize: '1.3rem',
    color: '#888',
    marginBottom: '1.5rem'
  },
  infoBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: '10px'
  },
  infoIcon: {
    fontSize: '1.2rem'
  },
  infoText: {
    fontSize: '0.9rem',
    color: '#aaa'
  },
  quickActions: {
    display: 'flex',
    gap: '1rem'
  },
  actionButton: {
    flex: 1,
    padding: '1.5rem',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '15px',
    textDecoration: 'none',
    textAlign: 'center',
    transition: 'all 0.3s ease'
  },
  actionIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem'
  },
  actionText: {
    fontSize: '0.95rem',
    color: '#fff',
    fontWeight: '500'
  }
};

// Add CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .navLink:hover {
      background-color: rgba(102, 126, 234, 0.15);
      color: #667eea;
    }
    .logoutButton:hover {
      background-color: rgba(255,255,255,0.3);
      transform: translateY(-2px);
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    .actionButton:hover {
      background-color: rgba(102, 126, 234, 0.2);
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
  `;
  document.head.appendChild(style);
}

export default Dashboard;
