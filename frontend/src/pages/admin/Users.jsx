import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../components/ThemeProvider';
import { motion } from 'framer-motion';
import api from '../../utils/api';

export default function Users() {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [editData, setEditData] = useState({ balance: 0, tier: 1, notes: '' });

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      console.log('🔵 Fetching users from /admin/users');
      const response = await api.get('/admin/users');
      console.log('🔵 Full response:', response);
      console.log('🔵 Response data:', response.data);
      console.log('🔵 Users array:', response.data.data);
      
      if (response.data && response.data.data) {
        setUsers(response.data.data);
        console.log('✅ Users set successfully:', response.data.data.length, 'users');
      } else {
        console.error('❌ Invalid response structure:', response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch users:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      alert(`Failed to load users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (userId, banStatus) => {
    if (!confirm(banStatus ? 'Ban this user?' : 'Unban this user?')) return;
    
    try {
      await api.post(`/admin/user/${userId}/${banStatus ? 'ban' : 'unban'}`);
      alert(`User ${banStatus ? 'banned' : 'unbanned'} successfully`);
      fetchUsers();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const handleDelete = async (userId, username) => {
    if (!confirm(`Delete user "${username}"? This cannot be undone!`)) return;
    
    try {
      await api.delete(`/admin/user/${userId}`);
      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditData({ balance: user.balance, tier: user.tier, notes: user.notes || '' });
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    try {
      await api.put(`/admin/user/${selectedUser._id}`, editData);
      alert('User updated successfully');
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      alert('Failed to update user');
    }
  };

  const handleAdjustBalance = (user) => {
    setSelectedUser(user);
    setEditData({ amount: 0, reason: '' });
    setShowBalanceModal(true);
  };

  const applyBalanceAdjustment = async () => {
    if (!editData.reason.trim()) {
      alert('Please provide a reason');
      return;
    }
    
    try {
      await api.post(`/admin/user/${selectedUser._id}/adjust-balance`, {
        amount: editData.amount,
        reason: editData.reason
      });
      alert('Balance adjusted successfully');
      setShowBalanceModal(false);
      fetchUsers();
    } catch (error) {
      alert('Failed to adjust balance');
    }
  };

  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
    setLoadingDetails(true);
    try {
      const response = await api.get(`/admin/user/${user._id}`);
      setUserDetails(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      alert('Failed to load user details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredUsers = users.filter(u => 
    searchQuery === '' ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#fff' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: theme.gradients.background, color: '#fff', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, background: theme.gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          👥 User Management
        </h1>
        <button onClick={() => navigate('/admin')} style={{ padding: '0.75rem 1.5rem', background: theme.colors.secondary, border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
          ← Back to Admin
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="🔍 Search by username or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '500px',
            padding: '1rem 1.5rem',
            background: theme.gradients.card,
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            color: '#fff',
            fontSize: '1rem'
          }}
        />
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: theme.gradients.card, backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: theme.colors.primary }}>{users.length}</div>
          <div style={{ color: '#fff9' }}>Total Users</div>
        </div>
        <div style={{ background: theme.gradients.card, backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: theme.colors.success }}>{users.filter(u => !u.isBanned).length}</div>
          <div style={{ color: '#fff9' }}>Active Users</div>
        </div>
        <div style={{ background: theme.gradients.card, backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: theme.colors.error }}>{users.filter(u => u.isBanned).length}</div>
          <div style={{ color: '#fff9' }}>Banned Users</div>
        </div>
      </div>

      {/* Users Table */}
      <div style={{ background: theme.gradients.card, backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>User</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Tier</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Balance</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Games</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>
                  {u.isBanned ? (
                    <span style={{ background: '#ff3b30', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem' }}>🚫 Banned</span>
                  ) : (
                    <span style={{ background: '#34c759', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem' }}>✓ Active</span>
                  )}
                </td>
                <td style={{ padding: '1rem', fontWeight: '700' }}>{u.username}</td>
                <td style={{ padding: '1rem', color: '#fff9', fontSize: '0.9rem' }}>{u.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ background: theme.colors.accent, color: '#000', padding: '0.25rem 0.75rem', borderRadius: '8px', fontWeight: '700' }}>
                    T{u.tier}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700', color: theme.colors.accent }}>
                  {u.balance.toLocaleString()} CMX
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>{u.gamesPlayed || 0}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                      onClick={() => handleViewDetails(u)}
                      style={{ padding: '0.5rem 1rem', background: theme.colors.secondary, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => handleEdit(u)}
                      style={{ padding: '0.5rem 1rem', background: theme.colors.primary, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleBan(u._id, !u.isBanned)}
                      style={{ padding: '0.5rem 1rem', background: u.isBanned ? theme.colors.success : '#ff3b30', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      {u.isBanned ? '✓ Unban' : '🚫 Ban'}
                    </button>
                    <button
                      onClick={() => handleAdjustBalance(u)}
                      style={{ padding: '0.5rem 1rem', background: theme.colors.accent, border: 'none', borderRadius: '8px', color: '#000', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      💰 Balance
                    </button>
                    {!u.isAdmin && (
                      <button
                        onClick={() => handleDelete(u._id, u.username)}
                        style={{ padding: '0.5rem 1rem', background: '#ff3b30', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: theme.gradients.card,
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ marginTop: 0 }}>Edit User: {selectedUser.username}</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Balance (CMX)</label>
              <input
                type="number"
                value={editData.balance}
                onChange={(e) => setEditData({...editData, balance: parseInt(e.target.value)})}
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tier (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={editData.tier}
                onChange={(e) => setEditData({...editData, tier: parseInt(e.target.value)})}
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Notes</label>
              <textarea
                value={editData.notes}
                onChange={(e) => setEditData({...editData, notes: e.target.value})}
                rows="3"
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={saveEdit} style={{ flex: 1, padding: '1rem', background: theme.colors.success, border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                ✓ Save
              </button>
              <button onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: '1rem', background: theme.colors.error, border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Balance Adjustment Modal */}
      {showBalanceModal && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: theme.gradients.card,
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ marginTop: 0 }}>Adjust Balance: {selectedUser.username}</h2>
            <p style={{ color: '#fff9', marginBottom: '1.5rem' }}>Current Balance: {selectedUser.balance.toLocaleString()} CMX</p>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Amount (positive to add, negative to deduct)</label>
              <input
                type="number"
                value={editData.amount}
                onChange={(e) => setEditData({...editData, amount: parseInt(e.target.value)})}
                placeholder="e.g., 1000 or -1000"
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Reason *</label>
              <textarea
                value={editData.reason}
                onChange={(e) => setEditData({...editData, reason: e.target.value})}
                rows="3"
                placeholder="Provide a reason for this adjustment"
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={applyBalanceAdjustment} style={{ flex: 1, padding: '1rem', background: theme.colors.accent, border: 'none', borderRadius: '12px', color: '#000', fontWeight: '700', cursor: 'pointer' }}>
                ✓ Apply
              </button>
              <button onClick={() => setShowBalanceModal(false)} style={{ flex: 1, padding: '1rem', background: theme.colors.error, border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showDetailModal && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: theme.gradients.card,
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '2rem',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0 }}>User Details: {selectedUser.username}</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {loadingDetails ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
            ) : userDetails ? (
              <>
                {/* Basic Info */}
                <div style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>👤 Basic Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div>
                      <div style={{ color: '#fff9', marginBottom: '0.25rem' }}>Username</div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{userDetails.username}</div>
                    </div>
                    <div>
                      <div style={{ color: '#fff9', marginBottom: '0.25rem' }}>Email</div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{userDetails.email}</div>
                    </div>
                    <div>
                      <div style={{ color: '#fff9', marginBottom: '0.25rem' }}>User ID</div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem', fontFamily: 'monospace' }}>{userDetails._id}</div>
                    </div>
                    <div>
                      <div style={{ color: '#fff9', marginBottom: '0.25rem' }}>Admin Status</div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{userDetails.isAdmin ? '✅ Yes' : '❌ No'}</div>
                    </div>
                    <div>
                      <div style={{ color: '#fff9', marginBottom: '0.25rem' }}>Account Status</div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{userDetails.isBanned ? '🚫 Banned' : '✅ Active'}</div>
                    </div>
                    <div>
                      <div style={{ color: '#fff9', marginBottom: '0.25rem' }}>Tier</div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>Tier {userDetails.tier}</div>
                    </div>
                  </div>
                </div>

                {/* Financial Info */}
                <div style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>💰 Financial Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <div style={{ color: '#fff9', marginBottom: '0.25rem' }}>Balance</div>
                      <div style={{ fontWeight: '700', fontSize: '1.3rem', color: theme.colors.accent }}>{userDetails.balance.toLocaleString()} CMX</div>
                    </div>
                    <div>
                      <div style={{ color: '#fff9', marginBottom: '0.25rem' }}>Total Earned</div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{(userDetails.totalEarned || 0).toLocaleString()} CMX</div>
                    </div>
                    <div>
                      <div style={{ color: '#fff9', marginBottom: '0.25rem' }}>Total Withdrawn</div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{(userDetails.totalWithdrawn || 0).toLocaleString()} CMX</div>
                    </div>
                  </div>
                </div>

                {/* Activity Stats */}
                <div style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>📊 Activity Statistics</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <div style={{ color: '#fff9', marginBottom: '0.25rem' }}>Games Played</div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{(userDetails.gamesPlayed || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ color: '#fff9', marginBottom: '0.25rem' }}>Games Won</div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{(userDetails.gamesWon || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ color: '#fff9', marginBottom: '0.25rem' }}>Tasks Completed</div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{(userDetails.tasksCompleted || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ color: '#fff9', marginBottom: '0.25rem' }}>Created</div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{new Date(userDetails.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div style={{ color: '#fff9', marginBottom: '0.25rem' }}>Last Login</div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{new Date(userDetails.lastLogin).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                {/* Transactions */}
                {userDetails.transactions && userDetails.transactions.length > 0 && (
                  <div style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>📝 Recent Transactions ({userDetails.transactions.length})</h3>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {userDetails.transactions.slice(0, 10).map((tx, idx) => (
                        <div key={idx}
                          style={{
                            padding: '1rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            marginBottom: '0.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '700' }}>{tx.description}</div>
                            <div style={{ color: '#fff9', fontSize: '0.85rem' }}>{new Date(tx.timestamp).toLocaleString()}</div>
                          </div>
                          <div style={{ fontWeight: '700', color: tx.amount >= 0 ? theme.colors.success : theme.colors.error }}>
                            {tx.amount >= 0 ? '+' : ''}{tx.amount.toLocaleString()} CMX
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Game Sessions */}
                {userDetails.gameSessions && userDetails.gameSessions.length > 0 && (
                  <div style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>🎮 Game Sessions ({userDetails.gameSessions.length})</h3>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {userDetails.gameSessions.slice(0, 10).map((session, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '1rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            marginBottom: '0.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '700' }}>{session.gameType} - {session.result}</div>
                            <div style={{ color: '#fff9', fontSize: '0.85rem' }}>{new Date(session.timestamp).toLocaleString()}</div>
                          </div>
                          <div style={{ fontWeight: '700', color: session.result === 'win' ? theme.colors.success : theme.colors.error }}>
                            {session.result === 'win' ? '+' : '-'}{Math.abs(session.winAmount - session.betAmount).toLocaleString()} CMX
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {userDetails.notes && (
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>📄 Notes</h3>
                    <div style={{ color: '#fff9' }}>{userDetails.notes}</div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>No details available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
