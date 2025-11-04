import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function EnhancedReviewsCarousel() {
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef(null);

  const reviews = [
    { name: 'Alex Martinez', username: '@alexm', avatar: '👨‍💼', stars: 5, cmx: '485K', usd: '48.50', text: "Just joined last week and already won 485K CMX playing slots! Withdrew $48 to test it - hit my account instantly. This is legit! 🎰", verified: true, highlight: 'New Member' },
    { name: 'Sarah Chen', username: '@sarahc', avatar: '👩‍💻', stars: 5, cmx: '892K', usd: '89.20', text: "Been here 3 weeks, earned 892K CMX from surveys and games combined. The transparency is refreshing - can verify everything! 💯", verified: true, highlight: 'Early Adopter' },
    { name: 'Marcus Johnson', username: '@marcusj', avatar: '👨‍🎓', stars: 5, cmx: '327K', usd: '32.70', text: "College student here - made 327K CMX in my first month doing surveys and watching ads. Extra $32 helps with books! 📚", verified: true, highlight: 'Student' },
    { name: 'Emma Rodriguez', username: '@emmar', avatar: '👩‍🔬', stars: 5, cmx: '615K', usd: '61.50', text: "Won 615K CMX on blackjack last weekend! Donated 100K CMX to Ocean Conservancy, kept 515K (~$51). Love this! 🌍", verified: true, highlight: 'Philanthropist' },
    { name: 'Jake Williams', username: '@jakew', avatar: '👨‍🚀', stars: 5, cmx: '1.24M', usd: '124.00', text: "Hit my first jackpot - 1.24M CMX! Couldn't believe it. Cashed out $124 immediately. Platform actually pays! 🚀", verified: true, highlight: 'Big Winner' },
    { name: 'Nina Patel', username: '@ninap', avatar: '👩‍🎨', stars: 5, cmx: '568K', usd: '56.80', text: "Made 568K CMX in 2 weeks mixing tasks and slots. Tier system boosted my earnings by 15%. Smart design! ⭐", verified: true, highlight: 'Active Player' },
    { name: 'David Kim', username: '@davidk', avatar: '👨‍💼', stars: 5, cmx: '723K', usd: '72.30', text: "Skeptical at first but earned 723K CMX. Withdrew $72 to test - instant. Revenue sharing is real! 💰", verified: true, highlight: 'Verified' },
    { name: 'Olivia Martinez', username: '@oliviam', avatar: '👩‍💼', stars: 5, cmx: '445K', usd: '44.50', text: "445K CMX in my first 10 days! Did 30 surveys, watched ads, won on roulette. Solid side income! 🎯", verified: true, highlight: 'Fast Starter' },
    { name: 'Ryan Torres', username: '@ryant', avatar: '👨‍🔧', stars: 5, cmx: '956K', usd: '95.60', text: "Earning 50K-80K CMX per day after work. Already at 956K total. Better than my old side gig! 🔧", verified: true, highlight: 'Daily Grinder' },
    { name: 'Sophia Anderson', username: '@sophiaa', avatar: '👩‍⚕️', stars: 5, cmx: '389K', usd: '38.90', text: "Nurse with limited free time. Still made 389K CMX in spare moments. Every bit helps with bills! 🏥", verified: true, highlight: 'Healthcare' },
    { name: 'Chris Evans', username: '@chrise', avatar: '👨‍🎤', stars: 5, cmx: '634K', usd: '63.40', text: "Won 634K CMX on poker this month. Provably fair means I can verify each hand. Musician approved! 🎸", verified: true, highlight: 'Musician' },
    { name: 'Isabella White', username: '@bellaw', avatar: '👩‍🏫', stars: 5, cmx: '512K', usd: '51.20', text: "Teacher here - 512K CMX earned in 3 weeks doing surveys and offers. $51 extra goes a long way! 📚", verified: true, highlight: 'Educator' },
    { name: 'Tyler Brown', username: '@tylerb', avatar: '👨‍🍳', stars: 5, cmx: '847K', usd: '84.70', text: "Made 847K CMX playing blackjack on weekends. Skill-based games let you use strategy! 🔥", verified: true, highlight: 'Weekend Player' },
    { name: 'Maya Singh', username: '@mayas', avatar: '👩‍🔬', stars: 5, cmx: '678K', usd: '67.80', text: "PhD student funding - 678K CMX so far from surveys and slots. Every withdrawal works! 🎓", verified: true, highlight: 'Scholar' },
    { name: 'Jason Lee', username: '@jasonl', avatar: '👨‍💻', stars: 5, cmx: '1.13M', usd: '113.00', text: "Developer - audited the smart contracts. Legit tech. Also earned 1.13M CMX. Win-win! 💻", verified: true, highlight: 'Tech Verified' },
    { name: 'Amanda Foster', username: '@amandaf', avatar: '👩‍✈️', stars: 5, cmx: '534K', usd: '53.40', text: "Flight attendant with layovers - perfect for earning CMX. 534K tokens in 2 weeks! ✈️", verified: true, highlight: 'Traveler' },
    { name: 'Kevin O\'Brien', username: '@kevino', avatar: '👨‍🏭', stars: 5, cmx: '456K', usd: '45.60', text: "Factory worker - 456K CMX earned after shifts. Fair games, instant payouts. What I needed! 🏭", verified: true, highlight: 'Blue Collar' },
    { name: 'Rachel Green', username: '@rachelg', avatar: '👩‍🎤', stars: 5, cmx: '789K', usd: '78.90', text: "Content creator - earned 789K CMX streaming gameplay. Audience loves the transparency! 📱", verified: true, highlight: 'Streamer' },
    { name: 'Daniel Park', username: '@danielp', avatar: '👨‍🎨', stars: 5, cmx: '598K', usd: '59.80', text: "Designer - love the UI! Made 598K CMX in 3 weeks. Platform looks great AND pays! 🎨", verified: true, highlight: 'Designer' },
    { name: 'Victoria James', username: '@victoriaj', avatar: '👩‍⚖️', stars: 5, cmx: '923K', usd: '92.30', text: "Lawyer - did my due diligence. Legal and transparent. Earned 923K CMX legitimately. Approved! ⚖️", verified: true, highlight: 'Legal Review' },
    { name: 'Brandon Smith', username: '@brandons', avatar: '👨‍🌾', stars: 5, cmx: '412K', usd: '41.20', text: "Farmer with downtime - 412K CMX in first month. Extra $41 helps with supplies! 🚜", verified: true, highlight: 'Farmer' },
    { name: 'Jasmine Ali', username: '@jasminea', avatar: '👩‍🔬', stars: 5, cmx: '867K', usd: '86.70', text: "Researcher - provably fair math checks out. Won 867K CMX fair and square. Science-backed! 🧬", verified: true, highlight: 'Scientist' },
    { name: 'Tom Anderson', username: '@toma', avatar: '👨‍🚒', stars: 5, cmx: '545K', usd: '54.50', text: "Firefighter - earned 545K CMX between shifts. Platform is reliable, payouts instant! 🔥", verified: true, highlight: 'First Responder' },
    { name: 'Elena Vasquez', username: '@elenav', avatar: '👩‍🎓', stars: 5, cmx: '378K', usd: '37.80', text: "College budget tight - 378K CMX from surveys really helps. Legit platform! 📖", verified: true, highlight: 'Student' },
    { name: 'Robert Chang', username: '@robertc', avatar: '👨‍⚕️', stars: 5, cmx: '756K', usd: '75.60', text: "Medical pro - earned 756K CMX playing poker strategically. Fits my schedule! 🏥", verified: true, highlight: 'Medical' },
    { name: 'Zoe Mitchell', username: '@zoem', avatar: '👩‍🌾', stars: 5, cmx: '489K', usd: '48.90', text: "Single mom - every CMX counts! 489K earned in spare time. Helps with groceries! 🥹", verified: true, highlight: 'Parent' },
    { name: 'Carlos Hernandez', username: '@carlosh', avatar: '👨‍🔬', stars: 5, cmx: '834K', usd: '83.40', text: "Engineer - calculated the odds. Fair! Won 834K CMX using strategy. Impressed! 📊", verified: true, highlight: 'Engineer' },
    { name: 'Hannah Kim', username: '@hannahk', avatar: '👩‍💼', stars: 5, cmx: '701K', usd: '70.10', text: "Marketing pro - 701K CMX earned in first month. Platform delivers on promises! 💯", verified: true, highlight: 'Marketer' },
    { name: 'Luis Garcia', username: '@luisg', avatar: '👨‍🍳', stars: 5, cmx: '623K', usd: '62.30', text: "Restaurant manager - 623K CMX from late-night roulette. Fun and profitable! 🍕", verified: true, highlight: 'Night Owl' },
    { name: 'Priya Sharma', username: '@priyas', avatar: '👩‍💻', stars: 5, cmx: '1.09M', usd: '109.00', text: "Software engineer - blockchain tech is solid. Earned 1.09M CMX so far. Best side income! 💻", verified: true, highlight: 'Tech Lead' },
    { name: 'Michael Torres', username: '@michaelt', avatar: '👨‍🎓', stars: 5, cmx: '567K', usd: '56.70', text: "Just discovered CMX - already at 567K tokens! Mix of gaming and tasks. Works! 🎮", verified: true, highlight: 'Rising Star' },
    { name: 'Lisa Anderson', username: '@lisaa', avatar: '👩‍💼', stars: 5, cmx: '734K', usd: '73.40', text: "Earned 734K CMX in my first 3 weeks. Platform is user-friendly and pays out! ✨", verified: true, highlight: 'New Winner' }
  ];

  // Duplicate reviews for seamless infinite scroll
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];
  const scrollPositionRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    let animationId;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      if (!isPaused) {
        const now = Date.now();
        const deltaTime = Math.min((now - lastTimeRef.current) / 16.67, 2); // normalize to 60fps
        lastTimeRef.current = now;

        scrollPositionRef.current += scrollSpeed * deltaTime;
        
        // Reset position when we've scrolled past one full set (seamless loop)
        const oneSetWidth = container.scrollWidth / 3;
        if (scrollPositionRef.current >= oneSetWidth) {
          scrollPositionRef.current = scrollPositionRef.current - oneSetWidth;
        }
        
        container.scrollLeft = scrollPositionRef.current;
      }
      
      animationId = requestAnimationFrame(animate);
    };

    // Initialize scroll position from current position
    scrollPositionRef.current = container.scrollLeft;
    lastTimeRef.current = Date.now();
    
    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPaused]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .reviews-scroll-container::-webkit-scrollbar {
        display: none;
      }
      .reviews-scroll-container {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.titleSection}
        >
          <h3 style={styles.title}>
            <span style={styles.titleIcon}>⭐</span>
            Real Winners, Real Stories, Real Money
            <span style={styles.titleIcon}>⭐</span>
          </h3>
          <p style={styles.subtitle}>Hover to pause · Auto-scrolling reviews from our community</p>
        </motion.div>
      </div>

      {/* Continuous Scrolling Carousel */}
      <div 
        ref={scrollContainerRef}
        className="reviews-scroll-container"
        style={styles.scrollContainer}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedReviews.map((review, index) => (
          <div key={index} style={styles.reviewCard}>
            {/* Card Header */}
            <div style={styles.cardHeader}>
              <div style={styles.avatar}>{review.avatar}</div>
              <div style={styles.userInfo}>
                <div style={styles.userName}>
                  {review.name}
                  {review.verified && (
                    <span style={styles.verifiedBadge}>✓</span>
                  )}
                </div>
                <div style={styles.username}>{review.username}</div>
              </div>
            </div>

            {/* Stars */}
            <div style={styles.starsContainer}>
              {'⭐'.repeat(review.stars)}
            </div>

            {/* Review Text */}
            <p style={styles.reviewText}>
              {review.text}
            </p>

            {/* Footer */}
            <div style={styles.cardFooter}>
              <div style={styles.highlightBadge}>
                <span style={styles.highlightIcon}>🏆</span>
                {review.highlight}
              </div>
              <div style={styles.earningsBadge}>
                <div style={styles.earningsLabel}>Total Earned</div>
                <div style={styles.earningsAmount}>{review.cmx} CMX</div>
                <div style={styles.earningsUsd}>~${review.usd}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={styles.statsBar}
      >
        <div style={styles.stat}>
          <span style={styles.statNumber}>2,500+</span>
          <span style={styles.statLabel}>Early Users</span>
        </div>
        <div style={styles.statDivider}></div>
        <div style={styles.stat}>
          <span style={styles.statNumber}>4.8/5</span>
          <span style={styles.statLabel}>Average Rating</span>
        </div>
        <div style={styles.statDivider}></div>
        <div style={styles.stat}>
          <span style={styles.statNumber}>187M CMX</span>
          <span style={styles.statLabel}>Paid Out (~$18.7K)</span>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    marginTop: '2rem'
  },
  header: {
    marginBottom: '1.5rem'
  },
  titleSection: {
    textAlign: 'center'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem'
  },
  titleIcon: {
    fontSize: '1.5rem',
    filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))'
  },
  subtitle: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500'
  },
  scrollContainer: {
    display: 'flex',
    gap: '1.5rem',
    overflowX: 'auto',
    overflowY: 'hidden',
    padding: '1rem 0',
    scrollBehavior: 'smooth',
    cursor: 'grab',
    userSelect: 'none'
  },
  reviewCard: {
    minWidth: '340px',
    width: '340px',
    background: 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '2px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '20px',
    padding: '1.5rem',
    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.25)',
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem'
  },
  avatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2))',
    border: '2px solid rgba(255, 215, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.6rem',
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
    flexShrink: 0
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  userName: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    lineHeight: '1.2'
  },
  verifiedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4ade80, #22c55e)',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: '900'
  },
  username: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500'
  },
  starsContainer: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
    filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))'
  },
  reviewText: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: '1.6',
    marginBottom: '1rem',
    fontWeight: '400',
    flex: 1
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: 'auto',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  },
  highlightBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    background: 'rgba(139, 92, 246, 0.15)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '16px',
    padding: '0.4rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#c084fc',
    whiteSpace: 'nowrap'
  },
  highlightIcon: {
    fontSize: '0.9rem'
  },
  earningsBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.15))',
    border: '1.5px solid rgba(255, 215, 0, 0.35)',
    borderRadius: '12px',
    padding: '0.5rem 0.75rem'
  },
  earningsLabel: {
    fontSize: '0.65rem',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600',
    marginBottom: '0.15rem'
  },
  earningsAmount: {
    fontSize: '1rem',
    fontWeight: '900',
    color: '#FFD700',
    textShadow: '0 0 12px rgba(255, 215, 0, 0.5)',
    lineHeight: '1.2'
  },
  earningsUsd: {
    fontSize: '0.7rem',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    fontStyle: 'italic',
    marginTop: '0.15rem'
  },
  statsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    marginTop: '1.5rem',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem'
  },
  statNumber: {
    fontSize: '1.2rem',
    fontWeight: '900',
    color: '#FFD700',
    textShadow: '0 0 15px rgba(255, 215, 0, 0.4)'
  },
  statLabel: {
    fontSize: '0.7rem',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600'
  },
  statDivider: {
    width: '1px',
    height: '40px',
    background: 'rgba(255, 255, 255, 0.2)'
  }
};

export default EnhancedReviewsCarousel;

