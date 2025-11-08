import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useBlackjackRound from '../../../hooks/useBlackjackRound';
import BetFader from './BetFader';
import styles from './BlackjackExperience.module.css';

const ACTION_LABELS = {
  hit: 'Hit',
  stand: 'Stand',
  double: 'Double Down',
  split: 'Split',
  surrender: 'Surrender',
  insurance: 'Insurance'
};

const STATUS_MESSAGES = {
  idle: 'Place your bet to begin a new round.',
  loading: 'Preparing the shoe and dealing cards…',
  'player-turn': 'Your turn — take action wisely.',
  'dealer-turn': 'Dealer is drawing to 17. Hold tight.',
  completed: 'Round completed. Settle to reveal outcome.',
  settled: 'Round settled. Review results or play again.'
};

const HISTORY_MAX_ENTRIES = 200;
const HISTORY_DISPLAY_LIMIT = 12;

const formatCMX = (value) => (Number.isFinite(value) ? value.toLocaleString() : '0');

const listVariants = {
  initial: {},
  enter: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.9, rotate: -6, y: -24 },
  enter: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  }
};

const Card = ({ value, hidden }) => (
  <motion.div variants={cardVariants} className={`${styles.card} ${hidden ? styles.cardHole : ''}`}>
    {hidden ? '🂠' : value}
  </motion.div>
);

const HandPanel = ({ title, cards = [], revealHole = true, highlight = false, badge }) => (
  <motion.div layout className={`${styles.handPanel} ${highlight ? styles.handPanelActive : ''}`}>
    <div className={styles.handHeader}>
      <span>{title}</span>
      {badge && <span className={styles.handBadge}>{badge}</span>}
    </div>
    <motion.div className={styles.cardsRow} variants={listVariants} initial="initial" animate="enter">
      {cards.map((card, index) => (
        <Card key={`${card}-${index}`} value={card} hidden={!revealHole && index === 1} />
      ))}
    </motion.div>
  </motion.div>
);

const getHandBadge = (hand) => {
  if (!hand) return null;
  if (hand.result === 'surrender') return '🛡️ Surrender';
  if (hand.status === 'bust' || hand.evaluation?.isBust) return '💥 Bust';
  if (hand.result === 'blackjack' || hand.evaluation?.isBlackjack) return '🃏 Blackjack';
  if (hand.result === 'win') return '🏆 Winner';
  if (hand.status === 'stood') return '✋ Stood';
  return null;
};

const dealerShouldReveal = (round) => {
  if (!round) return false;
  if (round.dealer?.revealHoleCard) return true;
  return ['dealer-turn', 'completed', 'settled'].includes(round.status || '');
};

const formatHandResultLine = (hand) => {
  if (!hand) return '';
  const outcome = (hand.outcome || '').toUpperCase();
  const wager = Number.isFinite(hand.wager) ? hand.wager : 0;
  const payout = Number.isFinite(hand.payout) ? hand.payout : 0;
  const deltaValue = payout - wager;
  const deltaLabel =
    deltaValue === 0
      ? '0'
      : `${deltaValue > 0 ? '+' : '-'}${formatCMX(Math.abs(deltaValue))}`;
  return `${outcome} ${deltaLabel} (${formatCMX(wager)}→${formatCMX(payout)})`;
};

const formatInsuranceResultLine = (insurance) => {
  if (!insurance?.placed) return '';
  const bet = Number.isFinite(insurance.bet) ? insurance.bet : 0;
  const payout = Number.isFinite(insurance.payout) ? insurance.payout : 0;
  const deltaValue = payout - bet;
  const deltaLabel =
    deltaValue === 0
      ? '0'
      : `${deltaValue > 0 ? '+' : '-'}${formatCMX(Math.abs(deltaValue))}`;
  return `INS ${deltaLabel} (${formatCMX(bet)}→${formatCMX(payout)})`;
};

const useStatus = (round, loading, actionLoading) => {
  if (loading || actionLoading) return STATUS_MESSAGES.loading;
  if (!round) return STATUS_MESSAGES.idle;
  return STATUS_MESSAGES[round.status] || STATUS_MESSAGES.idle;
};

const BlackjackExperience = ({ onBalanceChange, initialBalance }) => {
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
    flags,
    availableActions: computedActions
  } = useBlackjackRound();

  const [betAmount, setBetAmount] = useState(1000);
  const [betTouched, setBetTouched] = useState(false);
  const [uiError, setUiError] = useState(null);
  const [showFairness, setShowFairness] = useState(false);
  const [showInsurancePrompt, setShowInsurancePrompt] = useState(false);
  const [showSurrenderPrompt, setShowSurrenderPrompt] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const prevInsuranceOffered = useRef(false);
  const [history, setHistory] = useState([]);
  const [lastSummary, setLastSummary] = useState(null);
  const previousRoundIdRef = useRef(null);
  const autoSettleRef = useRef(null);
  const dealingRef = useRef(false);
  const dealerReveal = dealerShouldReveal(round);

  const minBet = limits?.minBet || 100;
  const maxBet = limits?.maxBet || 100000;

  const currentBalance = Number.isFinite(balance)
    ? balance
    : Number.isFinite(initialBalance)
    ? initialBalance
    : 0;

  const hasSufficientBalance = currentBalance >= minBet;
  const effectiveMaxBet = hasSufficientBalance
    ? Math.min(maxBet, currentBalance)
    : minBet;

  useEffect(() => {
    if (betAmount < minBet) {
      setBetAmount(minBet);
    }
  }, [minBet, betAmount]);

  useEffect(() => {
    if (typeof onBalanceChange === 'function' && Number.isFinite(balance)) {
      onBalanceChange(balance);
    }
  }, [balance, onBalanceChange]);

  const statusMessage = useStatus(round, loading, actionLoading);

  const displayBalance = currentBalance;

  const handleBetChange = (value) => {
    setBetTouched(true);
    setBetAmount(value);
  };

  const chipPreset = useMemo(() => {
    const baseValues = [minBet, minBet * 2, minBet * 5, minBet * 10, minBet * 20];
    const filtered = baseValues.filter((value) => value <= effectiveMaxBet);
    return filtered.length > 0 ? filtered : [Math.min(minBet, effectiveMaxBet)];
  }, [minBet, effectiveMaxBet]);

  const availableActions = computedActions || round?.availableActions || [];

  const activeHandIndex = round?.player?.activeHandIndex ?? 0;

  const summaryData = useMemo(() => {
    if (round?.status === 'settled' && round?.summary) {
      return {
        roundId: round.roundId,
        summary: round.summary,
        provablyFair,
        timestamp: Date.now()
      };
    }
    return lastSummary;
  }, [round?.status, round?.summary, round?.roundId, provablyFair, lastSummary]);

  const handleStartRound = async () => {
    if (!betTouched) {
      setUiError('Select your stake using the slider or quick chips before dealing.');
      return;
    }
    if (!hasSufficientBalance) {
      setUiError(`You need at least ${formatCMX(minBet)} CMX to play.`);
      return;
    }
    const stake = Math.min(Math.max(minBet, betAmount), effectiveMaxBet);
    setUiError(null);
    setShowFairness(false);
    setShowInsurancePrompt(false);
    setShowSurrenderPrompt(false);
    try {
      await startRound(stake);
      setBetAmount(stake);
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
    // clearRound(); // This line is removed as per the edit hint.
    setShowFairness(false);
    setShowInsurancePrompt(false);
    setShowSurrenderPrompt(false);
  };

  const insuranceOffered = Boolean(flags?.offerInsurance && availableActions.includes('insurance'));

  useEffect(() => {
    if (insuranceOffered && !prevInsuranceOffered.current) {
      setShowInsurancePrompt(true);
    }
    if (!insuranceOffered) {
      setShowInsurancePrompt(false);
    }
    prevInsuranceOffered.current = insuranceOffered;
  }, [insuranceOffered]);

  useEffect(() => {
    if (round?.status === 'player-turn') {
      setShowFairness(false);
      setLastSummary(null);
      autoSettleRef.current = null;
      dealingRef.current = true;
      setTimeout(() => {
        dealingRef.current = false;
      }, 900);
    }
  }, [round?.status]);

  useEffect(() => {
    if (round?.status === 'completed' && round?.roundId) {
      if (dealingRef.current || autoSettleRef.current === round.roundId || actionLoading || loading) {
        return;
      }
      autoSettleRef.current = round.roundId;
      settleRound().catch(() => {
        autoSettleRef.current = null;
      });
    }
  }, [round?.status, round?.roundId, actionLoading, loading, settleRound]);

  useEffect(() => {
    if (round?.status === 'settled' && round?.summary && round.roundId !== previousRoundIdRef.current) {
      const totals = round.summary.totals || {};
      const wagered = totals.wagered ?? betAmount;
      const net = totals.net ?? 0;
      const result = net > 0 ? 'win' : net < 0 ? 'loss' : 'push';
      const handResults = (round.summary.handResults || []).map((handResult) => {
        const sourceHand = round.player?.hands?.find((hand) => hand.id === handResult.handId) || null;
        return {
          ...handResult,
          delta: (handResult.payout ?? 0) - (handResult.wager ?? 0),
          history: sourceHand?.history || []
        };
      });
      const insuranceSnapshot = round.summary.insurance
        ? {
            ...round.summary.insurance,
            delta: (round.summary.insurance.payout ?? 0) - (round.summary.insurance.bet ?? 0)
          }
        : null;

      setHistory((prev) => {
        const updated = [
          {
            roundId: round.roundId,
            bet: wagered,
            net,
            result,
            timestamp: Date.now(),
            hands: handResults,
            insurance: insuranceSnapshot
          },
          ...prev
        ];
        return updated.slice(0, HISTORY_MAX_ENTRIES);
      });

      setLastSummary({
        roundId: round.roundId,
        summary: round.summary,
        provablyFair: round.provablyFair || provablyFair,
        timestamp: Date.now()
      });

      previousRoundIdRef.current = round.roundId;
    }
  }, [round?.status, round?.summary, round?.roundId, round?.provablyFair, provablyFair, betAmount]);

  useEffect(() => {
    if (round?.status === 'settled') {
      document.querySelector('#blackjack-scroll-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [round?.status]);

  const canStartRound = !round || round.status === 'settled';
  const betControlsDisabled =
    !hasSufficientBalance || loading || actionLoading || (round && round.status !== 'settled');
  const disableStart =
    loading ||
    actionLoading ||
    !hasSufficientBalance ||
    betAmount > currentBalance ||
    betAmount < minBet ||
    !canStartRound;

  const isActionDisabled = actionLoading || loading;
  const canSettle =
    round &&
    ['dealer-turn', 'completed'].includes(round.status) &&
    !isActionDisabled;

  const historyDisplay = useMemo(
    () => history.slice(0, HISTORY_DISPLAY_LIMIT),
    [history]
  );

  const sessionStats = useMemo(() => {
    if (!history.length) {
      return {
        rounds: 0,
        net: 0,
        wagered: 0,
        wins: 0,
        losses: 0,
        pushes: 0,
        bestWin: 0,
        worstLoss: 0,
        lastEntry: null
      };
    }

    let netSum = 0;
    let wageredSum = 0;
    let wins = 0;
    let losses = 0;
    let pushes = 0;
    let bestWin = 0;
    let worstLoss = 0;

    history.forEach((entry) => {
      const netValue = entry?.net ?? 0;
      const betValue = entry?.bet ?? 0;

      netSum += netValue;
      wageredSum += betValue;

      if (entry?.result === 'win') wins += 1;
      else if (entry?.result === 'loss') losses += 1;
      else pushes += 1;

      if (netValue > bestWin) bestWin = netValue;
      if (netValue < worstLoss) worstLoss = netValue;
    });

    return {
      rounds: history.length,
      net: netSum,
      wagered: wageredSum,
      wins,
      losses,
      pushes,
      bestWin,
      worstLoss,
      lastEntry: history[0] || null
    };
  }, [history]);

  const {
    rounds: totalRounds,
    net: totalNet,
    wagered: totalWagered,
    wins,
    losses,
    pushes,
    bestWin,
    worstLoss,
    lastEntry
  } = sessionStats;

  return (
    <div className={styles.wrapper}>
      <div className={styles.experience}>
        <div id="blackjack-scroll-anchor" />
        <div className={styles.infoBar}>
          <div className={styles.badgePill}>
            <span className={styles.uiBadge}>Balance</span>
            <strong>{formatCMX(displayBalance)} CMX</strong>
          </div>
          <div className={styles.statusTicker}>
            <span>📣</span>
            <span>{statusMessage}</span>
          </div>
          {round?.roundId && (
            <div className={styles.roundInfo}>
              <span>Round</span>
              <strong>{round.roundId.slice(-6).toUpperCase()}</strong>
            </div>
          )}
        </div>

        {(error || uiError) && (
          <div className={styles.errorBanner}>
            <span>⚠️</span>
            <span>{error || uiError}</span>
          </div>
        )}

        <div className={styles.content}>
          <aside className={styles.sidebar}>
            <div className={styles.betModule}>
              <BetFader
                min={minBet}
                max={maxBet}
                step={minBet}
                value={betAmount}
                onChange={handleBetChange}
                disabled={betControlsDisabled}
              />
              <div style={{ textAlign: 'center', color: 'rgba(226, 232, 240, 0.65)' }}>
                <div style={{ fontSize: '0.85rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Quick Chips
                </div>
                <div style={{ marginTop: '0.65rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {chipPreset.map((value) => (
                    <motion.button
                      key={value}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleBetChange(value)}
                      disabled={betControlsDisabled}
                      className={`${styles.chipButton} ${
                        betAmount === value ? styles.chipButtonActive : ''
                      }`}
                    >
                      {formatCMX(value)}
                    </motion.button>
                  ))}
                </div>
                {limits && (
                  <div className={styles.limitsLabel} style={{ marginTop: '0.7rem' }}>
                    Table Limits: {formatCMX(limits.minBet)} – {formatCMX(limits.maxBet)} CMX
                  </div>
                )}
                {!hasSufficientBalance && (
                  <div
                    className={styles.errorBanner}
                    style={{
                      marginTop: '0.7rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span>⚠️</span>
                    <span>
                      You need at least {formatCMX(minBet)} CMX to join the table. Current balance: {formatCMX(currentBalance)} CMX.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.statsCard}>
              <div className={styles.historyHeader}>Session Stats</div>
              <div className={styles.statsRow}>
                <span>Total rounds</span>
                <strong>{totalRounds}</strong>
              </div>
              <div className={styles.statsRow}>
                <span>Total wagered</span>
                <strong>{formatCMX(totalWagered)} CMX</strong>
              </div>
              <div className={styles.statsRow}>
                <span>Net earnings</span>
                <strong className={
                  totalNet > 0
                    ? styles.historyNetWin
                    : totalNet < 0
                      ? styles.historyNetLoss
                      : styles.historyMeta
                }>
                  {totalNet === 0 ? '0' : `${totalNet > 0 ? '+' : '-'}${formatCMX(Math.abs(totalNet))}`} CMX
                </strong>
              </div>
              <div className={styles.statsRow}>
                <span>Record</span>
                <strong>{`${wins}-${losses}-${pushes}`}</strong>
              </div>
              <div className={styles.statsRow}>
                <span>Best win</span>
                <strong className={styles.historyNetWin}>
                  {bestWin > 0 ? `+${formatCMX(bestWin)}` : '0'} CMX
                </strong>
              </div>
              <div className={styles.statsRow}>
                <span>Worst loss</span>
                <strong className={styles.historyNetLoss}>
                  {worstLoss < 0 ? `-${formatCMX(Math.abs(worstLoss))}` : '0'} CMX
                </strong>
              </div>
              {lastEntry && (
                <div className={styles.statsRow}>
                  <span>Last result</span>
                  <strong className={
                    lastEntry.net > 0
                      ? styles.historyNetWin
                      : lastEntry.net < 0
                        ? styles.historyNetLoss
                        : styles.historyMeta
                  }>
                    {`${lastEntry.result.toUpperCase()} (${lastEntry.net === 0 ? '0' : `${lastEntry.net > 0 ? '+' : '-'}${formatCMX(Math.abs(lastEntry.net))}`} CMX)`}
                  </strong>
                </div>
              )}
            </div>

            <div className={styles.historyCard}>
              <div className={styles.historyHeader}>Recent Rounds</div>
              {historyDisplay.length === 0 ? (
                <div className={styles.historyMeta}>No rounds yet. Place a bet to get started.</div>
              ) : (
                <div className={styles.historyList}>
                  {historyDisplay.map((entry) => {
                    const handLines = (entry.hands || [])
                      .map((hand) => formatHandResultLine(hand))
                      .filter(Boolean);
                    const insuranceLine = formatInsuranceResultLine(entry.insurance);
                    const detailSegments = [
                      `${entry.result.toUpperCase()} · ${formatCMX(entry.bet)} CMX`,
                      ...handLines
                    ];
                    if (insuranceLine) {
                      detailSegments.push(insuranceLine);
                    }
                    const netValue = entry?.net ?? 0;
                    const netClass =
                      netValue > 0
                        ? styles.historyNetWin
                        : netValue < 0
                          ? styles.historyNetLoss
                          : styles.historyMeta;
                    const netLabel =
                      netValue === 0
                        ? '0 CMX'
                        : `${netValue > 0 ? '+' : '-'}${formatCMX(Math.abs(netValue))} CMX`;

                    return (
                      <div key={`${entry.roundId}-${entry.timestamp}`} className={styles.historyItem}>
                        <div>
                          <div>{entry.roundId.slice(-6).toUpperCase()}</div>
                          <div className={styles.historyMeta}>{detailSegments.join(' · ')}</div>
                        </div>
                        <div className={netClass}>{netLabel}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(true)}
              className={styles.guideButton}
            >
              Learn Blackjack Basics
            </button>
          </aside>

          <section className={styles.mainColumn}>
            <div
              className={styles.tableRegion}
              style={{
                backgroundImage: 'linear-gradient(rgba(7, 11, 28, 0.85), rgba(7, 11, 28, 0.92)), url("/src/assets/images/black-jack-background.png")'
              }}
            >
              <div className={styles.stageHeading}>Dealer</div>
              <div className={styles.stageRow}>
                {round?.dealer?.cards?.length ? (
                  <HandPanel
                    title="Dealer"
                    cards={round.dealer.cards}
                    revealHole={dealerReveal}
                    badge={dealerReveal && round?.dealer?.evaluation?.isBlackjack ? '🃏 Blackjack' : null}
                  />
                ) : (
                  <div className={styles.emptyState}>Deal a new hand to reveal the dealer&rsquo;s cards.</div>
                )}
              </div>
              {round?.dealer?.cards?.length && (
                <div className={styles.stageTotals}>
                  <span className={styles.stageTotalsPill}>
                    Dealer Total:{' '}
                    <strong>
                      {dealerReveal && Number.isFinite(round?.dealer?.evaluation?.bestTotal)
                        ? round.dealer.evaluation.bestTotal
                        : '—'}
                    </strong>
                  </span>
                </div>
              )}

              <div className={styles.stageHeading}>Player</div>
              <div className={styles.stageRow}>
                {round?.player?.hands?.length ? (
                  round.player.hands.map((hand, index) => (
                    <HandPanel
                      key={hand.id || index}
                      title={`Bet ${formatCMX(hand.bet)} CMX`}
                      cards={hand.cards}
                      revealHole
                      highlight={round?.status === 'player-turn' && index === activeHandIndex}
                      badge={getHandBadge(hand)}
                    />
                  ))
                ) : (
                  <div className={styles.emptyState}>Choose a stake on the left and press &ldquo;Deal Cards&rdquo; to begin.</div>
                )}
              </div>
              {round?.player?.hands?.length && (
                <div className={styles.stageTotals}>
                  {round.player.hands.map((hand, index) => {
                    const totalValue = Number.isFinite(hand.evaluation?.bestTotal)
                      ? hand.evaluation.bestTotal
                      : '—';
                    const isActive = round?.status === 'player-turn' && index === activeHandIndex;
                    const resultLabel = hand.result ? hand.result.toUpperCase() : null;
                    return (
                      <span
                        key={hand.id || index}
                        className={`${styles.stageTotalsPill} ${isActive ? styles.stageTotalsActive : ''}`}
                      >
                        Hand {index + 1}: <strong>{totalValue}</strong>
                        {resultLabel && <em>{resultLabel}</em>}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={styles.actionModule}>
              <div className={styles.actionRow}>
                <button
                  type="button"
                  onClick={handleStartRound}
                  disabled={disableStart}
                  className={styles.primaryAction}
                >
                  {loading ? 'Preparing…' : 'Deal Cards'}
                </button>

                <div className={styles.actionButtonGroup}>
                  {round && round.status !== 'settled' && (
                    <>
                      {availableActions
                        .filter((action) => !['insurance', 'surrender'].includes(action))
                        .map((action) => (
                          <button
                            key={action}
                            type="button"
                            onClick={() => handleAction(action)}
                            disabled={isActionDisabled}
                            className={styles.actionButton}
                          >
                            {ACTION_LABELS[action] || action}
                          </button>
                        ))}

                      {availableActions.includes('surrender') && (
                        <button
                          type="button"
                          onClick={() => setShowSurrenderPrompt(true)}
                          disabled={isActionDisabled}
                          className={styles.actionButton}
                          style={{ borderColor: 'rgba(248,113,113,0.35)', background: 'rgba(248,113,113,0.12)' }}
                        >
                          Surrender
                        </button>
                      )}

                      {insuranceOffered && (
                        <button
                          type="button"
                          onClick={() => setShowInsurancePrompt(true)}
                          disabled={isActionDisabled}
                          className={styles.actionButton}
                          style={{ borderColor: 'rgba(251, 191, 36, 0.45)', background: 'rgba(251, 191, 36, 0.18)' }}
                        >
                          Insurance
                        </button>
                      )}

                      {canSettle && (
                        <button
                          type="button"
                          onClick={handleSettle}
                          disabled={isActionDisabled}
                          className={styles.actionButton}
                        >
                          {actionLoading ? 'Settling…' : 'Settle' }
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.summaryHolder}>
              <AnimatePresence mode="wait">
                {summaryData ? (
                  <motion.div
                    key={summaryData.roundId || summaryData.timestamp}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 25 }}
                    className={styles.summaryPanel}
                  >
                    <div className={styles.summaryHeader}>
                      <h4 style={{ fontSize: '1.2rem', letterSpacing: '0.04em' }}>Round {summaryData.roundId?.slice(-6).toUpperCase()}</h4>
                      <span>
                        Net:{' '}
                        <strong
                          style={{
                            color:
                              (summaryData.summary?.totals?.net ?? 0) > 0
                                ? '#34d399'
                                : (summaryData.summary?.totals?.net ?? 0) < 0
                                ? '#f87171'
                                : '#facc15'
                          }}
                        >
                          {(summaryData.summary?.totals?.net ?? 0) > 0 ? '+' : ''}
                          {formatCMX(summaryData.summary?.totals?.net ?? 0)} CMX
                        </strong>
                      </span>
                    </div>

                    <div className={styles.summaryGrid}>
                      {(summaryData.summary?.handResults || []).map((hand) => (
                        <div key={hand.handId} className={styles.summaryCard}>
                          <div style={{ fontWeight: 700 }}>Hand {hand.handId.slice(-4)}</div>
                          <div>{hand.cards.join(' • ')}</div>
                          <div>Outcome: <strong>{hand.outcome}</strong></div>
                          <div>Wager: {formatCMX(hand.wager)} CMX</div>
                          <div>Payout: {formatCMX(hand.payout)} CMX</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                      <span>Total wagered: {formatCMX(summaryData.summary?.totals?.wagered ?? 0)} CMX</span>
                      <span>Base payout: {formatCMX(summaryData.summary?.totals?.basePayout ?? 0)} CMX</span>
                      {summaryData.summary?.insurance?.placed && (
                        <span>
                          Insurance: {formatCMX(summaryData.summary.insurance.bet)} →{' '}
                          {formatCMX(summaryData.summary.insurance.payout)} CMX
                        </span>
                      )}
                      <button
                        type="button"
                        className={styles.fairnessToggle}
                        onClick={() => setShowFairness((value) => !value)}
                      >
                        {showFairness ? 'Hide Provably Fair Data' : 'Show Provably Fair Data'}
                      </button>
                    </div>

                    <AnimatePresence>
                      {showFairness && summaryData.provablyFair && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={styles.fairnessPanel}
                        >
                          <div>Server Seed Hash: <code>{summaryData.provablyFair.serverSeedHash}</code></div>
                          {summaryData.provablyFair.serverSeed && (
                            <div>Server Seed: <code>{summaryData.provablyFair.serverSeed}</code></div>
                          )}
                          <div>Client Seed: <code>{summaryData.provablyFair.clientSeed}</code></div>
                          <div>Public Hash: <code>{summaryData.provablyFair.publicHash}</code></div>
                          <div>Shoe Hash: <code>{summaryData.provablyFair.shoeHash}</code></div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <div className={styles.summaryPlaceholder}>
                    Settle a round to view detailed results and fairness data.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>

        <AnimatePresence>
          {showInsurancePrompt && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className={styles.summaryPanel}
              style={{
                position: 'fixed',
                bottom: '3%',
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: '420px',
                zIndex: 50
              }}
            >
              <h4 style={{ marginBottom: '0.75rem' }}>Insurance Available</h4>
              <p style={{ color: 'rgba(226,232,240,0.75)', marginBottom: '1.25rem' }}>
                Dealer is showing an Ace. Insurance costs half your current wager and pays 2:1 if the dealer has blackjack.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => {
                    setShowInsurancePrompt(false);
                  }}
                >
                  Decline
                </button>
                <button
                  type="button"
                  className={styles.primaryAction}
                  style={{ fontSize: '1rem', padding: '0.85rem 1.25rem' }}
                  onClick={async () => {
                    setShowInsurancePrompt(false);
                    await handleAction('insurance');
                  }}
                >
                  Take Insurance
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showSurrenderPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className={styles.summaryPanel}
              style={{
                position: 'fixed',
                bottom: '3%',
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: '420px',
                zIndex: 50
              }}
            >
              <h4 style={{ marginBottom: '0.75rem' }}>Confirm Surrender</h4>
              <p style={{ color: 'rgba(226,232,240,0.75)', marginBottom: '1.25rem' }}>
                You’ll forfeit half of your wager and end this hand immediately. Are you sure you want to surrender?
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setShowSurrenderPrompt(false)}
                >
                  Keep Playing
                </button>
                <button
                  type="button"
                  className={styles.primaryAction}
                  style={{ fontSize: '1rem', padding: '0.85rem 1.25rem' }}
                  onClick={async () => {
                    setShowSurrenderPrompt(false);
                    await handleAction('surrender');
                  }}
                >
                  Confirm Surrender
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showGuide && (
            <motion.div
              className={styles.guideBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={styles.guideModal}
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className={styles.guideHeader}>
                  <div>
                    <span className={styles.guideBadge}>Blackjack 101</span>
                    <h3>Your edge starts here</h3>
                  </div>
                  <button type="button" onClick={() => setShowGuide(false)} className={styles.guideClose}>
                    ×
                  </button>
                </div>

                <div className={styles.guideContent}>
                  <section>
                    <h4>Table Flow</h4>
                    <p>
                      Aim to finish closer to 21 than the dealer without busting. Hit to draw a card, stand to
                      lock your total, double for exactly one more card while doubling the wager, and split when
                      the opening two cards share the same rank.
                    </p>
                  </section>

                  <section>
                    <h4>Hand Values</h4>
                    <ul>
                      <li>Aces flex between 1 and 11. Face cards and tens count as 10. Everything else keeps its number.</li>
                      <li>A natural blackjack (Ace + 10-value card) beats any 21 made with more cards.</li>
                      <li>If both you and the dealer tie on the same total, the hand pushes and your stake returns.</li>
                    </ul>
                  </section>

                  <section>
                    <h4>House Edge Snapshot</h4>
                    <ul>
                      <li>Natural blackjack lands roughly <strong>4.8%</strong> of the time on a fresh shoe.</li>
                      <li>Dealer busts when showing a weak up-card (2–6) about <strong>28%</strong> of hands.</li>
                      <li>Following basic strategy trims the house edge to around <strong>0.5%</strong>.</li>
                    </ul>
                  </section>

                  <section>
                    <h4>Smart Tips</h4>
                    <p>
                      Keep insurance for dealer-ace situations, manage bankroll with consistent bet sizing, and
                      double down when you have the advantage—especially on hard 10s and 11s versus dealer low cards.
                    </p>
                  </section>
                </div>

                <div className={styles.guideFooter}>
                  <button type="button" onClick={() => setShowGuide(false)} className={styles.guidePrimary}>
                    Got it, let&rsquo;s play
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default BlackjackExperience;

