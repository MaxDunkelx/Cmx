import { useState } from 'react';
import api from '../utils/api';

function PokerGame({ onPlay, result, loading, betAmount, setBetAmount, balance }) {
  const [hand, setHand] = useState([]);
  const [heldCards, setHeldCards] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const betOptions = [500, 1000, 2500, 5000];

  const getCardDisplay = (card) => {
    return card; // Cards already formatted as "A♠"
  };

  const handRankings = {
    'ROYAL_FLUSH': { name: 'Royal Flush', payout: 250 },
    'STRAIGHT_FLUSH': { name: 'Straight Flush', payout: 50 },
    'FOUR_KIND': { name: 'Four of a Kind', payout: 25 },
    'FULL_HOUSE': { name: 'Full House', payout: 9 },
    'FLUSH': { name: 'Flush', payout: 6 },
    'STRAIGHT': { name: 'Straight', payout: 4 },
    'THREE_KIND': { name: 'Three of a Kind', payout: 3 },
    'TWO_PAIR': { name: 'Two Pair', payout: 2 },
    'ONE_PAIR': { name: 'One Pair', payout: 1 },
    'HIGH_CARD': { name: 'High Card', payout: 0 }
  };

  // Evaluate poker hand and return hand type
  const evaluateHand = (cards) => {
    if (!cards || cards.length !== 5) return 'HIGH_CARD';
    
    const ranks = cards.map(card => {
      const r = card.match(/[A2-9JQK]|10/)[0];
      if (r === 'A') return 14;
      if (r === 'K') return 13;
      if (r === 'Q') return 12;
      if (r === 'J') return 11;
      return parseInt(r);
    });
    
    const suits = cards.map(card => card[card.length - 1]);
    
    // Count suits
    const suitCount = {};
    suits.forEach(suit => suitCount[suit] = (suitCount[suit] || 0) + 1);
    const isFlush = Object.values(suitCount).some(count => count === 5);
    
    // Count ranks
    const rankCount = {};
    ranks.forEach(rank => rankCount[rank] = (rankCount[rank] || 0) + 1);
    const counts = Object.values(rankCount).sort((a, b) => b - a);
    
    // Check for pairs
    const pairs = Object.entries(rankCount).filter(([_, count]) => count === 2);
    const threeKind = counts[0] === 3;
    const fourKind = counts[0] === 4;
    const twoPair = pairs.length === 2;
    const onePair = pairs.length === 1;
    
    // Check for straight
    const sortedRanks = [...ranks].sort((a, b) => a - b);
    let isStraight = false;
    if (sortedRanks[0] === sortedRanks[1] - 1 && 
        sortedRanks[1] === sortedRanks[2] - 1 && 
        sortedRanks[2] === sortedRanks[3] - 1 && 
        sortedRanks[3] === sortedRanks[4] - 1) {
      isStraight = true;
    }
    
    // Check for Ace low straight (A-2-3-4-5)
    if (sortedRanks.includes(14) && sortedRanks.includes(2) && 
        sortedRanks.includes(3) && sortedRanks.includes(4) && sortedRanks.includes(5)) {
      isStraight = true;
    }
    
    // Determine hand rank
    if (isFlush && isStraight && sortedRanks.includes(14) && sortedRanks.includes(13)) {
      return 'ROYAL_FLUSH';
    }
    if (isFlush && isStraight) {
      return 'STRAIGHT_FLUSH';
    }
    if (fourKind) {
      return 'FOUR_KIND';
    }
    if (threeKind && onePair) {
      return 'FULL_HOUSE';
    }
    if (isFlush) {
      return 'FLUSH';
    }
    if (isStraight) {
      return 'STRAIGHT';
    }
    if (threeKind) {
      return 'THREE_KIND';
    }
    if (twoPair) {
      return 'TWO_PAIR';
    }
    if (onePair) {
      return 'ONE_PAIR';
    }
    return 'HIGH_CARD';
  };

  const toggleHold = (index) => {
    if (heldCards.includes(index)) {
      setHeldCards(heldCards.filter(i => i !== index));
    } else {
      setHeldCards([...heldCards, index]);
    }
  };

  const deal = async () => {
    if (betAmount > balance) return;
    
    setLoading(true);
    try {
      const response = await api.post('/games/poker/play', { betAmount });
      setHand(response.data.data.hand);
      setGameStarted(true);
      setHeldCards([]);
      setGameOver(false);
    } catch (error) {
      console.error('Failed to deal:', error);
    } finally {
      setLoading(false);
    }
  };

  const draw = async () => {
    if (betAmount > balance) return;
    
    setLoading(true);
    setGameOver(true);
    
    // Create new hand keeping held cards
    const newHand = hand.map((card, i) => 
      heldCards.includes(i) ? card : getNewCard()
    );
    
    // Evaluate hand
    const handType = evaluateHand(newHand);
    const payout = handRankings[handType]?.payout || 0;
    const winAmount = payout > 0 ? Math.floor(betAmount * payout * (1 - 0.05)) : 0;
    
    // Call backend with result
    try {
      const response = await onPlay({
        betAmount,
        hand: newHand,
        handType,
        winAmount
      });
      setResult(response);
    } catch (error) {
      console.error('Failed to draw:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNewCard = () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    // Use crypto-secure random
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const suit = suits[array[0] % suits.length];
    const rank = ranks[array[0] % ranks.length];
    return `${rank}${suit}`;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>♠️ Video Poker</h2>

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
          <button onClick={deal} style={styles.dealButton}>
            ♠️ DEAL
          </button>
        </div>
      ) : (
        <div>
          <div style={styles.handArea}>
            {hand.map((card, index) => (
              <div key={index} style={styles.cardWrapper}>
                <button
                  onClick={() => !gameOver && toggleHold(index)}
                  style={{
                    ...styles.card,
                    ...(heldCards.includes(index) && styles.cardHeld)
                  }}
                  disabled={gameOver}
                >
                  {getCardDisplay(card)}
                </button>
                {heldCards.includes(index) && !gameOver && (
                  <div style={styles.holdLabel}>HELD</div>
                )}
              </div>
            ))}
          </div>

{result && result.result && (
            <div style={styles.resultCard}>
              <div style={styles.ranking}>
                {handRankings[result.ranking]?.name || 'No Win'}
              </div>
              {result.winAmount > 0 && (
                <>
                  <div style={styles.winAmount}>+{result.winAmount.toLocaleString()} CMX</div>
                  <div style={styles.winMessage}>🎉 You Won!</div>
                </>
              )}
            </div>
          )}

          <div style={styles.actionButtons}>
            {!gameOver && hand.length > 0 && (
              <button onClick={draw} style={styles.drawButton}>
                DRAW
              </button>
            )}
            {(gameOver || result) && (
              <button onClick={() => {
                setGameStarted(false);
                setGameOver(false);
                setHand([]);
                setHeldCards([]);
                setResult(null);
              }} style={styles.newGameButton}>
                NEW GAME
              </button>
            )}
          </div>
        </div>
      )}

      <div style={styles.payoutTable}>
        <h3>💰 Payouts</h3>
        <div style={styles.payouts}>
          {Object.entries(handRankings).slice(0, 5).map(([key, value]) => (
            <div key={key} style={styles.payoutItem}>
              <span>{value.name}</span>
              <span>{value.payout}x</span>
            </div>
          ))}
        </div>
      </div>
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
  handArea: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '2rem'
  },
  cardWrapper: {
    position: 'relative'
  },
  card: {
    width: '80px',
    height: '110px',
    backgroundColor: '#fff',
    border: '2px solid #667eea',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardHeld: {
    border: '3px solid #ffd700',
    boxShadow: '0 0 20px #ffd700'
  },
  holdLabel: {
    position: 'absolute',
    bottom: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '0.8rem',
    color: '#ffd700',
    fontWeight: 'bold'
  },
  resultCard: {
    backgroundColor: '#0a0e27',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1rem'
  },
  ranking: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '0.5rem'
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
  actionButtons: {
    marginBottom: '2rem'
  },
  drawButton: {
    padding: '1rem 3rem',
    backgroundColor: '#667eea',
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none'
  },
  newGameButton: {
    padding: '1rem 3rem',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none'
  },
  payoutTable: {
    backgroundColor: '#0a0e27',
    padding: '1.5rem',
    borderRadius: '8px'
  },
  payouts: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  payoutItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem',
    backgroundColor: '#1a1f3a',
    borderRadius: '6px'
  }
};

export default PokerGame;

