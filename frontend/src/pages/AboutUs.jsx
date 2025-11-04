import { useEffect } from 'react';
import CMXLogo from '../components/CMXLogo';
import LiquidParticles from '../components/LiquidParticles';
import ReviewsSlider from '../components/ReviewsSlider';

function AboutUs() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={styles.container}>
      <LiquidParticles count={30} />
      
      {/* Hero Section */}
      <div style={styles.hero}>
        <CMXLogo size="100px" animated={true} />
        <h1 style={styles.heroTitle}>The Future of Gaming & Earning</h1>
        <p style={styles.heroSubtitle}>
          Where transparency meets innovation. Experience the revolution.
        </p>
      </div>

      {/* Our Mission */}
      <div className="glass-card fade-in-up" style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionIcon}>🎯</div>
          <h2 style={styles.sectionTitle}>Our Mission</h2>
        </div>
        <p style={styles.sectionText}>
          At CMX, we're revolutionizing the gaming and earning landscape. We believe that when 
          you win, we should win together. Our mission is to create a transparent, fair, and 
          profitable platform where every user can earn cryptocurrency while enjoying world-class 
          provably fair casino games.
        </p>
      </div>

      {/* Why We're Different */}
      <div className="glass-card fade-in-up" style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionIcon}>✨</div>
          <h2 style={styles.sectionTitle}>Why We're Different</h2>
        </div>
        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>💰</div>
            <h3 style={styles.featureTitle}>Profit Sharing</h3>
            <p style={styles.featureText}>
              We share platform profits with you based on your tier. The more you engage, 
              the more you earn. It's that simple.
            </p>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🔒</div>
            <h3 style={styles.featureTitle}>Provably Fair</h3>
            <p style={styles.featureText}>
              Every game result is cryptographically verifiable. We use blockchain-grade 
              randomness to ensure 100% fairness.
            </p>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🚀</div>
            <h3 style={styles.featureTitle}>Instant Withdrawals</h3>
            <p style={styles.featureText}>
              Withdraw your earnings instantly to your crypto wallet. No waiting, 
              no delays, no complications.
            </p>
          </div>
        </div>
      </div>

      {/* Our Goal */}
      <div className="glass-card fade-in-up" style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionIcon}>🎯</div>
          <h2 style={styles.sectionTitle}>Our Goal</h2>
        </div>
        <p style={styles.goalText}>
          We envision a world where gaming platforms aren't just about entertainment, 
          but about creating real value for everyone involved. Our goal is to build the 
          most trusted, transparent, and profitable gaming ecosystem in the world.
        </p>
        <div style={styles.goalStats}>
          <div style={styles.stat}>
            <div style={styles.statNumber}>100,000+</div>
            <div style={styles.statLabel}>Active Users</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>$50M+</div>
            <div style={styles.statLabel}>Paid Out</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>99.9%</div>
            <div style={styles.statLabel}>Uptime</div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ReviewsSlider />

      {/* Call to Action */}
      <div className="glass-card fade-in-up" style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to Experience the Future?</h2>
        <p style={styles.ctaText}>
          Join thousands of users earning cryptocurrency through fair gaming and profit sharing.
        </p>
        <a href="/register" className="liquid-glass-button" style={styles.ctaButton}>
          🚀 Get Started Now
        </a>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '3rem 2rem',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%)'
  },
  hero: {
    textAlign: 'center',
    marginBottom: '4rem',
    paddingTop: '2rem'
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginTop: '1rem',
    marginBottom: '1rem'
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    color: 'rgba(255,255,255,0.7)',
    maxWidth: '700px',
    margin: '0 auto'
  },
  section: {
    maxWidth: '1000px',
    margin: '0 auto 3rem',
    padding: '3rem',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '32px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    opacity: 0
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem'
  },
  sectionIcon: {
    fontSize: '3rem'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#fff'
  },
  sectionText: {
    fontSize: '1.2rem',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: '1.8'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginTop: '2rem'
  },
  feature: {
    textAlign: 'center'
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '1rem'
  },
  featureText: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: '1.6'
  },
  goalText: {
    fontSize: '1.3rem',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: '1.8',
    marginBottom: '3rem',
    textAlign: 'center'
  },
  goalStats: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '2rem',
    flexWrap: 'wrap'
  },
  stat: {
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '3rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem'
  },
  statLabel: {
    fontSize: '1.2rem',
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600'
  },
  cta: {
    maxWidth: '800px',
    margin: '4rem auto 0',
    padding: '4rem 3rem',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '2px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '32px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    opacity: 0
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '1rem'
  },
  ctaText: {
    fontSize: '1.3rem',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '2rem'
  },
  ctaButton: {
    display: 'inline-block',
    padding: '1.5rem 4rem',
    background: 'rgba(102, 126, 234, 0.3)',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(102, 126, 234, 0.4)',
    borderRadius: '20px',
    color: '#fff',
    fontSize: '1.3rem',
    fontWeight: '700',
    textDecoration: 'none',
    transition: 'all 0.3s ease'
  }
};

export default AboutUs;

