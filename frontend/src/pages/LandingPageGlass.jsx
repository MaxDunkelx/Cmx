import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CMXLogo from '../components/CMXLogo';
import LiquidParticles from '../components/LiquidParticles';

function LandingPage() {
  const { user } = useAuth();
  
  // Add routes link for development
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  return (
    <div style={styles.container}>
      <LiquidParticles count={30} />
      {/* Floating Blobs */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>
      <div style={styles.blob3}></div>
      <div style={styles.blob4}></div>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.logoSection}>
          <CMXLogo size="120px" animated={true} />
          <p style={styles.subtitle}>
            Experience the future of earning and gaming. Play provably fair casino games and earn cryptocurrency.
          </p>
        </div>
        
        {user ? (
          <Link to="/dashboard" className="liquid-glass-button" style={styles.buttonPrimary}>
            <span style={styles.buttonIcon}>🚀</span>
            Go to Dashboard
          </Link>
        ) : (
          <div style={styles.buttonGroup}>
            <Link to="/home" className="liquid-glass-button" style={styles.buttonPrimary}>
              <span style={styles.buttonIcon}>🔐</span>
              Login
            </Link>
            <Link to="/register" className="liquid-glass-button" style={styles.buttonSecondary}>
              <span style={styles.buttonIcon}>✨</span>
              Get Started
            </Link>
          </div>
        )}

        <div style={styles.features}>
          <div className="glass-card" style={styles.feature}>
            <div style={styles.featureIcon}>🎰</div>
            <h3 style={styles.featureTitle}>Casino Games</h3>
            <p style={styles.featureDesc}>Slots, Roulette, Blackjack & Poker</p>
          </div>
          <div className="glass-card" style={styles.feature}>
            <div style={styles.featureIcon}>🔒</div>
            <h3 style={styles.featureTitle}>Provably Fair</h3>
            <p style={styles.featureDesc}>Cryptographically secure gaming</p>
          </div>
          <div className="glass-card" style={styles.feature}>
            <div style={styles.featureIcon}>💰</div>
            <h3 style={styles.featureTitle}>Earn & Play</h3>
            <p style={styles.featureDesc}>Complete tasks to earn CMX</p>
          </div>
        </div>
        
        {isDev && (
          <Link to="/routes" className="liquid-glass-button" style={styles.devLink}>
            🗺️ View Routes Map
          </Link>
        )}
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
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%)'
  },
  
  // Floating Blobs
  blob1: {
    position: 'absolute',
    top: '-15%',
    right: '-10%',
    width: '800px',
    height: '800px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%)',
    filter: 'blur(120px)',
    animation: 'float 10s ease-in-out infinite'
  },
  blob2: {
    position: 'absolute',
    bottom: '-15%',
    left: '-10%',
    width: '700px',
    height: '700px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(118, 75, 162, 0.4) 0%, transparent 70%)',
    filter: 'blur(120px)',
    animation: 'float 12s ease-in-out infinite reverse'
  },
  blob3: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.25) 0%, transparent 70%)',
    filter: 'blur(100px)',
    animation: 'float 14s ease-in-out infinite'
  },
  blob4: {
    position: 'absolute',
    bottom: '20%',
    right: '30%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(118, 75, 162, 0.25) 0%, transparent 70%)',
    filter: 'blur(80px)',
    animation: 'float 16s ease-in-out infinite reverse'
  },
  
  content: {
    textAlign: 'center',
    position: 'relative',
    zIndex: 10,
    maxWidth: '1000px',
    animation: 'fadeInUp 1s ease'
  },
  
  logoSection: {
    marginBottom: '4rem'
  },
  
  logoEspesyeEmoji: {
    fontSize: '7rem',
    marginBottom: '2rem',
    animation: 'float 4s ease-in-out infinite',
    display: 'inline-block'
  },
  
  title: {
    fontSize: '5rem',
    fontWeight: '800',
    marginBottom: '1.5rem',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 4px 30px rgba(0,0,0,0.3)'
  },
  
  subtitle: {
    fontSize: '1.5rem',
    lineHeight: '1.8',
    color: 'rgba(255,255,255,0.8)',
    maxWidth: '700px',
    margin: '0 auto'
  },
  
  buttonGroup: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    marginBottom: '6rem'
  },
  
  buttonPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1.5rem 4rem',
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1.3rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden'
  },
  
  buttonSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1.5rem 4rem',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '2px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '20px',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1.3rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  buttonIcon: {
    fontSize: '1.8rem'
  },
  
  features: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '4rem'
  },
  
  feature: {
    flex: '1 1 280px',
    padding: '3rem',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '28px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    minWidth: '280px'
  },
  
  featureIcon: {
    fontSize: '4rem',
    marginBottom: '1.5rem',
    animation: 'float 3s ease-in-out infinite'
  },
  
  featureTitle: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    fontWeight: '700',
    color: '#fff'
  },
  
  featureDesc: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: '1.6'
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
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .liquid-glass-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
      transition: left 0.8s;
    }
    .liquid-glass-button:hover::before {
      left: 100%;
    }
    .liquid-glass-button:hover {
      background: rgba(255, 255, 255, 0.12) !important;
      border-color: rgba(255, 255, 255, 0.3) !important;
      transform: translateY(-5px);
      box-shadow: 0 16px 56px rgba(0, 0, 0, 0.3) !important;
    }
    .glass-card:hover {
      transform: translateY(-15px);
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25) !important;
    }
  `;
  document.head.appendChild(style);
}

export default LandingPage;

