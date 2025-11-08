import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import CMXLogo from '../components/CMXLogo';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('earn');
  const auth = useAuth();
  const login = auth?.login || (async () => ({ success: false, message: 'Auth not available' }));
  const setUser = auth?.setUser || (() => {});

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes logoGlow {
        0%, 100% {
          filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.4))
                  drop-shadow(0 0 60px rgba(255, 215, 0, 0.2))
                  drop-shadow(0 0 90px rgba(118, 75, 162, 0.15));
          transform: scale(1);
        }
        50% {
          filter: drop-shadow(0 0 40px rgba(255, 215, 0, 0.6))
                  drop-shadow(0 0 80px rgba(255, 215, 0, 0.4))
                  drop-shadow(0 0 120px rgba(118, 75, 162, 0.25));
          transform: scale(1.02);
        }
      }
      @keyframes logoFloat {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
      }
      @keyframes logoPulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.95;
        }
      }
      @keyframes glassGlow {
        0%, 100% {
          box-shadow: 
            0 0 20px rgba(255, 255, 255, 0.05),
            0 0 40px rgba(118, 75, 162, 0.1),
            inset 0 0 20px rgba(255, 255, 255, 0.02);
        }
        50% {
          box-shadow: 
            0 0 30px rgba(255, 255, 255, 0.08),
            0 0 60px rgba(118, 75, 162, 0.15),
            inset 0 0 30px rgba(255, 255, 255, 0.04);
        }
      }
      .logo-container {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 2rem;
      }
      .logo-wrapper {
        position: relative;
        animation: logoFloat 4s ease-in-out infinite;
        z-index: 20;
      }
      .logo-wrapper::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          rgba(255, 215, 0, 0.3) 0%,
          rgba(255, 215, 0, 0.2) 30%,
          rgba(118, 75, 162, 0.15) 60%,
          transparent 80%
        );
        filter: blur(20px);
        z-index: -1;
        pointer-events: none !important;
      }
      .logo-wrapper::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 110%;
        height: 110%;
        border-radius: 50%;
        border: 2px solid rgba(255, 215, 0, 0.2);
        z-index: -1;
        pointer-events: none !important;
        filter: blur(2px);
      }
      .logo-wrapper img,
      .logo-wrapper .cmx-logo-container {
        border-radius: 50% !important;
        clip-path: circle(50%) !important;
        -webkit-clip-path: circle(50%) !important;
        overflow: hidden !important;
        pointer-events: none !important;
      }
      .logo-wrapper {
        pointer-events: none !important;
      }
      .logo-container {
        pointer-events: none !important;
      }
      @keyframes arrowPulse {
        0%, 100% {
          opacity: 1;
          transform: translateX(0);
        }
        50% {
          opacity: 0.7;
          transform: translateX(5px);
        }
      }
      .flow-arrow {
        stroke: #FFD700;
        fill: #FFD700;
        stroke-width: 4;
        stroke-linecap: round;
        stroke-linejoin: round;
        animation: arrowGlow 2s ease-in-out infinite;
      }
      @keyframes arrowGlow {
        0%, 100% {
          filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))
                  drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))
                  drop-shadow(0 0 45px rgba(255, 215, 0, 0.3));
        }
        50% {
          filter: drop-shadow(0 0 20px rgba(255, 215, 0, 1))
                  drop-shadow(0 0 40px rgba(255, 215, 0, 0.7))
                  drop-shadow(0 0 60px rgba(255, 215, 0, 0.5));
        }
      }
      .flow-text-container {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(30px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 1.5rem;
        transition: all 0.3s ease;
      }
      .flow-text-container:hover {
        border-color: rgba(255, 215, 0, 0.3);
        background: rgba(255, 255, 255, 0.05);
      }
      .spinner {
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255, 255, 255, 0.2);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      .liquid-glass {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(50px) saturate(180%);
        -webkit-backdrop-filter: blur(50px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 20px;
        padding: 2.5rem;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 
          0 8px 32px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        pointer-events: auto;
      }
      .liquid-glass::before {
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
        pointer-events: none !important;
        z-index: 0;
      }
      .liquid-glass::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
          circle,
          rgba(118, 75, 162, 0.1) 0%,
          transparent 70%
        );
        opacity: 0;
        transition: opacity 0.4s ease;
        pointer-events: none !important;
        z-index: 0;
      }
      .liquid-glass:hover::before {
        left: 100%;
      }
      .liquid-glass:hover::after {
        opacity: 1;
      }
      .liquid-glass:hover {
        border-color: rgba(255, 255, 255, 0.25);
        transform: translateY(-2px);
        box-shadow: 
          0 12px 40px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.15),
          0 0 60px rgba(118, 75, 162, 0.2);
      }
      .text-glow {
        text-shadow: 0 0 20px rgba(255, 215, 0, 0.5),
                     0 0 40px rgba(255, 215, 0, 0.3),
                     0 0 60px rgba(255, 215, 0, 0.2);
      }
      .text-glow-purple {
        text-shadow: 0 0 20px rgba(118, 75, 162, 0.5),
                     0 0 40px rgba(118, 75, 162, 0.3);
      }
      .text-glow-blue {
        text-shadow: 0 0 20px rgba(102, 126, 234, 0.5),
                     0 0 40px rgba(102, 126, 234, 0.3);
      }
      input:focus {
        border-color: rgba(255, 255, 255, 0.4) !important;
        box-shadow: 
          0 0 0 3px rgba(255, 255, 255, 0.1),
          0 0 30px rgba(102, 126, 234, 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
        background: rgba(255, 255, 255, 0.08) !important;
      }
      .stat-card:hover,
      .org-card:hover,
      .benefit-item:hover {
        transform: translateY(-4px);
        border-color: rgba(255, 255, 255, 0.25);
        box-shadow: 
          0 12px 40px rgba(118, 75, 162, 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.15);
      }
      .tab-button.active {
        background: rgba(255, 255, 255, 0.1) !important;
        border-color: rgba(255, 255, 255, 0.3) !important;
        color: #ffffff !important;
      }
      .icon-svg {
        width: 24px;
        height: 24px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const result = await login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        setSuccess('Welcome back!');
        // Redirect based on role
        const targetRoute = result.user.isAdmin ? '/admin' : '/dashboard';
        setTimeout(() => navigate(targetRoute), 1000);
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (error) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async (role) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
    const credentials = role === 'user'
      ? { email: 'player@cmx.com', password: 'password123' }
      : { email: 'admin@cmx.com', password: 'admin123' };
    
      const result = await login(credentials.email, credentials.password);
      
      if (result.success && result.user) {
        // Ensure user state is set
        setUser(result.user);
        setSuccess(`Welcome ${result.user.username || 'back'}!`);
        
        // Redirect based on actual user role from API response
        const targetRoute = result.user.isAdmin ? '/admin' : '/dashboard';
        setTimeout(() => navigate(targetRoute), 800);
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      setError('Connection failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Professional SVG Icons
  const IconVideo = () => (
    <svg className="icon-svg" viewBox="0 0 24 24">
      <polygon points="23 7 16 12 23 17 23 7"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
  );

  const IconSurvey = () => (
    <svg className="icon-svg" viewBox="0 0 24 24">
      <line x1="12" y1="2" x2="12" y2="22"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );

  const IconGift = () => (
    <svg className="icon-svg" viewBox="0 0 24 24">
      <polyline points="20 12 20 22 4 22 4 12"></polyline>
      <rect x="2" y="7" width="20" height="5"></rect>
      <line x1="12" y1="22" x2="12" y2="7"></line>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </svg>
  );

  const IconStar = () => (
    <svg className="icon-svg" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );

  const IconDollar = () => (
    <svg className="icon-svg" viewBox="0 0 24 24">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );

  const IconLock = () => (
    <svg className="icon-svg" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

  const IconZap = () => (
    <svg className="icon-svg" viewBox="0 0 24 24">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
  );

  const IconChart = () => (
    <svg className="icon-svg" viewBox="0 0 24 24">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  );

  const IconGamepad = () => (
    <svg className="icon-svg" viewBox="0 0 24 24">
      <line x1="6" y1="12" x2="10" y2="12"></line>
      <line x1="8" y1="10" x2="8" y2="14"></line>
      <line x1="15" y1="13" x2="15.01" y2="13"></line>
      <line x1="18" y1="11" x2="18.01" y2="11"></line>
      <rect x="2" y="6" width="20" height="12" rx="2"></rect>
    </svg>
  );

  const IconHeart = () => (
    <svg className="icon-svg" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );

  const IconMail = () => (
    <svg className="icon-svg" viewBox="0 0 24 24">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );

  const IconKey = () => (
    <svg className="icon-svg" viewBox="0 0 24 24">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
    </svg>
  );

  const earningStats = [
    { label: 'Video Ad', value: '$0.35', desc: 'per 30-second ad', Icon: IconVideo },
    { label: 'Survey', value: '$1.75', desc: 'per completed survey', Icon: IconSurvey },
    { label: 'Offer Completion', value: '$4.50', desc: 'per completed offer', Icon: IconGift },
    { label: 'Loyalty Bonus', value: 'Up to 50%', desc: 'extra from tier level', Icon: IconStar }
  ];

  const donationOrgs = [
    { 
      name: 'Ocean Conservancy', 
      icon: '🌊',
      image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=400&h=300&fit=crop',
      desc: 'Protecting marine life and ocean ecosystems'
    },
    { 
      name: 'The Nature Conservancy', 
      icon: '🌳',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      desc: 'Planting trees and restoring forests'
    },
    { 
      name: 'Save the Children', 
      icon: '👶',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
      desc: 'Supporting children\'s education and health'
    },
    { 
      name: 'Water.org', 
      icon: '💧',
      image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop',
      desc: 'Providing clean water access worldwide'
    },
    { 
      name: 'Wildlife Conservation Society', 
      icon: '🦁',
      image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop',
      desc: 'Protecting endangered wildlife species'
    },
    { 
      name: 'UNICEF', 
      icon: '🌍',
      image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&h=300&fit=crop',
      desc: 'Emergency relief and child protection'
    }
  ];

  const benefits = [
    { Icon: IconDollar, title: 'Real Earnings', desc: 'Withdraw actual money, not points' },
    { Icon: IconLock, title: 'Secure Platform', desc: 'Bank-level encryption & security' },
    { Icon: IconZap, title: 'Instant Payouts', desc: 'Fast withdrawal processing' },
    { Icon: IconChart, title: 'Track Everything', desc: 'Real-time analytics & stats' },
    { Icon: IconGamepad, title: 'Fun Games', desc: 'Provably fair casino games' },
    { Icon: IconHeart, title: 'Give Back', desc: 'Donate to causes you care about' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>

      <div style={styles.content}>
        {/* Single Column - All Content */}
        <motion.div
          style={styles.mainSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Centered Logo with Flow Diagram */}
          <div className="logo-container" style={styles.logoFlowContainer}>
            {/* Left Side - Watch Videos, Complete Offers, Do Surveys */}
            <div style={styles.flowLeft}>
              <div className="flow-text-container" style={styles.flowTextCard}>
                <div style={styles.flowIcon}>📺</div>
                <div style={styles.flowText}>
                  <div style={styles.flowTitle}>Watch Videos</div>
                  <div style={styles.flowSubtitle}>Complete Offers</div>
                  <div style={styles.flowSubtitle}>Do Surveys</div>
                </div>
              </div>
              {/* Arrow pointing to logo */}
              <div style={styles.arrowContainer}>
                <svg style={styles.flowArrowSvg} viewBox="0 0 120 50" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#FFD700" stopOpacity="1" />
                      <stop offset="100%" stopColor="#FFD700" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  <path className="flow-arrow" d="M 10 20 L 85 20 M 80 12 L 85 20 L 80 28" 
                        stroke="url(#arrowGradient)" 
                        strokeWidth="4"
                        fill="url(#arrowGradient)"/>
                </svg>
              </div>
          </div>

            {/* Center Logo */}
            <div className="logo-wrapper" style={styles.logoWrapper}>
              <CMXLogo size="210px" animated={false} />
            </div>

            {/* Right Side - Play, Try to Win, Withdraw or Contribute */}
            <div style={styles.flowRight}>
              {/* Arrow pointing from logo */}
              <div style={styles.arrowContainer}>
                <svg style={styles.flowArrowSvg} viewBox="0 0 120 50" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="arrowGradientRight" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#FFD700" stopOpacity="1" />
                      <stop offset="100%" stopColor="#FFD700" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  <path className="flow-arrow" d="M 15 20 L 90 20 M 85 12 L 90 20 L 85 28" 
                        stroke="url(#arrowGradientRight)" 
                        strokeWidth="4"
                        fill="url(#arrowGradientRight)"/>
                </svg>
              </div>
              <div className="flow-text-container" style={styles.flowTextCard}>
                <div style={styles.flowIcon}>🎮</div>
                <div style={styles.flowText}>
                  <div style={styles.flowTitle}>Play & Try to Win</div>
                  <div style={styles.flowSubtitle}>Withdraw or</div>
                  <div style={styles.flowSubtitle}>Contribute to Community</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Heading in Liquid Glass */}
          <div className="liquid-glass" style={styles.titleContainer}>
            <h1 className="text-glow" style={styles.mainTitle}>
              Earn Real Money While Having Fun
            </h1>
            <p style={styles.subtitle}>
              Complete offers. Watch ads. Play games. Make real profit. All while supporting causes you care about.
            </p>
          </div>

          <div style={styles.zigzagLayout}>
            {/* Left Side - Content Sections */}
            <div style={styles.leftSide}>
              {/* Key Benefits */}
              <div className="liquid-glass" style={styles.benefitsCard}>
                <h3 style={styles.benefitsTitle}>Why Choose CMX?</h3>
                <div style={styles.benefitsGrid}>
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="benefit-item liquid-glass" style={styles.benefitItem}>
                      <div style={styles.benefitIcon}>
                        <benefit.Icon />
                      </div>
                      <div>
                        <div style={styles.benefitTitle}>{benefit.title}</div>
                        <div style={styles.benefitDesc}>{benefit.desc}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

              {/* Tabs */}
              <div style={styles.tabs}>
                <button
                  className={`tab-button ${activeTab === 'earn' ? 'active' : ''}`}
                  style={styles.tab}
                  onClick={() => setActiveTab('earn')}
                >
                  Earn Money
                </button>
                <button
                  className={`tab-button ${activeTab === 'play' ? 'active' : ''}`}
                  style={styles.tab}
                  onClick={() => setActiveTab('play')}
                >
                  Play & Win
                </button>
                <button
                  className={`tab-button ${activeTab === 'give' ? 'active' : ''}`}
                  style={styles.tab}
                  onClick={() => setActiveTab('give')}
                >
                  Give Back
                </button>
              </div>

              {/* Tab Content */}
              <motion.div
                style={styles.tabContent}
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'earn' && (
                  <>
                    {/* Mission Section */}
                    <div className="liquid-glass" style={styles.contentCard}>
                      <h3 className="text-glow" style={styles.missionTitle}>Our Mission</h3>
                      <p style={styles.missionText}>
                        At CMX, we're revolutionizing how people earn and give back. Our mission is to create a platform where every commercial you watch, every offer you complete, and every game you play generates real value—both for you and for the world. We believe in transparency, fairness, and community impact. Unlike traditional platforms that keep all the revenue, we split earnings with you based on your loyalty, ensuring that your time and engagement are genuinely valued. Simultaneously, we've built a system that empowers you to make a meaningful difference by donating your earnings to organizations tackling the world's most pressing challenges. CMX isn't just about earning money—it's about creating a sustainable economy where entertainment, profit, and purpose converge.
                      </p>
                    </div>

                    <div className="liquid-glass" style={styles.contentCard}>
                      <h3 style={styles.sectionTitle}>Earn From Every Action</h3>
                      <p style={styles.description}>
                        Unlike other platforms that keep all the revenue, <strong style={{color: '#FFD700', fontWeight: '700'}}>CMX splits earnings with you</strong> based on your loyalty score. The more active you are, the bigger your share.
                      </p>
                      
                      <div style={styles.statsGrid}>
                        {earningStats.map((stat, idx) => {
                          const IconComponent = stat.Icon;
                          return (
                            <div key={idx} className="stat-card liquid-glass" style={styles.statCard}>
                              <div style={styles.statIcon}>
                                <IconComponent />
                              </div>
                              <div className="text-glow" style={styles.statValue}>{stat.value}</div>
                              <div style={styles.statLabel}>{stat.label}</div>
                              <div style={styles.statDesc}>{stat.desc}</div>
                            </div>
                          );
                        })}
              </div>
            </div>

                    <div className="liquid-glass" style={styles.infoBox}>
                      <h4 className="text-glow" style={styles.infoTitle}>CMX Currency Conversion</h4>
                      <div style={styles.infoContent}>
                        <div style={styles.infoItem}>
                          <strong style={{color: '#FFD700', fontSize: '1.1rem'}}>1,000 CMX = $0.01 (1 cent)</strong>
                        </div>
                        <div style={styles.infoItem}>
                          <strong style={{color: '#FFD700', fontSize: '1.1rem'}}>1,000,000 CMX = $100.00 USD</strong>
                        </div>
                        <div style={styles.infoItem}>
                          Simple conversion: 1 million CMX equals 1 dollar
                        </div>
                      </div>
                    </div>

                    <div className="liquid-glass" style={styles.infoBox}>
                      <h4 className="text-glow-purple" style={styles.infoTitle}>Loyalty Score = Bigger Earnings</h4>
                      <div style={styles.infoContent}>
                        <div style={styles.infoItem}>Tier 1: 20% of ad revenue split</div>
                        <div style={styles.infoItem}>Tier 2: 30% revenue split</div>
                        <div style={styles.infoItem}>Tier 3: 40% revenue split</div>
                        <div style={styles.infoItem}>Tier 4: 45% revenue split</div>
                        <div style={styles.infoItem}>Tier 5: <strong style={{color: '#FFD700'}}>50% revenue split</strong></div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'play' && (
                  <>
                    <div className="liquid-glass" style={styles.contentCard}>
                      <h3 style={styles.sectionTitle}>Fair Games = Real Profit</h3>
                      <p style={styles.description}>
                        Play provably fair casino games where <strong style={{color: '#FFD700', fontWeight: '700'}}>the odds are actually in your favor</strong>. Unlike other platforms, we use transparent, verifiable odds so you can actually win and profit.
                      </p>
                      
                      <div style={styles.gamesList}>
                        <div className="liquid-glass" style={styles.gameItem}>
                          <div>
                            <strong style={styles.gameName}>Slots</strong>
                            <div style={styles.gameOdds}>RTP: 95-98% (industry standard: 85-92%)</div>
                          </div>
                        </div>
                        <div className="liquid-glass" style={styles.gameItem}>
                          <div>
                            <strong style={styles.gameName}>Roulette</strong>
                            <div style={styles.gameOdds}>Fair odds with provably fair verification</div>
                          </div>
                        </div>
                        <div className="liquid-glass" style={styles.gameItem}>
                          <div>
                            <strong style={styles.gameName}>Blackjack & Poker</strong>
                            <div style={styles.gameOdds}>Skill-based games where strategy matters</div>
                          </div>
                        </div>
              </div>
            </div>

                    <div className="liquid-glass" style={styles.infoBox}>
                      <h4 className="text-glow-blue" style={styles.infoTitle}>Real Profits, Real Results</h4>
                      <div style={styles.infoContent}>
                        <div style={styles.infoItem}>
                          Average players earn <strong style={{color: '#FFD700'}}>$18 to $52 per week</strong> combining offers, ads, and games.
                        </div>
                        <div style={styles.infoItem}>
                          Top tier members earn <strong style={{color: '#FFD700'}}>$125 to $340+ weekly</strong>.
                        </div>
                        <div style={styles.infoItem}>
                          Active players typically withdraw <strong style={{color: '#FFD700'}}>$75 to $200 monthly</strong>.
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'give' && (
                  <>
                    <div className="liquid-glass" style={styles.contentCard}>
                      <h3 style={styles.sectionTitle}>Make a Difference While You Play</h3>
                      <p style={styles.description}>
                        <strong style={{color: '#FFD700', fontWeight: '700'}}>Donate your earnings to organizations you care about.</strong> Play for fun, make money, and change the world—all at the same time.
                </p>
              </div>
                    
                    <div style={styles.orgsGrid}>
                      {donationOrgs.map((org, idx) => (
                        <motion.div
                          key={idx}
                          className="org-card liquid-glass"
                          style={styles.orgCard}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <div style={styles.orgImageContainer}>
                            <img 
                              src={org.image} 
                              alt={org.name}
                              style={styles.orgImage}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <div style={styles.orgIconOverlay}>
                              <div style={styles.orgIcon}>{org.icon}</div>
            </div>
                          </div>
                          <div style={styles.orgName}>{org.name}</div>
                          <div style={styles.orgDesc}>{org.desc}</div>
                        </motion.div>
                      ))}
          </div>

                    <div className="liquid-glass" style={styles.infoBox}>
                      <h4 className="text-glow-purple" style={styles.infoTitle}>Community Impact</h4>
                      <div style={styles.infoContent}>
                        <div style={styles.infoItem}>
                          Over <strong style={{color: '#FFD700'}}>$67,500 donated</strong> by players this month to various causes.
        </div>
                        <div style={styles.infoItem}>
                          You can allocate any percentage of your earnings—even 100% if you want to play purely for impact.
                        </div>
                        <div style={styles.infoItem}>
                          Total community donations this year: <strong style={{color: '#FFD700'}}>$842,000+</strong>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>

            </div>

            {/* Right Side - Login Form + Video */}
            <div style={styles.rightSide}>
              {/* Video Promo Container */}
              <div className="liquid-glass" style={styles.videoContainer}>
                <div style={styles.videoPlaceholder}>
                  <div style={styles.videoIconContainer}>
                    <svg style={styles.videoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                  <h3 style={styles.videoTitle}>Watch Our Story</h3>
                  <p style={styles.videoDesc}>Promo video coming soon</p>
                </div>
              </div>

              <div className="liquid-glass" style={styles.formCard}>
                <h2 className="text-glow" style={styles.formTitle}>Start Earning Today</h2>
                <p style={styles.formSubtitle}>Join thousands earning real money</p>

                <AnimatePresence>
                  {success && (
                    <motion.div
                      style={styles.success}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <span style={styles.successIcon}>✓</span>
                      {success}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      style={styles.error}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      <span style={styles.errorIcon}>⚠</span>
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
            
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                      <IconMail style={{...styles.inputIcon, display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem'}} />
                      Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                  required
                  style={styles.input}
                      disabled={loading}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                      <IconKey style={{...styles.inputIcon, display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem'}} />
                      Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                  required
                  style={styles.input}
                      disabled={loading}
                />
              </div>

                  <motion.button
                type="submit" 
                disabled={loading}
                    style={{
                      ...styles.submitButton,
                      ...(loading && styles.submitButtonLoading)
                    }}
                    whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <span>Sign In to Your Account</span>
                    )}
                  </motion.button>
            </form>

                <div style={styles.divider}>
                  <div style={styles.dividerLine}></div>
                  <span style={styles.dividerText}>Quick Access</span>
                  <div style={styles.dividerLine}></div>
                </div>

            <div style={styles.testButtons}>
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!loading) handleTestLogin('user');
                    }}
                    className="liquid-glass"
                    style={styles.testButton}
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.05 } : {}}
                    whileTap={!loading ? { scale: 0.95 } : {}}
                  >
                    <div style={styles.testTitle}>Player</div>
                    <div style={styles.testSubtitle}>Try it</div>
                  </motion.button>

                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!loading) handleTestLogin('admin');
                    }}
                    className="liquid-glass"
                    style={styles.testButton}
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.05 } : {}}
                    whileTap={!loading ? { scale: 0.95 } : {}}
                  >
                    <div style={styles.testTitle}>Admin</div>
                    <div style={styles.testSubtitle}>Panel</div>
                  </motion.button>
            </div>

            <p style={styles.signupLink}>
                  New here? <Link to="/register" style={styles.link}>Create account →</Link>
            </p>
          </div>

              {/* Key Differentiator - Zigzag placement */}
              <div className="liquid-glass" style={styles.diffBox}>
                <div>
                  <strong className="text-glow" style={styles.diffTitle}>What Makes CMX Different?</strong>
                  <p style={styles.diffText}>
                    We <strong style={{color: '#FFD700', fontWeight: '700'}}>appreciate your business</strong>. Every ad you watch, every offer you complete—we split the revenue with you based on your loyalty. No other platform does this. Plus, you can donate to causes while earning.
                  </p>
        </div>
              </div>
            </div>
          </div>
        </motion.div>
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
    padding: '3rem 2rem',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1f 30%, #0f0a20 60%, #0a0a0a 100%)',
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
  content: {
    width: '100%',
    maxWidth: '1600px',
    position: 'relative',
    zIndex: 10
  },
  mainSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  logoFlowContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '3rem',
    position: 'relative',
    padding: '2rem 0',
    gap: '2.5rem',
    flexWrap: 'nowrap'
  },
  flowLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '1.5rem',
    flexShrink: 0
  },
  flowRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '1.5rem',
    flexShrink: 0
  },
  flowTextCard: {
    width: '210px',
    height: '210px',
    minWidth: '210px',
    maxWidth: '210px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  flowIcon: {
    fontSize: '3.5rem',
    textAlign: 'center',
    marginBottom: '0.75rem'
  },
  flowText: {
    textAlign: 'center'
  },
  flowTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: '0.5rem',
    letterSpacing: '-0.2px'
  },
  flowSubtitle: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: '1.4',
    fontWeight: '500'
  },
  arrowContainer: {
    width: '150px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  flowArrowSvg: {
    width: '100%',
    height: '100%'
  },
  logoWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    width: '210px',
    height: '210px',
    flexShrink: 0
  },
  titleContainer: {
    marginBottom: '0',
    textAlign: 'center',
    padding: '2.5rem'
  },
  mainTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#FFD700',
    margin: 0,
    marginBottom: '1rem',
    lineHeight: '1.3',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.6',
    margin: 0,
    fontWeight: '400',
    letterSpacing: '0.2px'
  },
  zigzagLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'flex-start'
  },
  leftSide: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  rightSide: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    alignItems: 'stretch',
    position: 'relative',
    zIndex: 10,
    pointerEvents: 'auto'
  },
  videoContainer: {
    padding: '2.5rem',
    minHeight: '420px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  videoPlaceholder: {
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem'
  },
  videoIconContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(255, 215, 0, 0.1)',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  },
  videoIcon: {
    width: '40px',
    height: '40px',
    color: '#FFD700',
    stroke: '#FFD700',
    fill: 'none',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  },
  videoTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.3px'
  },
  videoDesc: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.65)',
    margin: 0,
    fontWeight: '400'
  },
  benefitsCard: {
    marginBottom: '0'
  },
  benefitsTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '1.5rem',
    letterSpacing: '-0.3px',
    textShadow: '0 2px 15px rgba(118, 75, 162, 0.3)'
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem'
  },
  benefitItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    padding: '1.25rem',
    transition: 'all 0.3s ease'
  },
  benefitIcon: {
    color: '#FFD700',
    flexShrink: 0
  },
  benefitTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '0.25rem',
    letterSpacing: '-0.2px'
  },
  benefitDesc: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: '1.5'
  },
  tabs: {
    display: 'flex',
    gap: '0.75rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '0.5rem',
    marginBottom: '1rem'
  },
  tab: {
    padding: '0.875rem 1.75rem',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '-2px',
    letterSpacing: '0.3px'
  },
  tabContent: {
    minHeight: '600px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  contentCard: {
    marginBottom: '1.5rem'
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '1rem',
    letterSpacing: '-0.3px',
    textShadow: '0 2px 15px rgba(118, 75, 162, 0.3)'
  },
  description: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.7',
    marginBottom: '1.5rem',
    fontWeight: '400'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem'
  },
  statCard: {
    padding: '1.75rem',
    textAlign: 'center',
    transition: 'all 0.3s ease'
  },
  statIcon: {
    color: '#FFD700',
    marginBottom: '0.75rem',
    display: 'flex',
    justifyContent: 'center'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: '0.5rem',
    letterSpacing: '-0.5px'
  },
  statLabel: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '0.25rem'
  },
  statDesc: {
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400'
  },
  infoBox: {
    marginBottom: '1.5rem'
  },
  infoTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '1rem',
    letterSpacing: '-0.2px'
  },
  infoContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem'
  },
  infoItem: {
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.7',
    fontWeight: '400'
  },
  gamesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  gameItem: {
    padding: '1.5rem'
  },
  gameName: {
    fontSize: '1.1rem',
    color: '#ffffff',
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '700',
    letterSpacing: '-0.2px'
  },
  gameOdds: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '400'
  },
  orgsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  orgCard: {
    padding: 0,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    textAlign: 'center'
  },
  orgImageContainer: {
    position: 'relative',
    width: '100%',
    height: '140px',
    overflow: 'hidden'
  },
  orgImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(0.7)'
  },
  orgIconOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60px',
    height: '60px',
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  orgIcon: {
    fontSize: '2rem'
  },
  orgName: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#ffffff',
    padding: '1rem 1rem 0.5rem',
    textShadow: '0 1px 10px rgba(118, 75, 162, 0.3)'
  },
  orgDesc: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.65)',
    padding: '0 1rem 1rem',
    fontWeight: '400',
    lineHeight: '1.5'
  },
  missionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: '1rem',
    letterSpacing: '-0.3px'
  },
  missionText: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: '1.8',
    margin: 0,
    fontWeight: '400'
  },
  diffBox: {
    marginTop: '1rem'
  },
  diffTitle: {
    fontSize: '1.3rem',
    color: '#FFD700',
    display: 'block',
    marginBottom: '0.75rem',
    fontWeight: '700',
    letterSpacing: '-0.3px'
  },
  diffText: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: '1.7',
    margin: 0,
    fontWeight: '400'
  },
  formCard: {
    width: '100%',
    padding: '3rem',
    position: 'sticky',
    top: '2rem',
    zIndex: 10,
    pointerEvents: 'auto'
  },
  formTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: '0.5rem',
    textAlign: 'center',
    letterSpacing: '-0.5px'
  },
  formSubtitle: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: '0.95rem',
    marginBottom: '2rem',
    fontWeight: '400'
  },
  success: {
    padding: '1rem 1.25rem',
    backgroundColor: 'rgba(46, 213, 115, 0.15)',
    border: '1px solid rgba(46, 213, 115, 0.3)',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    color: '#ffffff',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontWeight: '500'
  },
  successIcon: {
    fontSize: '1.1rem',
    color: '#4ade80'
  },
  error: {
    padding: '1rem 1.25rem',
    backgroundColor: 'rgba(255, 68, 68, 0.15)',
    border: '1px solid rgba(255, 68, 68, 0.3)',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    color: '#ffffff',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontWeight: '500'
  },
  errorIcon: {
    fontSize: '1.1rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: '0.2px',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    width: '18px',
    height: '18px',
    color: '#FFD700'
  },
  input: {
    padding: '1.15rem 1.25rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    fontWeight: '400',
    transition: 'all 0.3s ease'
  },
  submitButton: {
    padding: '1.35rem',
    background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.4) 0%, rgba(102, 126, 234, 0.4) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1.05rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    transition: 'all 0.3s ease',
    letterSpacing: '0.3px',
    boxShadow: '0 4px 20px rgba(118, 75, 162, 0.3)'
  },
  submitButtonLoading: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    margin: '2.5rem 0 1.75rem'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255, 255, 255, 0.1)'
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    minWidth: '120px',
    textAlign: 'center'
  },
  testButtons: {
    display: 'flex',
    gap: '1rem'
  },
  testButton: {
    flex: 1,
    padding: '1.25rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    transition: 'all 0.3s ease',
    pointerEvents: 'auto'
  },
  testTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  testSubtitle: {
    fontSize: '0.85rem',
    opacity: 0.7,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  signupLink: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: '0.9rem',
    fontWeight: '400'
  },
  link: {
    color: '#FFD700',
    fontWeight: '700',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
  }
};

export default Login;
