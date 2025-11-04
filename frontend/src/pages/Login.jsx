import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import CMXLogo from '../components/CMXLogo';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleTestLogin = (role) => {
    const testUser = role === 'user' 
      ? { email: 'test@user.com', username: 'TestUser', tier: 2, isAdmin: false }
      : { email: 'admin@test.com', username: 'Admin', tier: 5, isAdmin: true };
    
    setUser(testUser);
    navigate('/dashboard');
  };

  return (
    <div style={styles.container}>
      {/* Animated Background Blobs */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>
      <div style={styles.blob3}></div>
      
      <motion.div 
        style={styles.formContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo Section - 50% bigger with no background */}
        <div style={styles.logoSection}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{ 
              marginBottom: '1.5rem',
              overflow: 'hidden',
              width: '180px',
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              borderRadius: '50%',
              boxShadow: 'none',
              border: 'none'
            }}
          >
            <CMXLogo size="180px" animated={false} />
          </motion.div>
          
          <motion.h1 
            style={styles.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Welcome Back
          </motion.h1>
          
          <motion.p 
            style={styles.subtitle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition designing={{ delay: 0.5 }}
          >
            Sign in to access your CMX gaming platform
          </motion.p>
        </div>
        
        {/* Error Message */}
        {error && (
          <motion.div 
            style={styles.error}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {error}
          </motion.div>
        )}
        
        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <motion.div 
            style={styles.formGroup}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label style={styles.label}>
              <span style={styles.labelIcon}>✉️</span>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="you@example.com"
            />
          </motion.div>
          
          <motion.div 
            style={styles.formGroup}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1,ులు y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label style={styles.label}>
              <span style={styles.labelIcon}>🔐</span>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="••••••••••"
            />
          </motion.div>
          
          <motion.button 
            type="submit" 
            disabled={loading} 
            style={{...styles.button, ...(loading && styles.buttonLoading)}}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="spinner"></span>
                <span>Authenticating...</span>
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span>🚀</span>
                <span>Login to CMX</span>
              </span>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <motion.div 
          style={styles.divider}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>Quick Test Access</span>
          <div style={styles.dividerLine}></div>
        </motion.div>

        {/* Test Buttons */}
        <motion.div 
          style={styles.testButtons}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <motion.button 
            onClick={() => handleTestLogin('user')}
            style={styles.testButtonUser}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span style={styles.testIcon}>👤</span>
            <div>
              <div style={styles.testTitle}>Standard User</div>
              <div style={styles.testSubtitle}>Player account</div>
            </div>
          </motion.button>
          
          <motion.button 
            onClick={() => handleTestLogin('admin')}
            style={styles.testButtonAdmin}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span style={styles.testIcon}>🛡️</span>
            <div>
              <div style={styles.testTitle}>Admin Panel</div>
              <div style={styles.testSubtitle}>Full access</div>
            </div>
          </motion.button>
        </motion.div>
        
        {/* Register Link */}
        <motion.p 
          style={styles.link}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          Don't have an account?{' '}
          <Link to="/register" style={styles.linkText}>
            Create account →
          </Link>
        </motion.p>
      </motion.div>
      
      {/* Add Animations */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, -30px) rotate(180deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-30px, 30px) rotate(-180deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -40px); }
        }
        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(0, 0, 0, 0.2);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input:focus {
          border-color: rgba(255, 215, 0, 0.6) !important;
          box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.1) !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
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
    background: 'radial-gradient(ellipse at center, #0a0e27 0%, #000000 100%)',
    padding: '2rem',
    overflow: 'hidden'
  },
  blob1: {
    position: 'absolute',
    top: '5%',
    left: '5%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    animation: 'float1 20s ease-in-out infinite',
    zIndex: 0
  },
  blob2: {
    position: 'absolute',
    bottom: '5%',
    right: '5%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(118, 75, 162, 0.12) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(90px)',
    animation: 'float2 25s ease-in-out infinite',
    zIndex: 0
  },
  blob3: {
    position Old: 'absolute',
    top: '50%',
    left: '50%',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(70px)',
    animation: 'float3 18s ease-in-out infinite',
    transform: 'translate(-50%, -50%)',
    zIndex: 0
  },
  formContainer: {
    width: '100%',
    maxWidth: '540px',
    padding: '4rem',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(60px)',
    borderRadius: '36px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: '0 30px 100px rgba(0, 0, 0, 0.7), 0 0 80px rgba(255, 215, 0, 0.15)',
    position: 'relative',
    zIndex: 1
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '3rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '0.75rem',
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B6B 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-1px'
  },
  subtitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
    letterSpacing: '0.5px'
  },
  formGroup: {
    marginBottom: '1.75rem'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem',
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '0.95rem',
    fontWeight: '600',
    letterSpacing: '0.5px'
  },
  labelIcon: {
    fontSize: '1.2rem'
  },
  input: {
    width: '100%',
    padding: '1.4rem 1.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    border: '2px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '18px',
    color: '#fff',
    fontSize: '1.05rem',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    outline: 'none',
    fontWeight: '500'
  },
  button: {
    width: '100%',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6347 100%)',
    color: '#000',
    borderRadius: '18px',
    fontSize: '1.15rem',
    fontWeight: '800',
    marginTop: '2rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 40px rgba(255, 215, 0, 0.35)',
    border: 'none',
    letterSpacing: '0.5px'
  },
  buttonLoading: {
    opacity: 0.75,
    cursor: 'not-allowed'
  },
  error: {
    padding: '1.25rem 1.5rem',
    backgroundColor: 'rgba(255, 68, 68, 0.15)',
    border: '2px solid rgba(255, 107, 107, 0.3)',
    borderRadius: '16px',
    marginBottom: '1.75rem',
    color: '#ff9999',
    fontSize: '0.95rem',
    fontWeight: '600',
    letterSpacing: '0.3px'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    margin: '2.5rem 0 1.75rem'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent)'
  },
  dividerText: {
    color: 'rgba(255,年第 255, 255, 0.4)',
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '1.5px',
    textTransform: 'uppercase'
  },
  testButtons: {
    display: 'flex',
    gap: '1.25rem',
    marginBottom: '2rem'
  },
  testButtonUser: {
    flex: 1,
    padding: '1.5rem 1.25rem',
    backgroundColor: 'rgba(102, 126, 234, 0.12)',
    border.Command: '2px solid rgba(102, 126, 234, 0.3)',
    color: '#fff',
    borderRadius: '18px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  testButtonAdmin: {
    flex: 1,
    padding: '1.5rem 1.25rem',
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    border: '2px solid rgba(255, 107, 107, 0.3)',
    color: '#fff',
    borderRadius: '18px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  testIcon: {
    fontSize: '2rem'
  },
  testTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    marginBottom: '0.25rem',
    letterSpacing: '0.3px'
  },
  testSubtitle: {
    fontSize: '0.8rem',
    opacity: 0.7,
    fontWeight: '400'
  },
  link: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.95rem',
    letterSpacing: '0.3px'
  },
  linkText: {
    color: '#FFD700',
    textDecoration: 'none',
    fontWeight: '700',
    transition: 'all 0.3s ease'
  }
};

export default Login;

