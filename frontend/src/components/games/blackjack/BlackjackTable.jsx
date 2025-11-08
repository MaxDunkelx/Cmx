import { useEffect, useMemo, useState } from 'react';
import useBlackjackRound from '../../../hooks/useBlackjackRound';
import pirateBackdrop from '../../../assets/blackjack/pirate-blackjack.png';

const ACTION_LABELS = {
  hit: 'Hit',
  stand: 'Stand',
  double: 'Double Down',
  split: 'Split',
  surrender: 'Surrender',
  insurance: 'Insurance'
};

const formatCMX = (value) => (Number.isFinite(value) ? value.toLocaleString() : '0');

const getHandStatusBadge = (hand) => {
  if (!hand) return null;
  if (hand.result === 'surrender') return '🛡️ Surrendered';
  if (hand.status === 'bust' || hand.evaluation?.isBust) return '💥 Bust';
  if (hand.result === 'blackjack' || hand.evaluation?.isBlackjack) return '🃏 Blackjack';
  if (hand.status === 'stood') return '✋ Stood';
  return null;
};

const Card = ({ card, hidden }) => {
  const display = hidden ? '🂠' : card;
  return (
    <div style={styles.card}>
      <span>{display}</span>
    </div>
  );
};

const Hand = ({ title, cards = [], hiddenHoleCard = false, highlight = false, badge, total }) => (
  <div style={{ ...styles.handColumn, ...(highlight ? styles.activeHand : {}) }}>
    <div style={styles.handHeader}>
      <span>{title}</span>
      {badge && <span style={styles.badge}>{badge}</span>}
    </div>
    <div style={styles.cardRow}>
      {cards.map((card, index) => (
        <Card key={`${card}-${index}`} card={card} hidden={hiddenHoleCard && index === 1} />
      ))}
    </div>
    {Number.isFinite(total) && <div style={styles.handTotal}>{total}</div>}
  </div>
);

const BlackjackTable = ({ onBalanceChange }) => {
  const {
    round,
    balance,
    limits,
    provablyFair,
    loading,
    actionLoading,
    error,
    startRound,
    performAction,
    settleRound,
    clearRound
  } = useBlackjackRound();

  const [betAmount, setBetAmount] = useState(1000);
  const [uiError, setUiError] = useState(null);
  const [showFairness, setShowFairness] = useState(false);

  const minBet = limits?.minBet || 100;
  const maxBet = limits?.maxBet || 100000;

  useEffect(() => {
    if (betAmount < minBet) {
      setBetAmount(minBet);
    }
  }, [minBet]);

  const tableStatus = useMemo(() => {
    if (!round) return 'Place your bet to begin.';
    if (round.status === 'player-turn') return 'Your move';
    if (round.status === 'dealer-turn') return 'Dealer is playing';
    if (round.status === 'completed') return 'Settling round';
    if (round.status === 'settled') return 'Round completed';
    return '';
  }, [round]);

  const canStartRound = !round || round.status === 'settled';
  const disableStart = loading || actionLoading || betAmount > balance || !canStartRound;

  const availableActions = round?.availableActions || [];
  const isActionDisabled = actionLoading || loading;
  const canSettle =
    round &&
    ['dealer-turn', 'completed'].includes(round.status) &&
    !isActionDisabled;

  const dealerCards = round?.dealer?.cards || [];
  const playerHands = round?.player?.hands || [];
  const activeHandIndex = round?.player?.activeHandIndex ?? 0;

  const handleStartRound = async () => {
    setUiError(null);
    try {
      await startRound(betAmount);
    } catch (err) {
      setUiError(err?.response?.data?.message || err?.message || 'Failed to start round.');
    }
  };

  const handleAction = async (action) => {
    setUiError(null);
    try {
      await performAction(action);
    } catch (err) {
      setUiError(err?.response?.data?.message || err?.message || 'Action failed.');
    }
  };

  const handleSettle = async () => {
    setUiError(null);
    try {
      await settleRound();
    } catch (err) {
      setUiError(err?.response?.data?.message || err?.message || 'Unable to settle round.');
    }
  };

  const handlePlayAgain = () => {
    clearRound();
    setShowFairness(false);
  };

  const chipPreset = useMemo(() => {
    const base = minBet >= 1000 ? minBet : 1000;
    return [base, base * 2, base * 5, base * 10].filter((value) => value >= minBet && value <= maxBet);
  }, [minBet, maxBet]);

  const resultSummary = round?.summary;
  const dealerTotal = round?.dealer?.evaluation?.bestTotal ?? resultSummary?.dealerTotal;

  useEffect(() => {
    if (typeof onBalanceChange === 'function' && Number.isFinite(balance)) {
      onBalanceChange(balance);
    }
  }, [balance, onBalanceChange]);

  const wrapperStyle = useMemo(
    () => ({
      ...styles.wrapper,
      backgroundImage: `url(${pirateBackdrop})`
    }),
    []
  );

  return (
    <div style={wrapperStyle}>
      <div style={styles.header}>
        <div style={styles.balancePill}>
          <span>Balance</span>
          <strong>{formatCMX(balance)} CMX</strong>
        </div>
        <div style={styles.statusText}>{tableStatus}</div>
        {round?.roundId && (
          <div style={styles.roundIdPill}>
            <span>Round</span>
            <strong>{round.roundId}</strong>
          </div>
        )}
      </div>

      {(error || uiError) && (
        <div style={styles.errorBanner}>
          ⚠️ {error || uiError}
        </div>
      )}

      <div style={styles.table}>
        <div style={styles.dealerSection}>
          <h3 style={styles.sectionTitle}>Dealer</h3>
          <Hand
            title={round?.dealer?.revealHoleCard ? `Total: ${dealerTotal}` : 'Total: ?'}
            cards={dealerCards}
            hiddenHoleCard={!round?.dealer?.revealHoleCard}
            badge={round?.dealer?.revealHoleCard && round?.dealer?.evaluation?.isBlackjack ? '🃏 Blackjack' : null}
          />
        </div>

        <div style={styles.centerDivider} />

        <div style={styles.playerSection}>
          <h3 style={styles.sectionTitle}>Player</h3>
          <div style={styles.handsGrid}>
            {playerHands.map((hand, index) => (
              <Hand
                key={hand.id || index}
                title={`Bet ${formatCMX(hand.bet)} CMX`}
                cards={hand.cards}
                highlight={round?.status === 'player-turn' && index === activeHandIndex}
                badge={getHandStatusBadge(hand)}
                total={hand.evaluation?.bestTotal}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={styles.controlsBar}>
        <div style={styles.betPanel}>
          <div style={styles.betHeader}>
            <span>Bet Amount</span>
            <strong>{formatCMX(betAmount)} CMX</strong>
          </div>
          <input
            type="range"
            min={minBet}
            max={maxBet}
            step={minBet}
            value={betAmount}
            onChange={(event) => setBetAmount(Number(event.target.value))}
            disabled={!canStartRound || loading || actionLoading}
            style={styles.betSlider}
          />
          <div style={styles.chipRow}>
            {chipPreset.map((value) => (
              <button
                key={value}
                onClick={() => setBetAmount(value)}
                style={{
                  ...styles.chipButton,
                  ...(betAmount === value ? styles.activeChip : {})
                }}
                disabled={!canStartRound || loading || actionLoading}
              >
                {formatCMX(value)}
              </button>
            ))}
          </div>
          {limits && (
            <div style={styles.limitText}>
              Limits: {formatCMX(limits.minBet)}–{formatCMX(limits.maxBet)} CMX
            </div>
          )}
        </div>

        <div style={styles.actionPanel}>
          {canStartRound && (
            <button
              style={{
                ...styles.primaryButton,
                ...(disableStart ? styles.disabledButton : {})
              }}
              onClick={handleStartRound}
              disabled={disableStart}
            >
              {loading ? 'Dealing…' : 'Deal Cards'}
            </button>
          )}

          {!canStartRound && (
            <div style={styles.actionButtonsGrid}>
              {availableActions.map((action) => (
                <button
                  key={action}
                  style={{
                    ...styles.actionButton,
                    ...(isActionDisabled ? styles.disabledButton : {}),
                    ...(action === 'double' ? styles.highlightAction : {})
                  }}
                  onClick={() => handleAction(action)}
                  disabled={isActionDisabled}
                >
                  {ACTION_LABELS[action] || action}
                </button>
              ))}
              {canSettle && (
                <button
                  style={{
                    ...styles.primaryButton,
                    ...(isActionDisabled ? styles.disabledButton : {})
                  }}
                  onClick={handleSettle}
                  disabled={isActionDisabled}
                >
                  {actionLoading ? 'Settling…' : 'Settle Round'}
                </button>
              )}
              {round?.status === 'settled' && (
                <button
                  style={styles.secondaryButton}
                  onClick={handlePlayAgain}
                >
                  Play Again
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {round?.status === 'settled' && resultSummary && (
        <div style={styles.summaryCard}>
          <div style={styles.summaryHeader}>
            <h4>Round Summary</h4>
            <span>
              Net:{' '}
              <strong
                style={{
                  color: resultSummary.totals.net > 0 ? '#34d399' : resultSummary.totals.net < 0 ? '#f87171' : '#facc15'
                }}
              >
                {resultSummary.totals.net > 0 ? '+' : ''}
                {formatCMX(resultSummary.totals.net)} CMX
              </strong>
            </span>
          </div>
          <div style={styles.summaryGrid}>
            {resultSummary.handResults?.map((hand) => (
              <div key={hand.handId} style={styles.handSummary}>
                <div style={styles.summaryTitle}>Hand {hand.handId.slice(-4)}</div>
                <div>{hand.cards.join(' • ')}</div>
                <div>Outcome: <strong>{hand.outcome}</strong></div>
                <div>Wager: {formatCMX(hand.wager)} CMX</div>
                <div>Payout: {formatCMX(hand.payout)} CMX</div>
              </div>
            ))}
          </div>
          <div style={styles.summaryFooter}>
            <span>Total wagered: {formatCMX(resultSummary.totals.wagered)} CMX</span>
            {round.insurance?.placed && (
              <span>
                Insurance: {formatCMX(resultSummary.insurance.bet)} →{' '}
                {formatCMX(resultSummary.insurance.payout)} CMX
              </span>
            )}
            <button
              style={styles.linkButton}
              onClick={() => setShowFairness((value) => !value)}
            >
              {showFairness ? 'Hide Fairness Data' : 'Show Fairness Data'}
            </button>
          </div>

          {showFairness && provablyFair && (
            <div style={styles.fairnessPanel}>
              <div>Server Seed Hash: <code>{provablyFair.serverSeedHash}</code></div>
              {provablyFair.serverSeed && (
                <div>Revealed Server Seed: <code>{provablyFair.serverSeed}</code></div>
              )}
              <div>Client Seed: <code>{provablyFair.clientSeed}</code></div>
              <div>Public Hash: <code>{provablyFair.publicHash}</code></div>
              <div>Shoe Hash: <code>{provablyFair.shoeHash}</code></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    padding: '1.5rem',
    backgroundColor: 'rgba(4, 6, 20, 0.88)',
    backgroundBlendMode: 'multiply',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    borderRadius: '24px',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    boxShadow: '0 40px 80px rgba(2, 6, 23, 0.65)',
    color: '#e2e8f0',
    minHeight: '650px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  balancePill: {
    background: 'rgba(30, 64, 175, 0.2)',
    border: '1px solid rgba(59, 130, 246, 0.4)',
    borderRadius: '999px',
    padding: '0.75rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  statusText: {
    fontSize: '1.1rem',
    color: 'rgba(226, 232, 240, 0.75)'
  },
  roundIdPill: {
    background: 'rgba(30, 41, 59, 0.7)',
    borderRadius: '999px',
    padding: '0.5rem 1rem',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    fontSize: '0.9rem'
  },
  errorBanner: {
    background: 'rgba(248, 113, 113, 0.18)',
    border: '1px solid rgba(248, 113, 113, 0.45)',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    color: '#fecaca'
  },
  table: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '1.5rem',
    padding: '2.5rem',
    background: 'radial-gradient(circle at center, rgba(30, 64, 175, 0.25), rgba(30, 41, 59, 0.7))',
    borderRadius: '32px',
    border: '1px solid rgba(148, 163, 184, 0.12)'
  },
  dealerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  centerDivider: {
    width: '100%',
    height: '100%',
    borderRadius: '24px',
    border: '1px dashed rgba(148, 163, 184, 0.25)',
    opacity: 0.8
  },
  playerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'rgba(226, 232, 240, 0.75)'
  },
  handColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    background: 'rgba(15, 23, 42, 0.65)',
    borderRadius: '18px',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    padding: '1rem 1.25rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  activeHand: {
    boxShadow: '0 0 25px rgba(96, 165, 250, 0.45)',
    transform: 'translateY(-4px)'
  },
  handHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '1rem'
  },
  badge: {
    background: 'rgba(96, 165, 250, 0.2)',
    borderRadius: '999px',
    padding: '0.25rem 0.75rem',
    fontSize: '0.8rem',
    textTransform: 'uppercase'
  },
  cardRow: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  card: {
    width: '72px',
    height: '100px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    borderRadius: '12px',
    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1e293b',
    fontSize: '1.5rem',
    fontWeight: 700,
    position: 'relative'
  },
  handTotal: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: 'rgba(226, 232, 240, 0.9)'
  },
  handsGrid: {
    display: 'grid',
    gap: '1rem'
  },
  controlsBar: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
    gap: '1.5rem',
    alignItems: 'stretch'
  },
  betPanel: {
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '18px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  betHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '1rem'
  },
  betSlider: {
    width: '100%'
  },
  chipRow: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  chipButton: {
    padding: '0.75rem 1.25rem',
    borderRadius: '999px',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    background: 'rgba(30, 41, 59, 0.8)',
    color: '#e2e8f0',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
  },
  activeChip: {
    background: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.6)',
    boxShadow: '0 0 12px rgba(59, 130, 246, 0.35)'
  },
  limitText: {
    fontSize: '0.85rem',
    color: 'rgba(226, 232, 240, 0.55)'
  },
  actionPanel: {
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '18px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  primaryButton: {
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
    border: 'none',
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
  },
  secondaryButton: {
    padding: '0.85rem 1.25rem',
    borderRadius: '12px',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    background: 'rgba(15, 23, 42, 0.6)',
    color: '#e2e8f0',
    fontWeight: 600,
    cursor: 'pointer'
  },
  actionButtonsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '0.75rem'
  },
  actionButton: {
    padding: '0.9rem 1.2rem',
    borderRadius: '12px',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    background: 'rgba(30, 41, 59, 0.85)',
    color: '#e2e8f0',
    fontWeight: 600,
    cursor: 'pointer'
  },
  highlightAction: {
    borderColor: 'rgba(248, 113, 113, 0.45)',
    background: 'rgba(248, 113, 113, 0.15)'
  },
  disabledButton: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none'
  },
  summaryCard: {
    background: 'rgba(15, 23, 42, 0.85)',
    borderRadius: '18px',
    border: '1px solid rgba(148, 163, 184, 0.18)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  summaryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '1rem'
  },
  summaryGrid: {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
  },
  handSummary: {
    background: 'rgba(30, 41, 59, 0.7)',
    borderRadius: '12px',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    fontSize: '0.95rem'
  },
  summaryTitle: {
    fontWeight: 700
  },
  summaryFooter: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: 'rgba(226, 232, 240, 0.75)'
  },
  linkButton: {
    border: 'none',
    background: 'none',
    color: '#60a5fa',
    cursor: 'pointer',
    fontWeight: 600
  },
  fairnessPanel: {
    background: 'rgba(2, 6, 23, 0.7)',
    borderRadius: '12px',
    padding: '1rem',
    fontSize: '0.85rem',
    display: 'grid',
    gap: '0.5rem'
  }
};

export default BlackjackTable;


