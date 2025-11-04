import React from 'react';

function BetSelector({ betAmount, setBetAmount, betOptions, disabled }) {
  return (
    <div style={styles.container}>
      <div style={styles.label}>Select Your Bet:</div>
      <div style={styles.betGrid}>
        {betOptions.map((bet) => (
          <button
            key={bet}
            onClick={() => setBetAmount(bet)}
            style={{
              ...styles.betButton,
              ...(betAmount === bet && styles.activeBetButton)
            }}
            disabled={disabled}
          >
            {bet.toLocaleString()} CMX
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: '2rem'
  },
  label: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    fontWeight: '600',
    textAlign: 'center'
  },
  betGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem'
  },
  betButton: {
    padding: '1rem',
    backgroundColor: '#0a0e27',
    color: '#fff',
    border: '2px solid #333',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  activeBetButton: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
    boxShadow: '0 0 15px rgba(102, 126, 234, 0.5)'
  }
};

export default BetSelector;

