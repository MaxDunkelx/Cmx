import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../components/ThemeProvider';
import { motion } from 'framer-motion';
import api from '../../utils/api';

export default function Activity() {
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchActivity();
  }, [user, filter]);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/activity');
      setActivities(response.data.data);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action) => {
    const icons = {
      game_win: '🎉',
      game_loss: '🎲',
      withdrawal_request: '📤',
      withdrawal_approved: '✅',
      withdrawal_rejected: '❌',
      task_completed: '✔️',
      registration: '👤',
      login: '🔑',
      deposit: '💰',
      admin_action: '🔧'
    };
    return icons[action] || '📝';
  };

  const getActivityColor = (action) => {
    const colors = {
      game_win: '#2ed571',
      game_loss: '#ff4747',
      withdrawal_request: '#ffd700',
      withdrawal_approved: '#2ed571',
      withdrawal_rejected: '#ff4747',
      task_completed: '#667eea',
      registration: '#764ba2',
      login: '#4a90e2',
      deposit: '#2ed571',
      admin_action: '#ff9500'
    };
    return colors[action] || '#fff';
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.action === filter;
    const matchesSearch = activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  const exportToCSV = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Description', 'Amount', 'Status'].join(','),
      ...filteredActivities.map(activity => [
        new Date(activity.timestamp).toISOString(),
        activity.user,
        activity.action,
        activity.description,
        activity.amount,
        activity.status || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#fff' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.gradients.background, color: '#fff', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, background: theme.gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          📜 Activity Log
        </h1>
        <button onClick={() => navigate('/admin')} style={{ padding: '0.75rem 1.5rem', background: theme.colors.secondary, border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
          ← Back
        </button>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: theme.gradients.card,
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by user or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '1rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '1rem'
            }}
          />
          <button
            onClick={exportToCSV}
            style={{
              padding: '1rem 2rem',
              background: theme.colors.accent,
              border: 'none',
              borderRadius: '12px',
              color: '#000',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            📥 Export CSV
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {['all', 'game_win', 'game_loss', 'withdrawal_request', 'task_completed', 'registration'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              style={{
                padding: '0.75rem 1.5rem',
                background: filter === filterType ? theme.colors.accent : 'rgba(255,255,255,0.05)',
                border: `1px solid ${filter === filterType ? theme.colors.accent : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px',
                color: filter === filterType ? '#000' : '#fff',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {filterType.replace('_', ' ')}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Activity List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: theme.gradients.card,
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          overflow: 'hidden'
        }}
      >
        {paginatedActivities.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
            <p style={{ color: '#fff9', fontSize: '1.2rem' }}>No activities found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.5rem', padding: '1rem' }}>
            {paginatedActivities.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '1.5rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <div style={{ fontSize: '2.5rem' }}>{getActivityIcon(activity.action)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>
                    {activity.description}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', color: '#fff9', fontSize: '0.9rem' }}>
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{new Date(activity.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div style={{
                  textAlign: 'right',
                  color: getActivityColor(activity.action),
                  fontWeight: '700',
                  fontSize: '1.1rem'
                }}>
                  {activity.amount !== 0 && (activity.amount > 0 ? '+' : '')}{activity.amount.toLocaleString()} CMX
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '0.75rem 1.5rem',
                background: currentPage === 1 ? 'rgba(255,255,255,0.05)' : theme.colors.accent,
                border: 'none',
                borderRadius: '8px',
                color: currentPage === 1 ? '#888' : '#000',
                fontWeight: '600',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Prev
            </button>
            <div style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              fontWeight: '700'
            }}>
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '0.75rem 1.5rem',
                background: currentPage === totalPages ? 'rgba(255,255,255,0.05)' : theme.colors.accent,
                border: 'none',
                borderRadius: '8px',
                color: currentPage === totalPages ? '#888' : '#000',
                fontWeight: '600',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next →
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
