import { useState } from 'react';

function RouletteGame({ onSpin, result, loading, betAmount, setBetAmount, balance }) {
  const [selectedBet, setSelectedBet] = useState(null);
  const [betType, setBetType] = useState('color'); // 'color' or 'number'
  const [betNumber, setBetNumber] = useState(1);
  
  const numbers = Array.from({ length: 37 }, (_, i) => i); // 0-36
  const betOptions = [500, 1000, 2500, 5000];
  const colors = {
    0: 'green',
    1: 'red', 3: 'red', 5: 'red', 7: 'red', 9: 'red',
    12: 'red', 14: 'red', 16: 'red', 18: 'red', 19: 'red',
    21: 'red', 23: 'red', 25: 'red', 27: 'red',
    30: 'red', 32: 'red', 34: 'red', 36: 'red'
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎲 Roulette</h2>
      
      <div style={styles.wheelArea}>
        <div style={styles.wheel}>
          <div style={styles.wheelNumbers}>
            {numbers.map((num) => (
              <button
                key={num}
                onClick={() => betType === 'number' && setBetNumber(num)}
                style={{
                  ...styles.wheelNumber,
                  backgroundColor: colors[num] === 'red' ? '#ff4444' : colors[num] === 'green' ? '#4CAF50' : '#333',
                  ...(betNumber === num && betType === 'number' && styles.selectedNumber)
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        
        {result && result.winningNumber !== undefined && (
          <div style={styles.resultDisplay}>
            <div style={styles.winningNumber}>{result.winningNumber}</div>
            <div style={styles.resultText}>
              {result.result === 'win' ? '🎉 Winner!' : '😢 Better luck next time!'}
            </div>
          </div>
        )}
      </div>

      <div style={styles.bettingArea}>
        <div style={styles.betTypeSelector}>
          <button 
            onClick={() => setBetType('color')}
            style={{...styles.betTypeButton, ...(betType === 'color' && styles.activeBetType)}}
          >
            Bet on Color
          </button>
          <button 
            onClick={() => setBetType('number')}
            style={{...styles.betTypeButton, ...(betType === 'number' && styles.activeBetType)}}
          >
            Bet on Number
          </button>
        </div>

        {betType === 'color' && (
          <div style={styles.colorBets}>
            <button 
              onClick={() => setBetNumber(1)}
              style={{...styles.colorBetButton, ...(betNumber === 1 && styles.selectedColor)}}
            >
              🔴 RED (2x)
            </button>
            <button 
              onClick={() => setBetNumber(2)}
              style={{...styles.colorBetButton, ...(betNumber === 2 && styles.selectedColor)}}
            >
              ⚫ BLACK (2x)
            </button>
          </div>
        )}

        {betType === 'number' && (
          <div style={styles.numberSelectInfo}>
            Click on a number above to select it (35x payout)
          </div>
        )}

        <div style={styles.betAmountSelector}>
          <div style={styles.label}>Bet Amount:</div>
          <div style={styles.betButtons}>
            {betOptions.map((bet) => (
              <button
                key={bet}
                onClick={() => setBetAmount(bet)}
                style={{
                  ...styles.betButton,
                  ...(betAmount === bet && styles.activeBetButton)
                }}
                disabled={loading}
              >
                {bet.toLocaleString()} CMX
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && !result.error && (
        <div style={styles.resultCard}>
          {result.winAmount > 0 ? (
            <>
              <div style={styles.winAmount}>+{result.winAmount.toLocaleString()} CMX</div>
              <div style={styles.winMessage}>You Won!</div>
            </>
          ) : (
            <div style={styles.loseMessage}>Try Again!</div>
          )}
        </div>
      )}

      <button 
        onClick={() => onSpin({ betAmount, betType, betNumber })}
        disabled={loading || betAmount > balance || !selectedBet}
        style={{
          ...styles.spinButton,
          ...((loading || betAmount > balance || !selectedBet) && styles.spinButtonDisabled)
        }}
      >
        {loading ? '⏳ Spinning...' : '🎲 SPIN'}
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem'
  },
  wheelArea: {
    marginBottom: '2rem'
  },
  wheel: {
    backgroundColor: '#0a0e27',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid #667eea'
  },
  wheelNumbers: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '0.5rem'
  },
  wheelNumber: {
    padding: '0.75rem',
    border: '1px solid #555',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  selectedNumber: {
    border: '3px solid #ffd700',
    boxShadow: '0 0 15px #ffd700'
  },
  resultDisplay: {
    marginTop: '1rem',
    padding: '1rem'
  },
  winningNumber: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#ffd700'
  },
  resultText: {
    fontSize: '1.5rem',
    marginTop: '0.5rem'
  },
  bettingArea: {
    marginBottom: '2rem'
  },
  betTypeSelector: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem'
  },
  betTypeButton: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#0a0e27',
    border: '2px solid #333',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600'
  },
  activeBetType: {
    backgroundColor: '#667eea',
    borderColor: '#667eea'
  },
  colorBets: {
    display: 'flex',
    gap: '1rem'
  },
  colorBetButton: {
    flex: 1,
    padding: '1.5rem',
    backgroundColor: '#0a0e27',
    border: '2px solid #333',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: '600'
  },
  selectedColor: {
    border: '3px solid #ffd700',
    boxShadow: '0 0 20px #ffd700'
  },
  numberSelectInfo: {
    padding: '1rem',
    backgroundColor: '#0a0e27',
    borderRadius: '8px',
    marginBottom: '1rem',
    color: '#aaa'
  },
  betAmountSelector: {
    marginTop: '1rem'
  },
  label: {
    fontSize: '1.1rem',
    marginBottom: '0.75rem'
  },
  betButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem'
  },
  betButton: {
    padding: '1rem',
    backgroundColor: '#0a0e27',
    border: '2px solid #333',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600'
  },
  activeBetButton: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
    boxShadow: '0 0 15px rgba(102, 126, 234, 0.5)'
  },
  resultCard: {
    backgroundColor: '#0a0e27',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1rem'
  },
  winAmount: {
    fontSize: '2.5rem',
    color: '#4CAF50',
    fontWeight: 'bold'
  },
  winMessage: {
    fontSize: '1.5rem',
    color: '#4CAF50',
    marginTop: '0.5rem'
  },
  loseMessage: {
    fontSize: '1.5rem',
    color: '#ff4444'
  },
  spinButton: {
    width: '100%',
    padding: '1.5rem',
    backgroundColor: '#667eea',
    color: '#fff',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    borderRadius: '12px',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 0 30px rgba(102, 126, 234, 0.5)'
  },
  spinButtonDisabled: {
    backgroundColor: '#333',
    cursor: 'not-allowed',
    boxShadow: 'none'
  }
};

export default RouletteGame;

