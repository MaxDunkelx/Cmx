import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../components/ThemeProvider';
import { motion } from 'framer-motion';
import api from '../../utils/api';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users')
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#fff' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.gradients.background, color: '#fff', padding: '2rem' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, background: theme.gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>System Manager</h1>
          <p style={{ margin: '0.5rem 0 0 0', color: theme.colors.secondary }}>Welcome, {user?.username}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '0.75rem 1.5rem', background: theme.colors.primary, border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>User View</button>
          <button onClick={logout} style={{ padding: '0.75rem 1.5rem', background: 'rgba(255, 71, 71, 0.2)', border: '1px solid rgba(255, 71, 71, 0.5)', borderRadius: '12px', color: '#ff4747', fontWeight: '600', cursor: 'pointer' }}>Logout</button>
        </div>
      </motion.div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {[{ label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥' }, { label: 'Total Balance', value: `${((stats?.totalBalance || 0) / 1000).toFixed(0)}K`, icon: '💰' }, { label: 'Pending Withdrawals', value: stats?.pendingWithdrawals || 0, icon: '📤' }].map((stat, idx) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ scale: 1.05 }} style={{ background: theme.gradients.card, backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: theme.colors.accent }}>{stat.value}</div>
            <div style={{ color: '#fff9' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>
      <div style={{ background: theme.gradients.card, backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>All Users</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {users.map((u) => (
            <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <div>
                <div style={{ fontWeight: '700' }}>{u.username}</div>
                <div style={{ color: '#fff9', fontSize: '0.9rem' }}>{u.email}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '700', color: theme.colors.accent }}>{u.balance} CMX</div>
                <div style={{ color: '#fff9', fontSize: '0.9rem' }}>Tier {u.tier}</div>
              </div>
              <button onClick={() => navigate(`/admin/users/${u._id}`)} style={{ padding: '0.5rem 1rem', background: theme.colors.primary, border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
