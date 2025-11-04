import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CMXLogo from '../components/CMXLogo';
import LiquidParticles from '../components/LiquidParticles';
import ReviewsSlider from '../components/ReviewsSlider';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { user, login, setUser } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
      @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
      @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(90, 200, 250, 0.3); } 50% { box-shadow: 0 0 40px rgba(90, 200, 250, 0.6); } }
      
      .glass-button { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      .glass-button:hover { 
        transform: translateY(-4px) scale(1.02); 
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4); 
      }
      
      .glass-card:hover { border-color: rgba(255, 255, 255, 0.3); }
      
      .feature-card { 
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        overflow: hidden;
      }
      
      .feature-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transition: left 0.5s;
      }
      
      .feature-card:hover::before {
        left: 100%;
      }
      
      .feature-card:hover {
        transform: translateY(-8px) scale(1.02);
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.4);
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
      }
      
      .feature-card:hover .feature-icon {
        transform: scale(1.2) rotate(10deg);
      }
      
      input:focus { 
        border-color: rgba(102, 126, 234, 0.5) !important; 
        box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1) !important;
        transform: scale(1.02);
      }
      
      @keyframes slide-up { 
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .slide-up { animation: slide-up 0.5s ease-out; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        const targetRoute = result.user?.isAdmin ? '/admin' : '/dashboard';
        navigate(targetRoute);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = (role) => {
    console.log('🔵 handleTestLogin called with role:', role);
    const credentials = role === 'user'
      ? { email: 'player@cmx.com', password: 'password123' }
      : { email: 'admin@cmx.com', password: 'admin123' };
    
    console.log('🔵 Credentials:', credentials);
    
    // Fill in the login form with test credentials - user must click Login button
    setEmail(credentials.email);
    setPassword(credentials.password);
    setError('');
  };

  if (user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <CMXLogo size="120px" animated={true} />
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginTop: '2rem' }}>Welcome back, {user.username}!</h1>
        <Link to={user.isAdmin ? '/admin' : '/dashboard'} className="glass-button" style={{
          padding: '1rem 3rem',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(40px)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          color: '#fff',
          fontSize: '1.2rem',
          fontWeight: '700',
          textDecoration: 'none',
          marginTop: '2rem'
        }}>
          Go to {user.isAdmin ? 'Admin Panel' : 'Dashboard'} →
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1C1C1E 50%, #000000 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <LiquidParticles count={30} />
      
      {/* Floating blobs */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 10s ease-in-out infinite reverse'
      }} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '4rem 2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <CMXLogo size="130px" animated={true} />
          <h1 style={{
            fontSize: '4rem',
            fontWeight: '900',
            margin: '1rem 0',
            background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            CMX Platform
          </h1>
          <p style={{
            fontSize: '1.5rem',
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            The Revolutionary Way to Earn & Play. Win crypto playing provably fair casino games.
          </p>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '800px',
            margin: '1.5rem auto 0',
            lineHeight: '1.6',
            padding: '1.5rem',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '16px'
          }}>
            <strong style={{ color: '#86efac' }}>✨ No Payments Required ✨</strong><br />
            We will never ask for your money, credit card, or personal payment information. Our mission is to share profits with you through our tier-based reward system. The more the platform grows, the more we can distribute to our community. Earn based on your tier through gaming, skill challenges, and luck-based games. Your success is our success - let's build this together.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Left: Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(40px)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '30px',
              padding: '3rem'
            }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem' }}>
              Why Choose CMX?
            </h2>
            
            {[
              { icon: '🎰', title: '6 Amazing Slot Games', desc: 'Pirate Treasure, Bank Heist, Space Adventure & more!' },
              { icon: '🔒', title: 'Provably Fair', desc: 'Cryptographically secure gaming with total transparency' },
              { icon: '💰', title: 'Profit Sharing', desc: 'Earn a percentage of platform profits based on tier' },
              { icon: '📈', title: 'Multiple Earning Ways', desc: 'Surveys, ads, tasks, and gaming all pay CMX' },
              { icon: '🏆', title: 'Tier System', desc: '5 tiers with increasing benefits and rewards' },
              { icon: '⚡', title: 'Instant Withdrawals', desc: 'Fast crypto payouts when you win' },
              { icon: '🎯', title: 'Proven Technology', desc: 'Built on secure blockchain with smart contracts' },
              { icon: '🌍', title: 'Global Community', desc: 'Join players worldwide in the future of earning' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="glass-card feature-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  marginBottom: '1rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
              >
                <div className="feature-icon" style={{ fontSize: '2.5rem', transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>{feature.icon}</div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>{feature.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right: Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card login-container"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(40px)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '30px',
              padding: '3rem',
              position: 'relative',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Mini Logo in Top Right */}
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
              <CMXLogo size="40px" animated={false} />
            </div>
            
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem', textAlign: 'center' }}>
              Get Started
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>

              {error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  color: '#fca5a5'
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="glass-button"
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  border: 'none',
                  borderRadius: '20px',
                  color: '#fff',
                  fontSize: '1.2rem',
                  fontWeight: '800',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  marginBottom: '1rem'
                }}
              >
                {loading ? 'Logging in...' : '🚀 Login'}
              </button>

              {/* Test Login Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <button
                  type="button"
                  onClick={() => handleTestLogin('user')}
                  disabled={loading}
                  className="glass-button"
                  style={{
                    padding: '1rem',
                    background: 'rgba(34, 197, 94, 0.2)',
                    border: '2px solid rgba(34, 197, 94, 0.4)',
                    borderRadius: '16px',
                    color: '#86efac',
                    fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                  title="Click to fill user credentials in the form above"
                >
                  🎮 Test User
                </button>
                <button
                  type="button"
                  onClick={() => handleTestLogin('admin')}
                  disabled={loading}
                  className="glass-button"
                  style={{
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '2px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '16px',
                    color: '#fca5a5',
                    fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                  title="Click to fill admin credentials in the form above"
                >
                  🛡️ Test Admin
                </button>
              </div>

              <Link to="/register" style={{
                display: 'block',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                Don't have an account? <span style={{ textDecoration: 'underline' }}>Sign up →</span>
              </Link>
            </form>

            {/* Reviews Slider */}
            <div style={{ marginTop: '3rem' }}>
              <ReviewsSlider />
            </div>
          </motion.div>
        </div>

        {/* Bottom Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '2rem',
            textAlign: 'center'
          }}
        >
          <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem' }}>
            Start Earning Today
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
            Join thousands already earning CMX through gaming, surveys, and more
          </p>
          <Link to="/register" className="glass-button" style={{
            display: 'inline-block',
            padding: '1rem 3rem',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            color: '#fff',
            fontSize: '1.2rem',
            fontWeight: '700',
            textDecoration: 'none'
          }}>
            Create Account →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

