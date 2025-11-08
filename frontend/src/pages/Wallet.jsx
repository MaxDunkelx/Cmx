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
      <div style={styles.header}>
        <h1 style={styles.title}>💰 Wallet</h1>
        <p style={styles.subtitle}>Manage your CMX balance and transactions</p>
      </div>
      
      <div style={styles.balanceCard}>
        <div style={styles.balanceIcon}>💵</div>
        <h2 style={styles.balanceTitle}>Current Balance</h2>
        <p style={styles.balance}>{balance.toLocaleString()} CMX</p>
        <p style={styles.usd}>≈ ${ (balance / 10000).toFixed(2) } USD</p>
        
        <button 
          onClick={() => setShowWithdraw(true)} 
          style={styles.withdrawButton}
        >
          <span style={styles.buttonIcon}>💸</span>
          Request Withdrawal
        </button>
      </div>

      {showWithdraw && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>💸 Withdrawal Request</h2>
              <button 
                onClick={() => setShowWithdraw(false)} 
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>
            
            {withdrawMessage && (
              <div style={{
                ...styles.message,
                backgroundColor: withdrawMessage.type === 'success' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 68, 68, 0.2)',
                color: withdrawMessage.type === 'success' ? '#4CAF50' : '#ff4444',
                border: `1px solid ${withdrawMessage.type === 'success' ? '#4CAF50' : '#ff4444'}`
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
                <p style={styles.hint}>
                  Available: {balance.toLocaleString()} CMX
                </p>
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
                <p style={styles.hint}>
                  Make sure to use the correct {withdrawNetwork} address
                </p>
              </div>

              <div style={styles.formActions}>
                <button
                  type="button"
                  onClick={() => {
                    setShowWithdraw(false);
                    setWithdrawMessage(null);
                  }}
                  style={styles.cancelButton}
                  disabled={withdrawLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
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
            <div key={i} style={{...styles.transaction, animation: `fadeInUp ${(i + 1) * 0.1}s ease`}}>
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
    background: '#0a0e27',
    color: '#fff',
    minHeight: '100vh'
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem'
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
    color: '#888'
  },
  balanceCard: {
    backgroundColor: '#1a1f3a',
    padding: '3rem',
    borderRadius: '24px',
    textAlign: 'center',
    marginBottom: '3rem',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    position: 'relative',
    animation: 'fadeInUp 0.6s ease',
    overflow: 'hidden'
  },
  balanceIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  balanceTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#aaa'
  },
  balance: {
    fontSize: '4rem',
    fontWeight: 'bold',
    color: '#667eea',
    margin: '1rem 0'
  },
  usd: {
    fontSize: '1.5rem',
    color: '#888',
    marginBottom: '2rem'
  },
  withdrawButton: {
    padding: '1rem 3rem',
    backgroundColor: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.2rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '0 auto',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
  },
  buttonIcon: {
    fontSize: '1.5rem'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
    backdropFilter: 'blur(5px)'
  },
  modalContent: {
    backgroundColor: '#1a1f3a',
    borderRadius: '20px',
    padding: '2.5rem',
    maxWidth: '500px',
    width: '100%',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    animation: 'scaleIn 0.3s ease',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  modalTitle: {
    fontSize: '1.8rem',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
    width: '35px',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.3s ease'
  },
  message: {
    padding: '1rem',
    borderRadius: '10px',
    marginBottom: '1.5rem'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600'
  },
  input: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#0a0e27',
    border: '2px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease'
  },
  select: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#0a0e27',
    border: '2px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '1rem',
    boxSizing: 'border-box',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  hint: {
    fontSize: '0.9rem',
    color: '#888',
    marginTop: '0.5rem'
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem'
  },
  cancelButton: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  submitButton: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  transactionsSection: {
    marginTop: '2rem'
  },
  sectionTitle: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#fff'
  },
  transactions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  transaction: {
    backgroundColor: '#1a1f3a',
    padding: '1.5rem',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    transition: 'all 0.3s ease'
  },
  txIconContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  txIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem'
  },
  txInfo: {
    flex: 1
  },
  txDescription: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    fontWeight: '500'
  },
  txDate: {
    fontSize: '0.9rem',
    color: '#888'
  },
  txAmount: {
    fontSize: '1.3rem',
    fontWeight: 'bold'
  }
};

// Add CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    input:focus, select:focus {
      border-color: #667eea !important;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5) !important;
    }
    .transaction:hover {
      transform: translateX(5px);
      border-color: rgba(102, 126, 234, 0.5) !important;
    }
    .closeButton:hover {
      background-color: rgba(255, 68, 68, 0.2);
    }
  `;
  document.head.appendChild(style);
}

export default Wallet;
