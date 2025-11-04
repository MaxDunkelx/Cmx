import { useState, useEffect } from 'react';
import api from '../utils/api';
import Loading from '../components/Loading';

function Wallet() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawNetwork, setWithdrawNetwork] = useState('BSC');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const balanceRes = await api.get('/wallet/balance');
      setBalance(balanceRes.data.data.balance);
      
      const txRes = await api.get('/wallet/transactions');
      setTransactions(txRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setWithdrawLoading(true);
    setWithdrawMessage(null);
    
    try {
      const response = await api.post('/wallet/withdraw', {
        amount: parseInt(withdrawAmount),
        address: withdrawAddress,
        network: withdrawNetwork
      });
      setWithdrawMessage({ type: 'success', text: '✅ Withdrawal request submitted successfully!' });
      setShowWithdraw(false);
      setWithdrawAmount('');
      setWithdrawAddress('');
      fetchData();
    } catch (error) {
      setWithdrawMessage({ 
        type: 'error', 
        text: error.response?.data?.message || '❌ Withdrawal failed' 
      });
    } finally {
      setWithdrawLoading(false);
    }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div style={styles.container}>
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.header}>
        <h1 style={styles.title}>💰 Wallet</h1>
        <p style={styles.subtitle}>Manage your CMX balance and transactions</p>
      </div>
      
      <div className="glass-card" style={styles.balanceCard}>
        <div style={styles.balanceIcon}>💵</div>
        <h2 style={styles.balanceTitle}>Current Balance</h2>
        <div style={styles.balanceAmount}>{balance.toLocaleString()} CMX</div>
        <div style={styles.usdEquivalent}>≈ ${(balance / 10000 / 100).toFixed(2)} USD</div>
        
        <button 
          onClick={() => setShowWithdraw(true)} 
          className="liquid-glass-button"
          style={styles.withdrawButton}
        >
          💸 Request Withdrawal
        </button>
      </div>

      {showWithdraw && (
        <div style={styles.modal}>
          <div className="glass-card" style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>💸 Withdrawal Request</h2>
              <button 
                onClick={() => {
                  setShowWithdraw(false);
                  setWithdrawMessage(null);
                }} 
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>
            
            {withdrawMessage && (
              <div style={{
                ...styles.message,
                backgroundColor: withdrawMessage.type === 'success' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 68, 68, 0.15)',
                color: withdrawMessage.type === 'success' ? '#4CAF50' : '#ff4444',
                border: `1px solid ${withdrawMessage.type === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 68, 68, 0.3)'}`
              }}>
                {withdrawMessage.text}
              </div>
            )}

            <form onSubmit={handleWithdraw}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Amount (CMX)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Min: 10,000 CMX"
                  min="10000"
                  max={balance}
                  required
                  style={styles.input}
                />
                <p style={styles.hint}>Available: {balance.toLocaleString()} CMX</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Withdrawal Network</label>
                <select
                  value={withdrawNetwork}
                  onChange={(e) => setWithdrawNetwork(e.target.value)}
                  style={styles.select}
                >
                  <option value="BSC">BSC (Binance Smart Chain)</option>
                  <option value="ETH">Ethereum</option>
                  <option value="POLYGON">Polygon</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Wallet Address</label>
                <input
                  type="text"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  placeholder="0x..."
                  required
                  style={styles.input}
                />
                <p style={styles.hint}>Make sure to use the correct {withdrawNetwork} address</p>
              </div>

              <div style={styles.formActions}>
                <button
                  type="button"
                  onClick={() => {
                    setShowWithdraw(false);
                    setWithdrawMessage(null);
                  }}
                  className="liquid-glass-button"
                  style={styles.cancelButton}
                  disabled={withdrawLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="liquid-glass-button"
                  style={styles.submitButton}
                  disabled={withdrawLoading || parseInt(withdrawAmount) < 10000}
                >
                  {withdrawLoading ? '⏳ Processing...' : '🚀 Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={styles.transactionsSection}>
        <h2 style={styles.sectionTitle}>📜 Transaction History</h2>
        <div style={styles.transactions}>
          {transactions.map((tx, i) => (
            <div key={i} className="glass-card" style={{...styles.transaction, animation: `fadeInUp ${(i + 1) * 0.1}s ease`}}>
              <div style={styles.txIconContainer}>
                <div style={{
                  ...styles.txIcon,
                  backgroundColor: tx.type === 'credit' || tx.type === 'game_win' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 68, 68, 0.2)'
                }}>
                  {tx.type === 'credit' || tx.type === 'game_win' ? '✅' : '📤'}
                </div>
              </div>
              <div style={styles.txInfo}>
                <p style={styles.txDescription}>{tx.description}</p>
                <p style={styles.txDate}>{new Date(tx.timestamp).toLocaleString()}</p>
              </div>
              <div style={{
                ...styles.txAmount,
                color: tx.type === 'credit' || tx.type === 'game_win' ? '#4CAF50' : '#ff4444'
              }}>
                {tx.type === 'credit' || tx.type === 'game_win' ? '+' : '-'}{tx.amount.toLocaleString()} CMX
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%)',
    color: '#fff',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden'
  },
  blob1: {
    position: 'absolute',
    top: '-10%',
    right: '-5%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
    filter: 'blur(100px)',
    animation: 'float 8s ease-in-out infinite'
  },
  blob2: {
    position: 'absolute',
    bottom: '-10%',
    left: '-5%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(118, 75, 162, 0.3) 0%, transparent 70%)',
    filter: 'blur(100px)',
    animation: 'float 10s ease-in-out infinite reverse'
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
    position: 'relative',
    zIndex: 10
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'rgba(255,255,255,0.6)'
  },
  balanceCard: {
    maxWidth: '600px',
    margin: '0 auto 3rem',
    padding: '3.5rem',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    borderRadius: '28px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    position: 'relative',
    zIndex: 10,
    animation: 'fadeInUp 0.6s ease'
  },
  balanceIcon: {
    fontSize: '5rem',
    marginBottom: '1rem'
  },
  balanceTitle: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600'
  },
  balanceAmount: {
    fontSize: '4.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '1rem 0'
  },
  usdEquivalent: {
    fontSize: '1.5rem',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '2.5rem'
  },
  withdrawButton: {
    padding: '1.25rem 3rem',
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    borderRadius: '16px',
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
    backdropFilter: 'blur(10px)'
  },
  modalContent: {
    maxWidth: '550px',
    width: '100%',
    padding: '3rem',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    borderRadius: '32px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    animation: 'scaleIn 0.3s ease'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  modalTitle: {
    fontSize: '2rem',
    margin: 0,
    fontWeight: '700'
  },
  closeButton: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#fff',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.3s ease'
  },
  message: {
    padding: '1.25rem',
    borderRadius: '16px',
    marginBottom: '2rem',
    fontWeight: '500'
  },
  formGroup: {
    marginBottom: '1.75rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#fff'
  },
  input: {
    width: '100%',
    padding: '1.25rem 1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    color: '#fff',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease'
  },
  select: {
    width: '100%',
    padding: '1.25rem 1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    color: '#fff',
    fontSize: '1rem',
    boxSizing: 'border-box',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  hint: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.5)',
    marginTop: '0.5rem'
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2.5rem'
  },
  cancelButton: {
    flex: 1,
    padding: '1.25rem',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  submitButton: {
    flex: 1,
    padding: '1.25rem',
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(102, 126, 234, 0.4)',
    borderRadius: '16px',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  transactionsSection: {
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 10
  },
  sectionTitle: {
    fontSize: '2rem',
    marginBottom: '2rem',
    fontWeight: '700',
    textAlign: 'center'
  },
  transactions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  transaction: {
    padding: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  txIconContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  txIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem'
  },
  txInfo: {
    flex: 1
  },
  txDescription: {
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
    fontWeight: '600'
  },
  txDate: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.5)'
  },
  txAmount: {
    fontSize: '1.5rem',
    fontWeight: '800'
  }
};

// Add CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    .liquid-glass-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s;
    }
    .liquid-glass-button:hover::before {
      left: 100%;
    }
    .liquid-glass-button:hover {
      background: rgba(255, 255, 255, 0.12) !important;
      border-color: rgba(255, 255, 255, 0.25) !important;
      transform: translateY(-3px);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.25) !important;
    }
    .glass-card:hover {
      transform: translateY(-5px);
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }
    .transaction:hover {
      transform: translateX(10px);
      border-color: rgba(255, 255, 255, 0.2);
    }
    input:focus, select:focus {
      border-color: rgba(102, 126, 234, 0.5) !important;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1) !important;
      background: rgba(255, 255, 255, 0.08) !important;
    }
    .closeButton:hover {
      background: rgba(255, 68, 68, 0.2);
      border-color: rgba(255, 68, 68, 0.3);
    }
  `;
  document.head.appendChild(style);
}

export default Wallet;

