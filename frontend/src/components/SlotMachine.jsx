import { useState, useEffect } from 'react';

function SlotMachine({ onSpin, result, loading }) {
  const [reel1, setReel1] = useState('🍒');
  const [reel2, setReel2] = useState('🍋');
  const [reel3, setReel3] = useState('🍊');
  const [isSpinning, setIsSpinning] = useState(false);

  const symbols = ['🍒', '🍋', '🍊', '⭐', '💎', '7️⃣'];

  useEffect(() => {
    if (result && result.reels) {
      animateReels(result.reels);
    }
  }, [result]);

  const animateReels = (finalReels) => {
    setIsSpinning(true);
    let spins = 0;
    
    const spinReel1 = setInterval(() => {
      setReel1(symbols[Math.floor(Math.random() * symbols.length)]);
      spins++;
      if (spins > 20) {
        clearInterval(spinReel1);
      }
    }, 100);
    
    setTimeout(() => {
      clearInterval(spinReel1);
      setReel1(finalReels[0]);
    }, 600);

    const spinReel2 = setInterval(() => {
      setReel2(symbols[Math.floor(Math.random() * symbols.length)]);
      spins++;
      if (spins > 20) {
        clearInterval(spinReel2);
      }
    }, 100);
    
    setTimeout(() => {
      clearInterval(spinReel2);
      setReel2(finalReels[1]);
    }, 900);

    const spinReel3 = setInterval(() => {
      setReel3(symbols[Math.floor(Math.random() * symbols.length)]);
    }, 100);
    
    setTimeout(() => {
      clearInterval(spinReel3);
      setReel3(finalReels[2]);
      setIsSpinning(false);
    }, 1200);
  };

  return (
    <div style={styles.slotMachine}>
      <div style={styles.frame}>
        <div style={styles.header}>SLOT MACHINE</div>
        
        <div style={styles.reels}>
          <div style={{...styles.reel, animation: isSpinning ? 'spin 0.1s linear infinite' : 'none'}}>
            {reel1}
          </div>
          <div style={{...styles.reel, animation: isSpinning ? 'spin 0.1s linear infinite' : 'none', animationDelay: '0.1s'}}>
            {reel2}
          </div>
          <div style={{...styles.reel, animation: isSpinning ? 'spin 0.1s linear infinite' : 'none', animationDelay: '0.2s'}}>
            {reel3}
          </div>
        </div>
        
        <div style={styles.payline}></div>
        
        {result && !isSpinning && (
          <div style={styles.result}>
            {result.result === 'win' ? '🎉 WINNER!' : 'Try Again'}
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  slotMachine: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  frame: {
    backgroundColor: '#2a1f3d',
    border: '4px solid #667eea',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)'
  },
  header: {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '1rem',
    textShadow: '0 0 10px #667eea'
  },
  reels: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  reel: {
    fontSize: '5rem',
    width: '120px',
    height: '120px',
    backgroundColor: '#1a1f3a',
    border: '3px solid #667eea',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    perspective: '1000px'
  },
  payline: {
    height: '4px',
    backgroundColor: '#ffd700',
    margin: '1rem 0',
    boxShadow: '0 0 10px #ffd700'
  },
  result: {
    textAlign: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#ffd700',
    marginTop: '1rem',
    textShadow: '0 0 20px #ffd700'
  }
};

export default SlotMachine;

