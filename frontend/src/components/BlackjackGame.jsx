import { useState } from 'react';

function BlackjackGame({ onPlay, result, loading, betAmount, setBetAmount, balance }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [deck, setDeck] = useState([]);
  
  const betOptions = [500, 1000, 2500, 5000];
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const getCardDisplay = (card) => {
    const [rank, suit] = card.match(/[A2-9JQK]|10|[♠♥♦♣]/g) || [card[0], card[1]];
    return `${rank}${suit}`;
  };

  const calculateHandValue = (hand) => {
    let value = 0;
    let aces = 0;
    
    for (const card of hand) {
      const rank = card[0];
      if (rank === 'A') {
        aces++;
        value += 11;
      } else if (['J', 'Q', 'K'].includes(rank)) {
        value += 10;
      } else {
        value += parseInt(rank) || 0;
      }
    }
    
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    
    return value;
  };

  // Create fresh 52-card deck
  const createDeck = () => {
    const newDeck = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        newDeck.push(rank + suit);
      }
    }
    return newDeck;
  };

  // Crypto-secure shuffle using Fisher-Yates
  const shuffleDeck = (deckToShuffle) => {
    const shuffled = [...deckToShuffle];
    // Use crypto.getRandomValues for secure random
    const getSecureRandom = (resource) => {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return array[0] / (0xFFFFFFFF + 1);
    };
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(getSecureRandom() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Deal card from deck
  const dealCard = (currentDeck) => {
    if (currentDeck.length === 0) {
      // Shuffle new deck if empty
      const freshDeck = shuffleDeck(createDeck());
      setDeck(freshDeck);
      return freshDeck[0];
    }
    const card = currentDeck[0];
    setDeck(currentDeck.slice(1));
    return card;
  };

  const startGame = () => {
    // Create and shuffle deck
    const freshDeck = shuffleDeck(createDeck());
    setDeck(freshDeck);
    
    // Deal 2 cards to player, 2 to dealer
    const newPlayerHand = [freshDeck[0], freshDeck[1]];
    const newDealerHand = [freshDeck[2], freshDeck[3]];
    
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setGameStarted(true);
    setGameOver(false);
    setDeck(freshDeck.slice(4)); // Remove dealt cards from deck
  };

  const hit = async () => {
    // Deal card from deck
    const newCard = deck[0];
    if (!newCard) return; // Safety check
    
    const updatedDeck = deck.slice(1);
    setDeck(updatedDeck);
    
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    
    // Check for bust
    if (calculateHandValue(newHand) > 21) {
      // Auto stand on bust
      await stand(newHand);
    }
  };

  const stand = async (hand = playerHand) => {
    if (betAmount > balance) return;
    
    // Dealer AI: hit until 17 or higher
    let dealerHands = [...dealerHand];
    let currentDeck = [...deck];
    
    while (calculateHandValue(dealerHands) < 17) {
      if (currentDeck.length === 0) {
        // Reshuffle if deck is empty
        const freshDeck = shuffleDeck(createDeck());
        currentDeck = freshDeck;
      }
      dealerHands.push(currentDeck[0]);
      currentDeck = currentDeck.slice(1);
    }
    
    setDealerHand(dealerHands);
    setDeck(currentDeck);
    
    await onPlay({
      betAmount,
      playerHand: hand,
      dealerHand: dealerHands
    });
    
    setGameOver(true);
  };

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🃏 Blackjack</h2>

      {!gameStarted ? (
        <div style={styles.startArea}>
          <div style={styles.betSelector}>
            <div style={styles.label}>Select Your Bet:</div>
            <div style={styles.betButtons}>
              {betOptions.map((bet) => (
                <button
                  key={bet}
                  onClick={() => setBetAmount(bet)}
                  style={{
                    ...styles.betButton,
                    ...(betAmount === bet && styles.activeBetButton)
                  }}
                >
                  {bet.toLocaleString()} CMX
                </button>
              ))}
            </div>
          </div>
          <button onClick={startGame} style={styles.dealButton}>
            🃏 DEAL
          </button>
        </div>
      ) : (
        <div>
          <div style={styles.gameArea}>
            <div style={styles.handSection}>
              <h3>Dealer Hand ({gameOver ? dealerValue : '?'})</h3>
              <div style={styles.hand}>
                {dealerHand.map((card, i) => (
                  <div key={i} style={styles.card}>
                    {i === 1 && !gameOver ? '??' : getCardDisplay(card)}
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.handSection}>
              <h3>Your Hand ({playerValue})</h3>
              <div style={styles.hand}>
                {playerHand.map((card, i) => (
                  <div key={i} style={styles.card}>
                    {getCardDisplay(card)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {playerValue > 21 && (
            <div style={styles.resultCard}>
              <div style={styles.loseMessage}>💥 BUST!</div>
            </div>
          )}

          {result && result.result && (
            <div style={styles.resultCard}>
              {result.result === 'win' && (
                <>
                  <div style={styles.winAmount}>+{result.winAmount.toLocaleString()} CMX</div>
                  <div style={styles.winMessage}>🎉 You Won!</div>
                </>
              )}
              {result.result === 'loss' && (
                <div style={styles.loseMessage}>😢 You Lost!</div>
              )}
              {result.result === 'draw' && (
                <div style={styles.drawMessage}>🤝 Push! (Draw)</div>
              )}
            </div>
          )}

          <div style={styles.actionButtons}>
            {!gameOver && (
              <>
                <button 
                  onClick={hit} 
                  disabled={playerValue >= 21}
                  style={{
                    ...styles.actionButton,
                    ...(playerValue >= 21 && styles.buttonDisabled)
                  }}
                >
                  Hit
                </button>
                <button onClick={() => stand()} style={styles.actionButton}>
                  Stand
                </button>
              </>
            )}
            {(gameOver || result) && (
              <button onClick={() => {
                setGameStarted(false);
                setGameOver(false);
                setPlayerHand([]);
                setDealerHand([]);
              }} style={styles.actionButton}>
                New Game
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '1rem'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem'
  },
  startArea: {
    padding: '2rem'
  },
  betSelector: {
    marginBottom: '2rem'
  },
  label: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    fontWeight: '600'
  },
  betButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '2rem'
  },
  betButton: {
    padding: '1rem',
    backgroundColor: '#0a0e27',
    border: '2px solid #333',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#fff'
  },
  activeBetButton: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
    boxShadow: '0 0 15px rgba(102, 126, 234, 0.5)'
  },
  dealButton: {
    width: '100%',
    padding: '1.5rem',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    borderRadius: '12px',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 0 30px rgba(76, 175, 80, 0.5)'
  },
  gameArea: {
    marginBottom: '2rem'
  },
  handSection: {
    marginBottom: '2rem'
  },
  hand: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '1rem'
  },
  card: {
    width: '80px',
    height: '110px',
    backgroundColor: '#fff',
    border: '2px solid #667eea',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#000'
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
  drawMessage: {
    fontSize: '1.5rem',
    color: '#ffd700'
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  actionButton: {
    flex: 1,
    padding: '1rem 2rem',
    backgroundColor: '#667eea',
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none',
    maxWidth: '200px'
  },
  buttonDisabled: {
    backgroundColor: '#333',
    cursor: 'not-allowed'
  }
};

export default BlackjackGame;

