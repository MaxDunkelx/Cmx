import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CMXLogo from '../components/CMXLogo';
import LiquidParticles from '../components/LiquidParticles';
import ReviewsSlider from '../components/ReviewsSlider';
import { motion, AnimatePresence } from 'framer-motion';
import featureVideo from '../assets/background-vidio.mp4';

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

  const missionHighlights = [
    {
      icon: '🎯',
      iconSize: '2.2rem',
      title: 'Our Promise',
      body: (
        <>
          Earn CMX through tasks and ads, then multiply it playing{' '}
          <strong style={{ color: 'rgba(226, 232, 240, 0.95)', fontWeight: 800 }}>provably fair games</strong>. Everything is transparent, verifiable, and honest.
        </>
      )
    },
    {
      icon: '🤝',
      iconSize: '2.2rem',
      title: 'Growing Together',
      body: (
        <>
          We&apos;re building this <strong style={{ color: 'rgba(226, 232, 240, 0.95)', fontWeight: 800 }}>with you, not for you</strong>. Your feedback shapes our platform. We&apos;re here to learn, improve, and create something amazing together.
        </>
      )
    },
    {
      icon: '✅',
      iconSize: '1.9rem',
      title: 'Fair & Transparent',
      body: (
        <>
          No hidden fees, no tricks, no BS. <strong style={{ color: 'rgba(226, 232, 240, 0.95)', fontWeight: 800 }}>95% RTP on games</strong>, instant withdrawals, and complete transparency in every transaction. Live RTP tables, verifiable RNG hashes, and weekly profit-share reports show how every CMX token is allocated.
        </>
      )
    },
    {
      icon: '👥',
      iconSize: '2.2rem',
      title: 'From the Founders',
      body: (
        <>
          &quot;We&apos;re not a massive corporation or a crypto scheme. We&apos;re three guys who believe people deserve <strong style={{ color: 'rgba(226, 232, 240, 0.95)', fontWeight: 800 }}>fair compensation</strong> for their time and attention. Join us in building the future of online earning—one game, one task, one win at a time.&quot; 🚀
        </>
      )
    }
  ];

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
        maxWidth: '1180px',
        margin: '0 auto',
        padding: '3.5rem 1.75rem',
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
            fontSize: '3.25rem',
            fontWeight: '900',
            margin: '1rem 0 0.75rem',
            letterSpacing: '0.04em',
            background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.65) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            CMX Platform
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: 'rgba(255,255,255,0.88)',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            A refined earning hub that blends high-end gaming, automated rewards, and transparent treasury management in one streamlined experience.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
            marginTop: '2rem'
          }}>
            {[
              {
                title: 'Built for Pro Players',
                copy: 'Curated slot suites, real-time analytics, and provably fair outcomes designed for serious retention.'
              },
              {
                title: 'All-In Platform Model',
                copy: 'CMX credits, performance tiers, and profit-sharing rewards—without cash deposits or paywalls.'
              },
              {
                title: 'Operational Confidence',
                copy: 'Security-first infrastructure, audited math models, and clearly staged growth milestones.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  minWidth: '240px',
                  maxWidth: '320px',
                  padding: '1.25rem 1.5rem',
                  background: 'rgba(15, 23, 42, 0.55)',
                  border: '1px solid rgba(148, 163, 184, 0.28)',
                  borderRadius: '18px',
                  boxShadow: '0 18px 40px rgba(15, 23, 42, 0.35)',
                  textAlign: 'left'
                }}
              >
                <h3 style={{
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  color: 'rgba(226, 232, 240, 0.95)',
                  marginBottom: '0.5rem'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'rgba(226, 232, 240, 0.75)',
                  lineHeight: '1.5'
                }}>
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div
          style={{
            position: 'relative',
            borderRadius: '28px',
            overflow: 'hidden',
            marginBottom: '2.75rem',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            boxShadow: '0 32px 60px rgba(5, 10, 28, 0.55)'
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            src={featureVideo}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.38
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2.75rem',
              padding: '2.75rem'
            }}
          >
            {/* Left: Features */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: 'rgba(8, 15, 32, 0.65)',
                backdropFilter: 'blur(32px)',
                border: '1px solid rgba(148, 163, 184, 0.32)',
                borderRadius: '24px',
                padding: '2.5rem'
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
                background: 'rgba(8, 15, 32, 0.72)',
                backdropFilter: 'blur(32px)',
                border: '1px solid rgba(148, 163, 184, 0.32)',
                borderRadius: '24px',
                padding: '2.5rem',
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
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.4rem', letterSpacing: '0.02em' }}>
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
                    padding: '0.9rem 1.25rem',
                    background: 'rgba(15, 23, 42, 0.45)',
                    border: '1px solid rgba(148, 163, 184, 0.32)',
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.4rem', letterSpacing: '0.02em' }}>
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
                    padding: '0.9rem 1.25rem',
                    background: 'rgba(15, 23, 42, 0.45)',
                    border: '1px solid rgba(148, 163, 184, 0.32)',
                    borderRadius: '14px',
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
                  padding: '1.1rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  border: 'none',
                  borderRadius: '18px',
                  color: '#fff',
                  fontSize: '1.15rem',
                  fontWeight: '700',
                  letterSpacing: '0.03em',
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
                    padding: '0.9rem',
                    background: 'rgba(34, 197, 94, 0.16)',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    borderRadius: '14px',
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
                    padding: '0.9rem',
                    background: 'rgba(239, 68, 68, 0.16)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    borderRadius: '14px',
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
        </div>

        {/* Earn · Play · Win Story */}
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ marginBottom: '2.75rem' }}>
          <div style={{ position: 'relative', borderRadius: '28px', overflow: 'hidden', border: '1px solid rgba(148, 163, 184, 0.22)', boxShadow: '0 24px 60px rgba(2, 6, 23, 0.55)' }}>
            <video
              autoPlay
              loop
              muted
              playsInline
              src={featureVideo}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.38 }}
            />
            <div
              className="liquid-glass"
              style={{
                position: 'relative',
                zIndex: 1,
                padding: '3rem',
                textAlign: 'center',
                background: 'linear-gradient(180deg, rgba(10, 13, 22, 0.52), rgba(5, 10, 24, 0.82))',
                backdropFilter: 'blur(22px)'
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'rgba(17, 24, 39, 0.7)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '30px',
                  padding: '0.75rem 2rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                  color: 'rgba(226, 232, 240, 0.85)'
                }}
              >
                <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 0 6px rgba(148, 163, 184, 0.35))' }}>✨</span>
                <span style={{ color: 'rgba(226, 232, 240, 0.9)', textShadow: '0 0 10px rgba(148, 163, 184, 0.3)' }}>CMX Platform</span>
                <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 0 6px rgba(148, 163, 184, 0.35))' }}>✨</span>
              </div>

              <h2
                style={{
                  fontSize: '3rem',
                  fontWeight: 900,
                  marginBottom: '2rem',
                  letterSpacing: '-0.5px',
                  lineHeight: 1.2
                }}
              >
                <span style={{ color: 'rgba(226, 232, 240, 0.95)', textShadow: '0 0 14px rgba(148, 163, 184, 0.35)' }}>Earn.</span>{' '}
                <span style={{ color: 'rgba(165, 180, 252, 0.9)', textShadow: '0 0 14px rgba(129, 140, 248, 0.3)' }}>Play.</span>{' '}
                <span style={{ color: 'rgba(134, 239, 172, 0.85)', textShadow: '0 0 12px rgba(34, 197, 94, 0.25)' }}>Win.</span>
              </h2>

              <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
                <p style={{ fontSize: '1.15rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.8, marginBottom: '2rem', textAlign: 'center' }}>
                  We&apos;re{' '}
                  <strong style={{ color: 'rgba(226, 232, 240, 0.95)', fontWeight: 800 }}>three friends</strong> building a simple cycle: complete sponsored tasks,
                  videos, and surveys to earn CMX tokens, which are valued like real currency at{' '}
                  <strong style={{ color: 'rgba(226, 232, 240, 0.95)', fontWeight: 800 }}>10,000 CMX = $1 USD</strong>. Jump into the gaming hub to play and multiply
                  your balance, then cash out or route your earnings to a cause you believe in.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1.5rem', marginBottom: '2rem', alignItems: 'stretch' }}>
                  {missionHighlights.map(({ icon, iconSize, title, body }, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(11, 16, 26, 0.58)',
                        border: '1px solid rgba(71, 85, 105, 0.35)',
                        borderRadius: '16px',
                        padding: '1.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        transition: '0.3s',
                        minHeight: '240px',
                        justifyContent: 'space-between',
                        height: '100%',
                        alignItems: 'flex-start'
                      }}
                    >
                      <div style={{ fontSize: iconSize, textAlign: 'left', filter: 'drop-shadow(0 0 6px rgba(148, 163, 184, 0.25))' }}>{icon}</div>
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'rgba(226, 232, 240, 0.92)', marginBottom: '0.6rem', textAlign: 'left', letterSpacing: '0.25px' }}>
                          {title}
                        </div>
                        <div style={{ fontSize: '0.95rem', color: 'rgba(203, 213, 225, 0.72)', lineHeight: 1.7, textAlign: 'left' }}>{body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            borderRadius: '22px',
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

