import { useState, useEffect } from 'react';
import api from '../utils/api';

function Admin() {
  const [users, setUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('withdrawals');
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingWithdrawals: 0,
    totalWithdrawals: 0
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data.data);
        setStats(prev => ({ ...prev, totalUsers: res.data.data.length }));
      } else {
        const res = await api.get('/admin/withdrawals');
        setWithdrawals(res.data.data);
        const pending = res.data.data.filter(w => w.status === 'pending');
        setStats(prev => ({ 
          ...prev, 
          pendingWithdrawals: pending.length,
          totalWithdrawals: res.data.data.length 
        }));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/admin/withdrawals/${id}/approve`);
      setWithdrawals(withdrawals.map(w => 
        w._id === id ? { ...w, status: 'approved' } : w
      ));
      fetchData();
    } catch (error) {
      alert('Failed to approve withdrawal');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/admin/withdrawals/${id}/reject`);
      setWithdrawals(withdrawals.map(w => 
        w._id === id ? { ...w, status: 'rejected' } : w
      ));
      fetchData();
    } catch (error) {
      alert('Failed to reject withdrawal');
    }
  };

  if (loading && users.length === 0 && withdrawals.length === 0) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛡️ Admin Panel</h1>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.totalUsers}</div>
          <div style={styles.statLabel}>Total Users</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.pendingWithdrawals}</div>
          <div style={styles.statLabel}>Pending Withdrawals</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.totalWithdrawals}</div>
          <div style={styles.statLabel}>Total Withdrawals</div>
        </div>
      </div>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('withdrawals')}
          style={{...styles.tab, ...(activeTab === 'withdrawals' && styles.activeTab)}}
        >
          Withdrawals
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{...styles.tab, ...(activeTab === 'users' && styles.activeTab)}}
        >
          Users
        </button>
      </div>

      {activeTab === 'withdrawals' && (
        <div style={styles.tableContainer}>
          <h2>Withdrawal Requests</h2>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={styles.headerCell}>Date</div>
              <div style={styles.headerCell}>User</div>
              <div style={styles.headerCell}>Amount</div>
              <div style={styles.headerCell}>Network</div>
              <div style={styles.headerCell}>Address</div>
              <div style={styles.headerCell}>Status</div>
              <div style={styles.headerCell}>Actions</div>
            </div>
            {withdrawals.map((w) => (
              <div key={w._id} style={styles.tableRow}>
                <div style={styles.cell}>{new Date(w.createdAt).toLocaleDateString()}</div>
                <div style={styles.cell}>{w.user?.email || 'N/A'}</div>
                <div style={styles.cell}>{w.amount.toLocaleString()} CMX</div>
                <div style={styles.cell}>{w.network}</div>
                <div style={styles.cellAddress}>{w.address}</div>
                <div style={{
                  ...styles.cell,
                  ...(w.status === 'pending' && { color: '#ffa500' }),
                  ...(w.status === 'approved' && { color: '#4CAF50' }),
                  ...(w.status === 'rejected' && { color: '#ff4444' })
                }}>
                  {w.status.toUpperCase()}
                </div>
                <div style={styles.cellActions}>
                  {w.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(w._id)}
                        style={styles.approveButton}
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleReject(w._id)}
                        style={styles.rejectButton}
                      >
                        ✗ Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div style={styles.tableContainer}>
          <h2>User Management</h2>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={styles.headerCell}>Email</div>
              <div style={styles.headerCell}>Tier</div>
              <div style={styles.headerCell}>Balance</div>
              <div style={styles.headerCell}>Joined</div>
              <div style={styles.headerCell}>Status</div>
            </div>
            {users.map((user) => (
              <div key={user._id} style={styles.tableRow}>
                <div style={styles.cell}>{user.email}</div>
                <div style={styles.cell}>{user.tier?.toUpperCase()}</div>
                <div style={styles.cell}>{user.wallet?.balance || 0} CMX</div>
                <div style={styles.cell}>{new Date(user.createdAt).toLocaleDateString()}</div>
                <div style={styles.cell}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    background: '#0a0e27',
    color: '#fff',
    minHeight: '100vh'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    color: '#fff'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: '#1a1f3a',
    padding: '1.5rem',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #333'
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#667eea'
  },
  statLabel: {
    fontSize: '1rem',
    color: '#888',
    marginTop: '0.5rem'
  },
  tabs: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
  },
  tab: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#1a1f3a',
    color: '#fff',
    border: '2px solid #333',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600'
  },
  activeTab: {
    backgroundColor: '#667eea',
    borderColor: '#667eea'
  },
  tableContainer: {
    backgroundColor: '#1a1f3a',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #333'
  },
  table: {
    marginTop: '1rem'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr 1fr 1fr 2fr 1fr 1.5fr',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#0a0e27',
    borderRadius: '8px',
    marginBottom: '1rem'
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: '1rem'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr 1fr 1fr 2fr 1fr 1.5fr',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#0a0e27',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    alignItems: 'center'
  },
  cell: {
    fontSize: '0.9rem'
  },
  cellAddress: {
    fontSize: '0.8rem',
    color: '#888',
    wordBreak: 'break-all'
  },
  cellActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  approveButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  rejectButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ff4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600'
  }
};

export default Admin;

