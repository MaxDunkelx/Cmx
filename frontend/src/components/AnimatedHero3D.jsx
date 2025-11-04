import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import CMXLogo from './CMXLogo';

function AnimatedHero3D() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rippleWave {
        0% { 
          transform: scale(0.5); 
          opacity: 0.7; 
        }
        30% {
          opacity: 0.6;
        }
        60% {
          opacity: 0.4;
        }
        100% { 
          transform: scale(1.8); 
          opacity: 0; 
        }
      }
      
      .flow-card:hover .card-glow {
        opacity: 0.8 !important;
      }
      
      .method-item:hover {
        background: rgba(255, 255, 255, 0.08) !important;
        border-color: rgba(255, 215, 0, 0.3) !important;
        transform: translateX(5px);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div 
      ref={containerRef}
      style={styles.container}
    >

      {/* Left Side - Earning Methods */}
      <motion.div
        style={{
          ...styles.flowCard,
          ...styles.leftCard,
          transform: `perspective(1000px) rotateY(${mousePosition.x * 3}deg) rotateX(${-mousePosition.y * 3}deg)`
        }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="flow-card"
      >
        <div className="card-glow" style={styles.cardGlow}></div>
        
        <div style={styles.cardHeader}>
          <div style={styles.cardIconLarge}>💼</div>
          <div style={styles.cardTitleText}>Your Work</div>
        </div>
        
        <div style={styles.methodsList}>
          <div className="method-item" style={styles.methodItem}>
            <div style={styles.methodIcon}>📺</div>
            <div style={styles.methodDetails}>
              <div style={styles.methodName}>Watch Ads</div>
              <div style={styles.methodPayout}>1,000 CMX <span style={styles.usdConversion}>~$0.10 each</span></div>
            </div>
          </div>
          
          <div className="method-item" style={styles.methodItem}>
            <div style={styles.methodIcon}>📝</div>
            <div style={styles.methodDetails}>
              <div style={styles.methodName}>Surveys</div>
              <div style={styles.methodPayout}>5K-15K CMX <span style={styles.usdConversion}>~$0.50-1.50</span></div>
            </div>
          </div>
          
          <div className="method-item" style={styles.methodItem}>
            <div style={styles.methodIcon}>🎁</div>
            <div style={styles.methodDetails}>
              <div style={styles.methodName}>Offers</div>
              <div style={styles.methodPayout}>20K-50K CMX <span style={styles.usdConversion}>~$2-5</span></div>
            </div>
          </div>
        </div>
        
        <div style={styles.cardFooter}>
          <div style={styles.footerLabel}>You Earn</div>
          <div style={styles.footerValue}>CMX Tokens</div>
          <div style={styles.footerUsd}>10,000 CMX = $1 USD</div>
        </div>
      </motion.div>

      {/* Center - Logo */}
      <motion.div
        style={styles.centerLogo}
      >
        {/* Ripple Rings - Drop in Ocean Effect */}
        <div style={{ ...styles.rippleRing, animationDelay: '0s' }}></div>
        <div style={{ ...styles.rippleRing, animationDelay: '0.3s' }}></div>
        <div style={{ ...styles.rippleRing, animationDelay: '0.6s' }}></div>
        <div style={{ ...styles.rippleRing, animationDelay: '0.9s' }}></div>
        <div style={{ ...styles.rippleRing, animationDelay: '1.2s' }}></div>
        <div style={{ ...styles.rippleRing, animationDelay: '1.5s' }}></div>
        <div style={{ ...styles.rippleRing, animationDelay: '1.8s' }}></div>
        <div style={{ ...styles.rippleRing, animationDelay: '2.1s' }}></div>
        <div style={{ ...styles.rippleRing, animationDelay: '2.4s' }}></div>
        <div style={{ ...styles.rippleRing, animationDelay: '2.7s' }}></div>
        <div style={{ ...styles.rippleRing, animationDelay: '3.0s' }}></div>
        <div style={{ ...styles.rippleRing, animationDelay: '3.3s' }}></div>
        
        {/* Logo */}
        <div style={styles.logoWrapper}>
          <CMXLogo size="180px" animated={true} />
        </div>
      </motion.div>


      {/* Right Side - Gaming & Rewards */}
      <motion.div
        style={{
          ...styles.flowCard,
          ...styles.rightCard,
          transform: `perspective(1000px) rotateY(${mousePosition.x * -3}deg) rotateX(${-mousePosition.y * 3}deg)`
        }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="flow-card"
      >
        <div className="card-glow" style={styles.cardGlow}></div>
        
        <div style={styles.cardHeader}>
          <div style={styles.cardIconLarge}>🎯</div>
          <div style={styles.cardTitleText}>Your Reward</div>
        </div>
        
        <div style={styles.methodsList}>
          <div className="method-item" style={styles.methodItem}>
            <div style={styles.methodIcon}>🎰</div>
            <div style={styles.methodDetails}>
              <div style={styles.methodName}>Play Games</div>
              <div style={styles.methodPayout}>Win 30K-500K+ CMX <span style={styles.usdConversion}>~$3-50+</span></div>
            </div>
          </div>
          
          <div className="method-item" style={styles.methodItem}>
            <div style={styles.methodIcon}>💰</div>
            <div style={styles.methodDetails}>
              <div style={styles.methodName}>Fair Odds</div>
              <div style={styles.methodPayout}>95% RTP Rate</div>
            </div>
          </div>
          
          <div className="method-item" style={styles.methodItem}>
            <div style={styles.methodIcon}>🏦</div>
            <div style={styles.methodDetails}>
              <div style={styles.methodName}>Withdraw</div>
              <div style={styles.methodPayout}>Min 300K CMX <span style={styles.usdConversion}>~$30</span></div>
            </div>
          </div>
        </div>
        
        <div style={styles.cardFooter}>
          <div style={styles.footerLabel}>You Keep</div>
          <div style={styles.footerValue}>Real Money</div>
          <div style={styles.footerUsd}>Instant Withdrawals</div>
        </div>
      </motion.div>

    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: 'auto',
    minHeight: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '2rem',
    marginBottom: '2rem',
    perspective: '2000px',
    transformStyle: 'preserve-3d'
  },
  flowCard: {
    position: 'relative',
    width: '280px',
    minHeight: '380px',
    background: 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '2px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '24px',
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transformStyle: 'preserve-3d',
    overflow: 'visible'
  },
  leftCard: {
    zIndex: 5
  },
  rightCard: {
    zIndex: 5
  },
  cardGlow: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
    opacity: 0,
    transition: 'opacity 0.5s ease',
    pointerEvents: 'none'
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '1.25rem',
    borderBottom: '2px solid rgba(255, 255, 255, 0.12)',
    paddingBottom: '1.25rem'
  },
  cardIconLarge: {
    fontSize: '3rem',
    marginBottom: '0.75rem',
    filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))'
  },
  cardTitleText: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    textAlign: 'center',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
  },
  methodsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    flex: 1,
    marginBottom: '1rem'
  },
  methodItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: 'rgba(255, 255, 255, 0.04)',
    padding: '1rem',
    borderRadius: '14px',
    border: '1.5px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
  },
  methodIcon: {
    fontSize: '2rem',
    flexShrink: 0,
    filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.4))',
    minWidth: '2rem'
  },
  methodDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  methodName: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: '1.3',
    letterSpacing: '0.3px'
  },
  methodPayout: {
    fontSize: '0.82rem',
    color: '#FFD700',
    fontWeight: '700',
    letterSpacing: '0.3px',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem'
  },
  usdConversion: {
    fontSize: '0.68rem',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    fontStyle: 'italic',
    letterSpacing: '0px'
  },
  cardFooter: {
    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1))',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '14px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 'auto',
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.15)'
  },
  footerLabel: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: '0.4rem',
    fontWeight: '600'
  },
  footerValue: {
    fontSize: '1.1rem',
    fontWeight: '900',
    color: '#FFD700',
    textShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
    letterSpacing: '0.5px',
    marginBottom: '0.25rem'
  },
  footerUsd: {
    fontSize: '0.7rem',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    fontStyle: 'italic'
  },
  centerLogo: {
    position: 'relative',
    width: '250px',
    height: '250px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    transformStyle: 'preserve-3d'
  },
  rippleRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '1px solid rgba(255, 215, 0, 0.5)',
    animation: 'rippleWave 5s cubic-bezier(0.4, 0.0, 0.2, 1) infinite',
    pointerEvents: 'none',
    boxShadow: '0 0 6px rgba(255, 215, 0, 0.15)'
  },
  logoWrapper: {
    position: 'relative',
    zIndex: 2
  }
};

export default AnimatedHero3D;

