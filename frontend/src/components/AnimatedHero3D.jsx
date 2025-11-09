import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import yourRewardVideo from '../assets/your-reward.mp4';

function AnimatedHero3D() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const cardVideoRefs = useRef([]);

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

  useEffect(() => {
    const videos = cardVideoRefs.current.filter(Boolean);
    videos.forEach((video) => {
      try {
        video.muted = true;
        video.volume = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } catch (err) {
        console.warn('AnimatedHero3D video autoplay error:', err);
      }
    });
  }, []);

  const workStats = [
    { label: 'Active Earners', value: '38,420', delta: '+14% MoM' },
    { label: 'Avg Task Value', value: '12.4K CMX', delta: '~$1.24 USD' },
    { label: 'Completion Time', value: '2m 18s', delta: 'Median turnaround' }
  ];

  const rewardStats = [
    { label: 'Daily Payouts', value: '$18.6K', delta: 'USD equivalent' },
    { label: 'Win Rate (Tier 3+)', value: '62%', delta: 'Verified fairness' },
    { label: 'Cash Out Speed', value: '5m 02s', delta: 'Average settlement' }
  ];

  const workStreams = [
    {
      icon: '📺',
      name: 'Interactive Ads',
      metric: '1,200 CMX / view',
      detail: 'Brand-safe inventory with verified completion events'
    },
    {
      icon: '📝',
      name: 'Market Surveys',
      metric: '5K – 18K CMX / form',
      detail: 'Dynamic quotas & adaptive pricing via survey partners'
    },
    {
      icon: '🧩',
      name: 'Skilled Microtasks',
      metric: '22K CMX median',
      detail: 'AI training, QA, and product feedback missions'
    }
  ];

  const rewardStreams = [
    {
      icon: '🎰',
      name: 'Provably Fair Games',
      metric: '30K – 520K CMX',
      detail: 'On-chain RNG seeds verified every 30 minutes'
    },
    {
      icon: '💹',
      name: 'Streak Multipliers',
      metric: 'x1.2 – x3.5 loyalty boost',
      detail: 'Dynamic RTP ladder tied to engagement score'
    },
    {
      icon: '🏦',
      name: 'Instant Withdrawals',
      metric: 'USDC, PayPal, SEPA',
      detail: 'Average approval in under 6 minutes, 24/7 ops team'
    }
  ];

  return (
    <div 
      ref={containerRef}
      style={styles.container}
    >

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
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          ref={(node) => {
            if (node) cardVideoRefs.current[0] = node;
          }}
          style={{ ...styles.cardVideo, ...styles.cardVideoLeft }}
        >
          <source src={yourRewardVideo} type="video/mp4" />
        </video>
        <div style={styles.cardOverlay}></div>
        <div className="card-glow" style={styles.cardGlow}></div>
        <div style={styles.cardContent}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleText}>Acquisition Operations</div>
            <div style={styles.cardSubtitle}>Creator & Attention Economy</div>
          </div>
          <div style={styles.statGrid}>
            {workStats.map((stat) => (
              <div key={stat.label} style={styles.statItem}>
                <div style={styles.statValue}>{stat.value}</div>
                <div style={styles.statLabel}>{stat.label}</div>
                <div style={styles.statDelta}>{stat.delta}</div>
              </div>
            ))}
          </div>

          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>Primary Earn Channels</span>
            <span style={styles.sectionMeta}>48% weekly inflow • Real-time QA</span>
          </div>

          <div style={styles.methodsList}>
            {workStreams.map(({ icon, name, metric, detail }) => (
              <div key={name} className="method-item" style={styles.methodItem}>
                <div style={styles.methodIcon}>{icon}</div>
                <div style={styles.methodDetails}>
                  <div style={styles.methodName}>{name}</div>
                  <div style={styles.methodMetric}>{metric}</div>
                  <div style={styles.methodDetail}>{detail}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.cardFooter}>
            <div style={styles.footerLabel}>Revenue Split</div>
            <div style={styles.footerValue}>70% returned to players</div>
            <div style={styles.footerMeta}>Independent audit every Friday</div>
          </div>
        </div>
      </motion.div>

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
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          ref={(node) => {
            if (node) cardVideoRefs.current[1] = node;
          }}
          style={{ ...styles.cardVideo, ...styles.cardVideoRight }}
        >
          <source src={yourRewardVideo} type="video/mp4" />
        </video>
        <div style={styles.cardOverlay}></div>
        <div className="card-glow" style={styles.cardGlow}></div>
        <div style={styles.cardContent}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleText}>Yield Performance</div>
            <div style={styles.cardSubtitle}>Player Treasury & Payouts</div>
          </div>
          <div style={styles.statGrid}>
            {rewardStats.map((stat) => (
              <div key={stat.label} style={styles.statItem}>
                <div style={styles.statValue}>{stat.value}</div>
                <div style={styles.statLabel}>{stat.label}</div>
                <div style={styles.statDelta}>{stat.delta}</div>
              </div>
            ))}
          </div>

          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>Upside Mechanics</span>
            <span style={styles.sectionMeta}>Live analytics • 24/7 risk desk</span>
          </div>

          <div style={styles.methodsList}>
            {rewardStreams.map(({ icon, name, metric, detail }) => (
              <div key={name} className="method-item" style={styles.methodItem}>
                <div style={styles.methodIcon}>{icon}</div>
                <div style={styles.methodDetails}>
                  <div style={styles.methodName}>{name}</div>
                  <div style={styles.methodMetric}>{metric}</div>
                  <div style={styles.methodDetail}>{detail}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.cardFooter}>
            <div style={styles.footerLabel}>Settlement</div>
            <div style={styles.footerValue}>Instant USDC / CMX bridge</div>
            <div style={styles.footerMeta}>Risk monitored 24/7 by compliance desk</div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
    minHeight: '360px',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: '0.4rem',
    padding: '2rem 0',
    marginBottom: '2rem',
    perspective: '2000px',
    transformStyle: 'preserve-3d'
  },
  flowCard: {
    position: 'relative',
    flex: '0 0 50%',
    maxWidth: '680px',
    minHeight: '340px',
    background: 'rgba(10, 15, 30, 0.6)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '2px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transformStyle: 'preserve-3d',
    overflow: 'hidden'
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
    pointerEvents: 'none',
    zIndex: 2
  },
  cardVideo: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.85,
    zIndex: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  cardVideoLeft: {
    objectPosition: '0% center'
  },
  cardVideoRight: {
    objectPosition: '100% center'
  },
  cardOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(6, 10, 22, 0.6) 0%, rgba(4, 7, 16, 0.85) 100%)',
    zIndex: 1
  },
  cardContent: {
    position: 'relative',
    zIndex: 3,
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  cardSubtitle: {
    fontSize: '0.82rem',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
    color: 'rgba(148, 163, 184, 0.85)',
    marginBottom: '0.85rem'
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(15, 23, 42, 0.45)',
    paddingBottom: '0.9rem'
  },
  cardTitleText: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: '#e2e8f0',
    textTransform: 'uppercase',
    letterSpacing: '0.75px',
    textAlign: 'left'
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '0.75rem',
    marginBottom: '1.2rem'
  },
  statItem: {
    background: 'rgba(15, 23, 42, 0.52)',
    border: '1px solid rgba(30, 41, 59, 0.8)',
    borderRadius: '12px',
    padding: '0.85rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    boxShadow: '0 6px 14px rgba(0, 0, 0, 0.2)'
  },
  statValue: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: '-0.2px'
  },
  statLabel: {
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    color: 'rgba(148, 163, 184, 0.8)',
    letterSpacing: '0.4px'
  },
  statDelta: {
    fontSize: '0.7rem',
    color: '#38bdf8',
    fontWeight: '600',
    letterSpacing: '0.25px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  sectionTitle: {
    fontSize: '0.92rem',
    fontWeight: '700',
    color: '#e2e8f0',
    letterSpacing: '0.15px'
  },
  sectionMeta: {
    fontSize: '0.7rem',
    color: 'rgba(148, 163, 184, 0.75)',
    letterSpacing: '0.25px'
  },
  methodsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    flex: 1,
    marginBottom: '1.25rem'
  },
  methodItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.9rem',
    background: 'rgba(15, 23, 42, 0.45)',
    padding: '1rem',
    borderRadius: '14px',
    border: '1px solid rgba(30, 41, 59, 0.75)',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 14px rgba(0, 0, 0, 0.22)'
  },
  methodIcon: {
    fontSize: '1.8rem',
    flexShrink: 0,
    color: '#facc15',
    filter: 'drop-shadow(0 0 12px rgba(250, 204, 21, 0.35))',
    minWidth: '1.8rem'
  },
  methodDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  methodName: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#e2e8f0',
    letterSpacing: '0.15px'
  },
  methodMetric: {
    fontSize: '0.78rem',
    color: '#fbbf24',
    fontWeight: '700',
    letterSpacing: '0.35px'
  },
  methodDetail: {
    fontSize: '0.75rem',
    color: 'rgba(148, 163, 184, 0.85)',
    lineHeight: '1.45'
  },
  cardFooter: {
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(30, 41, 59, 0.65))',
    border: '1px solid rgba(51, 65, 85, 0.8)',
    borderRadius: '12px',
    padding: '0.9rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 'auto',
    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.18)'
  },
  footerLabel: {
    fontSize: '0.68rem',
    color: 'rgba(148, 163, 184, 0.85)',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    marginBottom: '0.35rem',
    fontWeight: '600'
  },
  footerValue: {
    fontSize: '1rem',
    fontWeight: '900',
    color: '#f8fafc',
    textShadow: '0 0 16px rgba(15, 23, 42, 0.45)',
    letterSpacing: '0.4px',
    marginBottom: '0.2rem'
  },
  footerMeta: {
    fontSize: '0.68rem',
    color: 'rgba(148, 163, 184, 0.75)',
    fontWeight: '600',
    fontStyle: 'italic'
  }
};

export default AnimatedHero3D;

