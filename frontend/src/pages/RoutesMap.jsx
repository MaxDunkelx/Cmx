import { Link } from 'react-router-dom';
import CMXLogo from '../components/CMXLogo';
import LiquidParticles from '../components/LiquidParticles';

function RoutesMap() {
  const routes = [
    {
      path: '/',
      name: 'Landing Page',
      description: 'Welcome page with platform introduction',
      features: ['Animated CMX Logo', 'Liquid Particles', 'Feature Cards', 'Call to Action'],
      icon: '🏠',
      status: '✅ Complete'
    },
    {
      path: '/login',
      name: 'Login',
      description: 'User authentication with test buttons',
      features: ['Platform Explanation', 'Reviews Slider', 'Test User/Admin Buttons', 'Liquid Glass UI'],
      icon: '🔐',
      status: '✅ Complete'
    },
    {
      path: '/register',
      name: 'Register',
      description: 'New user registration',
      features: ['Sign Up Form', 'Account Creation', 'Terms Acceptance'],
      icon: '✨',
      status: '✅ Complete'
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      description: 'User dashboard with stats and quick actions',
      features: ['Balance Display', 'Tier Status', 'Quick Actions', 'Navigation Menu'],
      icon: '📊',
      status: '✅ Complete',
      requiresAuth: true
    },
    {
      path: '/tasks',
      name: 'Tasks (Earning Hub)',
      description: 'Complete tasks to earn CMX',
      features: ['Task List', 'Completion Tracking', 'Rewards Display'],
      icon: '💼',
      status: '✅ Complete',
      requiresAuth: true
    },
    {
      path: '/games',
      name: 'Games',
      description: 'Play provably fair casino games',
      features: ['Slots', 'Roulette', 'Blackjack', 'Poker', '6 Slot Variations'],
      icon: '🎰',
      status: '✅ Complete',
      requiresAuth: true
    },
    {
      path: '/wallet',
      name: 'Wallet',
      description: 'Manage balance and withdrawals',
      features: ['Balance Card', 'Transaction History', 'Withdrawal Modal', 'Liquid Glass UI'],
      icon: '💰',
      status: '✅ Complete',
      requiresAuth: true
    },
    {
      path: '/admin',
      name: 'Admin Panel',
      description: 'Platform administration dashboard',
      features: ['User Management', 'Withdrawal Approvals', 'System Stats'],
      icon: '🛡️',
      status: '✅ Complete',
      requiresAuth: true,
      requiresAdmin: true
    },
    {
      path: '/about',
      name: 'About Us',
      description: 'Learn about the platform and mission',
      features: ['Our Mission', 'Why We\'re Different', 'Our Goal', 'Reviews Slider'],
      icon: '💎',
      status: '✅ Complete'
    }
  ];

  const publicRoutes = routes.filter(r => !r.requiresAuth);
  const protectedRoutes = routes.filter(r => r.requiresAuth && !r.requiresAdmin);
  const adminRoutes = routes.filter(r => r.requiresAdmin);

  return (
    <div style={styles.container}>
      <LiquidParticles count={30} />
      
      {/* Header */}
      <div style={styles.header}>
        <CMXLogo size="80px" animated={true} />
        <h1 style={styles.title}>Routes Map</h1>
        <p style={styles.subtitle}>Complete overview of all platform routes</p>
      </div>

      {/* Public Routes */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>🌐 Public Routes</h2>
          <span style={styles.count}>{publicRoutes.length} routes</span>
        </div>
        <div style={styles.routesGrid}>
          {publicRoutes.map((route) => (
            <Link key={route.path} to={route.path} className="glass-card" style={styles.routeCard}>
              <div style={styles.cardHeader}>
                <div style={styles.routeIcon}>{route.icon}</div>
                <div>
                  <h3 style={styles.routeName}>{route.name}</h3>
                  <div style={styles.routePath}>{route.path}</div>
                </div>
              </div>
              <p style={styles.routeDescription}>{route.description}</p>
              <div style={styles.featuresList}>
                <strong style={styles.featuresTitle}>Features:</strong>
                {route.features.map((feature, idx) => (
                  <span key={idx} style={styles.featureTag}>{feature}</span>
                ))}
              </div>
              <div style={styles.routeStatus}>{route.status}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Protected Routes */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>🔒 Protected Routes (Requires Login)</h2>
          <span style={styles.count}>{protectedRoutes.length} routes</span>
        </div>
        <div style={styles.routesGrid}>
          {protectedRoutes.map((route) => (
            <Link key={route.path} to={route.path} className="glass-card" style={styles.routeCard}>
              <div style={styles.cardHeader}>
                <div style={styles.routeIcon}>{route.icon}</div>
                <div>
                  <h3 style={styles.routeName}>{route.name}</h3>
                  <div style={styles.routePath}>{route.path}</div>
                </div>
              </div>
              <p style={styles.routeDescription}>{route.description}</p>
              <div style={styles.featuresList}>
                <strong style={styles.featuresTitle}>Features:</strong>
                {route.features.map((feature, idx) => (
                  <span key={idx} style={styles.featureTag}>{feature}</span>
                ))}
              </div>
              <div style={styles.routeStatus}>{route.status}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Admin Routes */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>🛡️ Admin Routes (Requires Admin Access)</h2>
          <span style={styles.count}>{adminRoutes.length} routes</span>
        </div>
        <div style={styles.routesGrid}>
          {adminRoutes.map((route) => (
            <Link key={route.path} to={route.path} className="glass-card" style={styles.routeCard}>
              <div style={styles.cardHeader}>
                <div style={styles.routeIcon}>{route.icon}</div>
                <div>
                  <h3 style={styles.routeName}>{route.name}</h3>
                  <div style={styles.routePath}>{route.path}</div>
                </div>
              </div>
              <p style={styles.routeDescription}>{route.description}</p>
              <div style={styles.featuresList}>
                <strong style={styles.featuresTitle}>Features:</strong>
                {route.features.map((feature, idx) => (
                  <span key={idx} style={styles.featureTag}>{feature}</span>
                ))}
              </div>
              <div style={styles.routeStatus}>{route.status}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="glass-card" style={styles.summary}>
        <h2 style={styles.summaryTitle}>📊 Route Summary</h2>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryItem}>
            <div style={styles.summaryNumber}>{routes.length}</div>
            <div style={styles.summaryLabel}>Total Routes</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={styles.summaryNumber}>{publicRoutes.length}</div>
            <div style={styles.summaryLabel}>Public</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={styles.summaryNumber}>{protectedRoutes.length}</div>
            <div style={styles.summaryLabel}>Protected</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={styles.summaryNumber}>{adminRoutes.length}</div>
            <div style={styles.summaryLabel}>Admin Only</div>
          </div>
        </div>
      </div>

      <style>{`
        .route-card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .route-card-hover:hover {
          transform: translateY(-8px);
          border-color: rgba(102, 126, 234, 0.4) !important;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '3rem 2rem',
    position: 'relative',
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '4rem'
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '800',
    color: '#fff',
    margin: '1rem 0 0.5rem',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '1.3rem',
    color: 'rgba(255,255,255,0.7)'
  },
  section: {
    marginBottom: '4rem',
    maxWidth: '1400px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid rgba(255,255,255,0.1)'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#fff'
  },
  count: {
    fontSize: '1.2rem',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600'
  },
  routesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem'
  },
  routeCard: {
    padding: '2rem',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  routeIcon: {
    fontSize: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    background: 'rgba(102, 126, 234, 0.2)',
    borderRadius: '16px'
  },
  routeName: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 0.25rem 0'
  },
  routePath: {
    fontSize: '1rem',
    color: 'rgba(102, 126, 234, 1)',
    fontWeight: '600',
    fontFamily: 'monospace'
  },
  routeDescription: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: '1.6',
    margin: 0
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  featuresTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '0.9rem'
  },
  featureTag: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    background: 'rgba(102, 126, 234, 0.2)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.8)',
    margin: '0.25rem 0.25rem 0 0'
  },
  routeStatus: {
    marginTop: 'auto',
    padding: '0.75rem',
    background: 'rgba(76, 175, 80, 0.2)',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: '700',
    color: '#4CAF50',
    fontSize: '0.9rem'
  },
  summary: {
    maxWidth: '1000px',
    margin: '4rem auto 2rem',
    padding: '3rem',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '32px',
    textAlign: 'center'
  },
  summaryTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '2rem'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem'
  },
  summaryItem: {
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px'
  },
  summaryNumber: {
    fontSize: '3rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem'
  },
  summaryLabel: {
    fontSize: '1.2rem',
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600'
  }
};

export default RoutesMap;

