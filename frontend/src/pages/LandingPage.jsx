import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LandingPage() {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.animatedBg}></div>
      <div style={styles.content}>
        <div style={styles.logo}>🎮</div>
        <h1 style={styles.title}>Welcome to CMX</h1>
        <p style={styles.subtitle}>
          Experience the future of earning and gaming. Play provably fair casino games and earn cryptocurrency.
        </p>
        
        {user ? (
          <Link to="/dashboard" style={styles.buttonPrimary}>
            <span style={styles.buttonIcon}>🚀</span>
            Go to Dashboard
          </Link>
        ) : (
          <div style={styles.buttonGroup}>
            <Link to="/home" style={styles.buttonPrimary}>
              <span style={styles.buttonIcon}>🔐</span>
              Login
            </Link>
            <Link to="/register" style={styles.buttonSecondary}>
              <span style={styles.buttonIcon}>✨</span>
              Get Started
            </Link>
          </div>
        )}

        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🎰</div>
            <h3 style={styles.featureTitle}>Casino Games</h3>
            <p style={styles.featureDesc}>Slots, Roulette, Blackjack & Poker</p>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🔒</div>
            <h3 style={styles.featureTitle}>Provably Fair</h3>
            <p style={styles.featureDesc}>Cryptographically secure gaming</p>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>💰</div>
            <h3 style={styles.featureTitle}>Earn & Play</h3>
            <p style={styles.featureDesc}>Complete tasks to earn CMX</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: '2rem',
    overflow: 'hidden'
  },
  animatedBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradientMove 20s ease infinite',
    zIndex: 0
  },
  content: {
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
    maxWidth: '900px',
    animation: 'fadeInUp 1s ease'
  },
  logo: {
    fontSize: '6rem',
    marginBottom: '2rem',
    animation: 'bounce 3s infinite',
    display: 'inline-block'
  },
  title: {
    fontSize: '4.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#fff',
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
    background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '1.5rem',
    marginBottom: '3rem',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: '1.6'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    marginBottom: '5rem'
  },
  buttonPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1.2rem 3rem',
    background: 'rgba(255, 255, 255, 0.95)',
    color: '#667eea',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.2rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
  },
  buttonSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1.2rem 3rem',
    background: 'transparent',
    color: '#fff',
    border: '3px solid rgba(255,255,255,0.9)',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.2rem',
    transition: 'all 0.3s ease'
  },
  buttonIcon: {
    fontSize: '1.5rem'
  },
  features: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  feature: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
    minWidth: '250px',
    transition: 'all 0.3s ease'
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  featureTitle: {
    fontSize: '1.3rem',
    marginBottom: '0.5rem',
    color: '#fff'
  },
  featureDesc: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.8)'
  }
};

// Add CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes gradientMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
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
    button:hover, a:hover {
      transform: translateY(-3px);
    }
    .feature:hover {
      transform: translateY(-10px);
      background: rgba(255, 255, 255, 0.15) !important;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
  `;
  document.head.appendChild(style);
}

export default LandingPage;
