import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../components/ThemeProvider';
import { motion } from 'framer-motion';
import api from '../../utils/api';

export default function Economy() {
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#fff' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: theme.gradients.background, color: '#fff', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, background: theme.gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          📊 Economy Overview
        </h1>
        <button onClick={() => navigate('/admin')} style={{ padding: '0.75rem 1.5rem', background: theme.colors.secondary, border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
          ← Back to Admin
        </button>
      </div>

      {/* Main Financial Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {[
          { label: 'Platform Revenue', value: `${((stats?.platformRevenue || 0) / 1000).toFixed(1)}K CMX`, icon: '💵', color: theme.colors.success },
          { label: 'User Total Earnings', value: `${((stats?.userTotalEarnings || 0) / 1000).toFixed(1)}K CMX`, icon: '💸', color: theme.colors.primary },
          { label: 'Estimated Ad Revenue', value: `${((stats?.estimatedAdRevenue || 0) / 1000).toFixed(1)}K CMX`, icon: '📢', color: theme.colors.accent },
          { label: 'Net Profit', value: `${((stats?.netProfit || 0) / 1000).toFixed(1)}K CMX`, icon: '📈', color: theme.colors.success }
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            style={{
              background: theme.gradients.card,
              backdropFilter: 'blur(40px)',
              border: `2px solid ${stat.color}40`,
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: stat.color, marginBottom: '0.5rem' }}>
              {stat.value}
            </div>
            <div style={{ color: '#fff9' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Game Statistics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '2rem', 
        marginBottom: '2rem' 
      }}>
        {[
          { label: 'Total Slots Spins', value: (stats?.gameStats?.slots || 0).toLocaleString(), icon: '🎰', color: '#f59e0b' },
          { label: 'Total Roulette Spins', value: (stats?.gameStats?.roulette || 0).toLocaleString(), icon: '🎲', color: '#ef4444' },
          { label: 'Total Blackjack Games', value: (stats?.gameStats?.blackjack || 0).toLocaleString(), icon: '🃏', color: '#10b981' },
          { label: 'Total Poker Hands', value: (stats?.gameStats?.poker || 0).toLocaleString(), icon: '♠️', color: '#3b82f6' }
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            style={{
              background: theme.gradients.card,
              backdropFilter: 'blur(40px)',
              border: `2px solid ${stat.color}40`,
              borderRadius: '20px',
              padding: '1.5rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: stat.color, marginBottom: '0.5rem' }}>
              {stat.value}
            </div>
            <div style={{ color: '#fff9', fontSize: '0.9rem' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ background: theme.gradients.card, backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>💰 Complete Financial Breakdown</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem' }}>📊 Platform Revenue Sources</h3>
            <div style={{ color: '#fff9', lineHeight: '2' }}>
              <p>• Game Revenue: {((stats?.platformRevenue || 0) / 1000).toFixed(1)}K CMX</p>
              <p>• Estimated Ad Revenue: {((stats?.estimatedAdRevenue || 0) / 1000).toFixed(1)}K CMX</p>
              <p>• Total Bets: {((stats?.gameBetsTotal || 0) / 1000).toFixed(1)}K CMX</p>
              <p>• Total Payouts: {((stats?.gamePayoutsTotal || 0) / 1000).toFixed(1)}K CMX</p>
              <p>• House Edge: {stats?.houseEdgePercentage || 0}%</p>
              <p>• Net Profit: {((stats?.netProfit || 0) / 1000).toFixed(1)}K CMX</p>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem' }}>👥 User Metrics</h3>
            <div style={{ color: '#fff9', lineHeight: '2' }}>
              <p>• Total Registered Users: {stats?.totalUsers || 0}</p>
              <p>• Active Users (7d): {stats?.activeUsers || 0}</p>
              <p>• New Users Today: {stats?.newUsersToday || 0}</p>
              <p>• Average Tier Level: {stats?.avgTier?.toFixed(1) || '1.0'}</p>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem' }}>📊 Transaction Stats</h3>
            <div style={{ color: '#fff9', lineHeight: '2' }}>
              <p>• Total Transactions: {(stats?.totalTransactions || 0).toLocaleString()}</p>
              <p>• Today's Transactions: {stats?.transactionsToday || 0}</p>
              <p>• Tasks Completed: {(stats?.tasksCompleted || 0).toLocaleString()}</p>
              <p>• Total Winnings: {((stats?.totalWinnings || 0) / 1000).toFixed(1)}K CMX</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
