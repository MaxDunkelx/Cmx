import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../components/ThemeProvider';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import walletBackground from '../../assets/images/wallet.jpg';

export default function Wallet() {
  const theme = useTheme();
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        api.get('/wallet/balance'),
        api.get('/wallet/transactions')
      ]);
      setBalance(balanceRes.data.data.balance);
      setTransactions(transactionsRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading...</div>;

  const containerStyle = {
    minHeight: '100vh',
    color: '#fff',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden'
  };

  const backgroundLayerStyle = {
    position: 'absolute',
    inset: 0,
    backgroundImage: `linear-gradient(180deg, rgba(7, 11, 28, 0.55), rgba(7, 11, 28, 0.92)), url(${walletBackground})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center top',
    backgroundColor: '#050a1e',
    filter: 'saturate(1.05)',
    zIndex: 0
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundLayerStyle} />
      <div style={{ position: 'relative', zIndex: 1 }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        margin: '0 0 2rem 0',
        background: theme.gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        💳 Your Wallet
      </h1>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: theme.gradients.card,
          backdropFilter: 'blur(40px)',
          border: `2px solid ${theme.colors.accent}40`,
          borderRadius: '24px',
          padding: '3rem',
          marginBottom: '3rem',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '1.2rem', color: theme.colors.secondary, marginBottom: '1rem' }}>
          Total Balance
        </div>
        <div style={{ fontSize: '4rem', fontWeight: '900', color: theme.colors.accent }}>
          {balance.toLocaleString()} CMX
        </div>
      </motion.div>

      {/* Transaction History */}
      <h2 style={{
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '2rem'
      }}>
        📜 Transaction History
      </h2>

      {transactions.length === 0 ? (
        <div style={{
          background: theme.gradients.card,
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '3rem',
          textAlign: 'center',
          color: '#fff9'
        }}>
          No transactions yet. Start playing games or completing tasks to see your history!
        </div>
      ) : (
        <div style={{
          background: theme.gradients.card,
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '2rem',
          display: 'grid',
          gap: '1rem'
        }}>
          {transactions.map((tx, idx) => (
            <motion.div
              key={tx._id || idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                border: tx.type === 'game_win' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                  fontSize: '2rem',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: tx.amount >= 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  borderRadius: '12px'
                }}>
                  {tx.amount >= 0 ? '💰' : '📤'}
                </div>
                <div>
                  <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>
                    {tx.description || 'Transaction'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#fff9' }}>
                    {new Date(tx.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: tx.amount >= 0 ? theme.colors.success : theme.colors.error
              }}>
                {tx.amount >= 0 ? '+' : ''}{tx.amount.toLocaleString()} CMX
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Withdrawal Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          marginTop: '3rem',
          background: theme.gradients.card,
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '2rem',
          textAlign: 'center'
        }}
      >
        <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>
          💸 Withdraw Earnings
        </h3>
        <p style={{ color: '#fff9', marginBottom: '2rem' }}>
          Your tier determines your withdrawal limit and fee percentage
        </p>
        <button style={{
          padding: '1rem 3rem',
          background: theme.colors.primary,
          border: 'none',
          borderRadius: '16px',
          color: '#fff',
          fontSize: '1.2rem',
          fontWeight: '700',
          cursor: 'pointer'
        }}>
          Request Withdrawal →
        </button>
      </motion.div>
    </div>
    </div>
  );
}
