import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import CMXLogo from '../components/CMXLogo';
import AnimatedHero3D from '../components/AnimatedHero3D';
import EnhancedReviewsCarousel from '../components/EnhancedReviewsCarousel';
import backgroundVideo from '../assets/background-vidio.mp4';

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
      
      @keyframes rainFall {
        0% { 
          transform: translateY(-150px) rotate(0deg);
          opacity: 0;
        }
        3% {
          opacity: 0.28;
        }
        97% {
          opacity: 0.28;
        }
        100% { 
          transform: translateY(calc(100vh + 150px)) rotate(360deg);
          opacity: 0;
        }
      }
      
      .rain-emoji {
        position: absolute;
        animation: rainFall linear infinite;
        pointer-events: none;
        user-select: none;
        filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.15));
        will-change: transform;
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
      image: 'https://images.unsplash.com/photo-1441974231531-20fa691ff6ca?w=400&h=300&fit=crop',
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

  const valueHighlights = [
    {
      icon: '🎯',
      title: 'Our Promise',
      body: (
        <>
          Earn CMX through tasks and ads, then multiply it playing <strong style={styles.strongText}>provably fair games</strong>. Everything is transparent, verifiable, and honest.
        </>
      )
    },
    {
      icon: '🤝',
      title: 'Growing Together',
      body: (
        <>
          We're building this <strong style={styles.strongText}>with you, not for you</strong>. Your feedback shapes our platform. We're here to learn, improve, and create something amazing together.
        </>
      )
    },
    {
      icon: '✅',
      iconSize: '1.75rem',
      title: 'Fair & Transparent',
      body: (
        <>
          No hidden fees, no tricks, no BS. <strong style={styles.strongText}>95% RTP on games</strong>, instant withdrawals, and complete transparency in every transaction. We publish live RTP tables, verifiable RNG hashes, and weekly profit-share reports so you always see how every CMX token is allocated.
        </>
      )
    },
    {
      icon: '👥',
      title: 'From the Founders',
      body: (
        <>
          "We're not a massive corporation or a crypto scheme. We're three guys who believe people deserve <strong style={styles.strongText}>fair compensation</strong> for their time and attention. Join us in building the future of online earning—one game, one task, one win at a time." 🚀
        </>
      )
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>

      {/* Money & Gambling Rain Effect */}
      <div style={styles.rainContainer}>
        {/* Money Rain - Column 1 */}
        <div className="rain-emoji" style={{ left: '5%', animationDuration: '8s', animationDelay: '0s', fontSize: '2rem', top: '20%' }}>💰</div>
        <div className="rain-emoji" style={{ left: '5%', animationDuration: '10s', animationDelay: '0s', fontSize: '2.5rem', top: '60%' }}>💎</div>
        
        {/* Money Rain - Column 2 */}
        <div className="rain-emoji" style={{ left: '12%', animationDuration: '9s', animationDelay: '0s', fontSize: '2.2rem', top: '10%' }}>🪙</div>
        <div className="rain-emoji" style={{ left: '12%', animationDuration: '11s', animationDelay: '0s', fontSize: '2.4rem', top: '45%' }}>💵</div>
        
        {/* Gambling Rain - Column 3 */}
        <div className="rain-emoji" style={{ left: '20%', animationDuration: '7s', animationDelay: '0s', fontSize: '2.3rem', top: '30%' }}>🎰</div>
        <div className="rain-emoji" style={{ left: '20%', animationDuration: '12s', animationDelay: '0s', fontSize: '2.1rem', top: '70%' }}>🎲</div>
        
        {/* Cards Rain - Column 4 */}
        <div className="rain-emoji" style={{ left: '28%', animationDuration: '10s', animationDelay: '0s', fontSize: '2.5rem', top: '5%' }}>🃏</div>
        <div className="rain-emoji" style={{ left: '28%', animationDuration: '8s', animationDelay: '0s', fontSize: '2rem', top: '50%' }}>♠️</div>
        
        {/* Suits Rain - Column 5 */}
        <div className="rain-emoji" style={{ left: '35%', animationDuration: '9s', animationDelay: '0s', fontSize: '2.2rem', top: '25%' }}>♥️</div>
        <div className="rain-emoji" style={{ left: '35%', animationDuration: '11s', animationDelay: '0s', fontSize: '2.4rem', top: '65%' }}>♣️</div>
        
        {/* Diamond Suit - Column 6 */}
        <div className="rain-emoji" style={{ left: '42%', animationDuration: '8s', animationDelay: '0s', fontSize: '2.6rem', top: '15%' }}>♦️</div>
        <div className="rain-emoji" style={{ left: '42%', animationDuration: '10s', animationDelay: '0s', fontSize: '2.3rem', top: '55%' }}>💎</div>
        
        {/* Crypto Rain - Column 7 */}
        <div className="rain-emoji" style={{ left: '50%', animationDuration: '9s', animationDelay: '0s', fontSize: '2.4rem', top: '35%' }}>₿</div>
        <div className="rain-emoji" style={{ left: '50%', animationDuration: '12s', animationDelay: '0s', fontSize: '2.2rem', top: '75%' }}>Ξ</div>
        
        {/* Lucky Symbols - Column 8 */}
        <div className="rain-emoji" style={{ left: '58%', animationDuration: '7s', animationDelay: '0s', fontSize: '2.5rem', top: '8%' }}>🍀</div>
        <div className="rain-emoji" style={{ left: '58%', animationDuration: '10s', animationDelay: '0s', fontSize: '2rem', top: '48%' }}>7️⃣</div>
        
        {/* Money Bag - Column 9 */}
        <div className="rain-emoji" style={{ left: '65%', animationDuration: '11s', animationDelay: '0s', fontSize: '2.3rem', top: '18%' }}>💰</div>
        <div className="rain-emoji" style={{ left: '65%', animationDuration: '8s', animationDelay: '0s', fontSize: '2.6rem', top: '58%' }}>🏆</div>
        
        {/* Slot Symbols - Column 10 */}
        <div className="rain-emoji" style={{ left: '72%', animationDuration: '9s', animationDelay: '0s', fontSize: '2.2rem', top: '12%' }}>🍒</div>
        <div className="rain-emoji" style={{ left: '72%', animationDuration: '10s', animationDelay: '0s', fontSize: '2.4rem', top: '52%' }}>🔔</div>
        
        {/* Star & Crown - Column 11 */}
        <div className="rain-emoji" style={{ left: '80%', animationDuration: '8s', animationDelay: '0s', fontSize: '2.5rem', top: '22%' }}>⭐</div>
        <div className="rain-emoji" style={{ left: '80%', animationDuration: '11s', animationDelay: '0s', fontSize: '2.1rem', top: '62%' }}>👑</div>
        
        {/* Jackpot - Column 12 */}
        <div className="rain-emoji" style={{ left: '88%', animationDuration: '10s', animationDelay: '0s', fontSize: '2.3rem', top: '28%' }}>🎰</div>
        <div className="rain-emoji" style={{ left: '88%', animationDuration: '9s', animationDelay: '0s', fontSize: '2.6rem', top: '68%' }}>💵</div>
        
        {/* Money Stack - Column 13 */}
        <div className="rain-emoji" style={{ left: '95%', animationDuration: '12s', animationDelay: '0s', fontSize: '2.4rem', top: '3%' }}>💸</div>
        <div className="rain-emoji" style={{ left: '95%', animationDuration: '8s', animationDelay: '0s', fontSize: '2.2rem', top: '42%' }}>🎲</div>
        
        {/* Additional scattered rain */}
        <div className="rain-emoji" style={{ left: '8%', animationDuration: '10s', animationDelay: '0s', fontSize: '2rem', top: '38%' }}>🪙</div>
        <div className="rain-emoji" style={{ left: '15%', animationDuration: '9s', animationDelay: '0s', fontSize: '2.3rem', top: '72%' }}>💎</div>
        <div className="rain-emoji" style={{ left: '25%', animationDuration: '11s', animationDelay: '0s', fontSize: '2.5rem', top: '16%' }}>🎯</div>
        <div className="rain-emoji" style={{ left: '32%', animationDuration: '8s', animationDelay: '0s', fontSize: '2.1rem', top: '56%' }}>💵</div>
        <div className="rain-emoji" style={{ left: '48%', animationDuration: '10s', animationDelay: '0s', fontSize: '2.4rem', top: '11%' }}>🎰</div>
        <div className="rain-emoji" style={{ left: '55%', animationDuration: '9s', animationDelay: '0s', fontSize: '2.2rem', top: '46%' }}>💰</div>
        <div className="rain-emoji" style={{ left: '62%', animationDuration: '12s', animationDelay: '0s', fontSize: '2.6rem', top: '6%' }}>🍒</div>
        <div className="rain-emoji" style={{ left: '70%', animationDuration: '8s', animationDelay: '0s', fontSize: '2.3rem', top: '40%' }}>⭐</div>
        <div className="rain-emoji" style={{ left: '78%', animationDuration: '11s', animationDelay: '0s', fontSize: '2rem', top: '78%' }}>🔔</div>
        <div className="rain-emoji" style={{ left: '85%', animationDuration: '9s', animationDelay: '0s', fontSize: '2.5rem', top: '24%' }}>💸</div>
        <div className="rain-emoji" style={{ left: '92%', animationDuration: '10s', animationDelay: '0s', fontSize: '2.2rem', top: '64%' }}>🍀</div>
      </div>

      <div style={styles.content}>
        {/* Single Column - All Content */}
        <motion.div
          style={styles.mainSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* 3D Animated Hero with Particle Streams */}
          <AnimatedHero3D />

          {/* CMX Mission Statement - What We Are */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ marginBottom: '2.5rem' }}
          >
            <div style={styles.missionHeader}>
              <video
                autoPlay
                loop
                muted
                playsInline
                style={styles.missionHeaderVideo}
              >
                <source src={backgroundVideo} type="video/mp4" />
              </video>
              <div style={styles.missionHeaderOverlay} />
              <div style={styles.missionHeaderContent}>
                <div style={styles.missionBadge}>
                  <span style={styles.badgeGlow}>✨</span>
                  <span style={styles.badgeTitle}>CMX Platform</span>
                  <span style={styles.badgeGlow}>✨</span>
                </div>
                
                <h2 style={styles.missionTitle}>
                  <span style={styles.highlightGold}>Earn.</span>{' '}
                  <span style={styles.highlightPurple}>Play.</span>{' '}
                  <span style={styles.highlightGreen}>Win.</span>
                </h2>
                
                <div style={styles.missionContent}>
                  <p style={styles.missionText}>
                    We're <strong style={styles.strongText}>three friends</strong> building a simple cycle: complete sponsored tasks, videos, and surveys to earn CMX tokens, which are valued like real currency at <strong style={styles.strongText}>10,000 CMX = $1 USD</strong>. Jump into the gaming hub to play and multiply your balance, then cash out or route your earnings to a cause you believe in.
                  </p>
                  
                  <div style={styles.valueProps}>
                    {valueHighlights.map(({ icon, iconSize, title, body }, idx) => (
                      <div key={idx} style={styles.valueProp}>
                        <div style={{ ...styles.valuePropIcon, fontSize: iconSize || styles.valuePropIcon.fontSize }}>{icon}</div>
                        <div>
                          <div style={styles.valuePropTitle}>{title}</div>
                          <div style={styles.valuePropText}>{body}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Reviews Carousel - Compact Top Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ marginBottom: '2rem', transform: 'scale(0.85)', transformOrigin: 'top center' }}
          >
            <EnhancedReviewsCarousel />
          </motion.div>

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

            {/* Right Side - Login Form */}
            <div style={styles.rightSide}>
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

          {/* Professional Footer with Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{ marginTop: '5rem' }}
          >
            <div className="liquid-glass" style={styles.footerContainer}>
              {/* Footer Top - Links & Info */}
              <div style={styles.footerTop}>
                <div style={styles.footerColumn}>
                  <div style={styles.footerLogo}>
                    <CMXLogo size="60px" animated={false} />
                    <div style={styles.footerBrand}>CMX Platform</div>
                  </div>
                  <p style={styles.footerTagline}>
                    Revolutionizing earning and gaming through transparency, fairness, and community impact.
                  </p>
                </div>
                
                <div style={styles.footerColumn}>
                  <h4 style={styles.footerTitle}>Platform</h4>
                  <div style={styles.footerLinks}>
                    <div style={styles.footerLink}>🎮 Casino Games</div>
                    <div style={styles.footerLink}>💰 Earn & Win</div>
                    <div style={styles.footerLink}>🌍 Give Back</div>
                    <div style={styles.footerLink}>📊 Provably Fair</div>
                  </div>
                </div>
                
                <div style={styles.footerColumn}>
                  <h4 style={styles.footerTitle}>Legal</h4>
                  <div style={styles.footerLinks}>
                    <div style={styles.footerLink}>📜 Terms of Service</div>
                    <div style={styles.footerLink}>🔒 Privacy Policy</div>
                    <div style={styles.footerLink}>⚖️ Responsible Gaming</div>
                    <div style={styles.footerLink}>✅ Fair Play Policy</div>
                  </div>
                </div>
                
                <div style={styles.footerColumn}>
                  <h4 style={styles.footerTitle}>Support</h4>
                  <div style={styles.footerLinks}>
                    <div style={styles.footerLink}>💬 Help Center</div>
                    <div style={styles.footerLink}>📧 Contact Us</div>
                    <div style={styles.footerLink}>❓ FAQ</div>
                    <div style={styles.footerLink}>📱 Community</div>
                  </div>
                </div>
              </div>
              
              {/* Footer Bottom - Copyright & Legal */}
              <div style={styles.footerBottom}>
                <div style={styles.copyrightSection}>
                  <div style={styles.copyrightText}>
                    © {new Date().getFullYear()} CMX Platform. All rights reserved.
                  </div>
                  <div style={styles.legalText}>
                    Licensed and regulated gaming platform. Play responsibly.
                  </div>
                </div>
                
                <div style={styles.disclaimerSection}>
                  <div style={styles.disclaimerBadge}>
                    <span style={styles.badgeIcon}>🔒</span>
                    <span style={styles.badgeText}>SSL Secured</span>
                  </div>
                  <div style={styles.disclaimerBadge}>
                    <span style={styles.badgeIcon}>✓</span>
                    <span style={styles.badgeText}>Blockchain Verified</span>
                  </div>
                  <div style={styles.disclaimerBadge}>
                    <span style={styles.badgeIcon}>18+</span>
                    <span style={styles.badgeText}>Adults Only</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
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
    background: 'linear-gradient(150deg, #05060b 0%, #0a1320 55%, #020308 100%)',
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
    opacity: 0.25
  },
  rainContainer: {
    position: 'absolute',
    top: '-150px',
    left: 0,
    right: 0,
    bottom: 0,
    height: 'calc(100% + 300px)',
    pointerEvents: 'none',
    overflow: 'hidden',
    zIndex: 1
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
    fontSize: '1.15rem',
    color: 'rgba(226, 232, 240, 0.85)',
    lineHeight: '1.8',
    marginBottom: '2rem',
    textAlign: 'center'
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
  },
  missionHeader: {
    padding: '3rem',
    textAlign: 'center',
    border: '1px solid rgba(148, 163, 184, 0.22)',
    boxShadow: '0 24px 60px rgba(2, 6, 23, 0.55)',
    borderRadius: '28px',
    position: 'relative',
    overflow: 'hidden',
    background: 'transparent'
  },
  missionHeaderVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
    filter: 'brightness(0.5)'
  },
  missionHeaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, rgba(5, 10, 20, 0.7) 0%, rgba(2, 6, 18, 0.85) 100%)',
    zIndex: 1,
    borderRadius: 'inherit',
    backdropFilter: 'blur(4px)'
  },
  missionHeaderContent: {
    position: 'relative',
    zIndex: 2
  },
  missionBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'rgba(17, 24, 39, 0.7)',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    borderRadius: '30px',
    padding: '0.75rem 2rem',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
    fontWeight: '700',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: 'rgba(226, 232, 240, 0.85)'
  },
  badgeGlow: {
    fontSize: '1.2rem',
    filter: 'drop-shadow(0 0 6px rgba(148, 163, 184, 0.35))'
  },
  badgeTitle: {
    color: 'rgba(226, 232, 240, 0.9)',
    textShadow: '0 0 10px rgba(148, 163, 184, 0.3)'
  },
  missionTitle: {
    fontSize: '3rem',
    fontWeight: '900',
    marginBottom: '2rem',
    letterSpacing: '-0.5px',
    lineHeight: '1.2'
  },
  highlightGold: {
    color: 'rgba(226, 232, 240, 0.95)',
    textShadow: '0 0 14px rgba(148, 163, 184, 0.35)'
  },
  highlightPurple: {
    color: 'rgba(165, 180, 252, 0.9)',
    textShadow: '0 0 14px rgba(129, 140, 248, 0.3)'
  },
  highlightGreen: {
    color: 'rgba(134, 239, 172, 0.85)',
    textShadow: '0 0 12px rgba(34, 197, 94, 0.25)'
  },
  missionContent: {
    maxWidth: '900px',
    margin: '0 auto',
    textAlign: 'left'
  },
  missionText: {
    fontSize: '1.15rem',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: '1.8',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  strongText: {
    color: 'rgba(226, 232, 240, 0.95)',
    fontWeight: '800'
  },
  founderNote: {
    background: 'rgba(8, 13, 23, 0.85)',
    border: '1px solid rgba(71, 85, 105, 0.35)',
    borderRadius: '20px',
    padding: '2rem',
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'flex-start'
  },
  founderIcon: {
    fontSize: '3rem',
    flexShrink: 0,
    filter: 'drop-shadow(0 0 8px rgba(94, 106, 129, 0.35))'
  },
  founderContent: {
    flex: 1
  },
  founderTitle: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: 'rgba(226, 232, 240, 0.9)',
    marginBottom: '0.75rem',
    letterSpacing: '0.5px'
  },
  founderText: {
    fontSize: '1.05rem',
    color: 'rgba(203, 213, 225, 0.87)',
    lineHeight: '1.8',
    fontStyle: 'italic'
  },
  footerContainer: {
    padding: '3rem',
    borderTop: '1px solid rgba(255, 215, 0, 0.2)'
  },
  footerTop: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '3rem',
    marginBottom: '3rem',
    paddingBottom: '2.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  footerColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem'
  },
  footerBrand: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: '0.5px'
  },
  footerTagline: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.6',
    margin: 0
  },
  footerTitle: {
    fontSize: '1rem',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  footerLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  footerLink: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    lineHeight: '1.4'
  },
  footerBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '2rem'
  },
  copyrightSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  copyrightText: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600'
  },
  legalText: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500'
  },
  disclaimerSection: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  disclaimerBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  badgeIcon: {
    fontSize: '1rem',
    filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.3))'
  },
  badgeText: {
    letterSpacing: '0.3px'
  },
  valueProps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
    alignItems: 'stretch'
  },
  valueProp: {
    background: 'rgba(11, 16, 26, 0.72)',
    border: '1px solid rgba(71, 85, 105, 0.35)',
    borderRadius: '16px',
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: 'all 0.3s ease',
    minHeight: '240px',
    justifyContent: 'space-between',
    height: '100%',
    alignItems: 'flex-start'
  },
  valuePropIcon: {
    fontSize: '2.2rem',
    textAlign: 'left',
    marginBottom: '0.75rem',
    filter: 'drop-shadow(0 0 6px rgba(148, 163, 184, 0.25))'
  },
  valuePropTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: 'rgba(226, 232, 240, 0.92)',
    marginBottom: '0.6rem',
    textAlign: 'left',
    letterSpacing: '0.25px'
  },
  valuePropText: {
    fontSize: '0.95rem',
    color: 'rgba(203, 213, 225, 0.72)',
    lineHeight: '1.7',
    textAlign: 'left'
  }
};

export default Login;
