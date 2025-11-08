import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  startBlackjackRound,
  sendBlackjackAction,
  settleBlackjackRound,
  fetchBlackjackRoundState
} from '../utils/blackjackApi';

const ACTIVE_ROUND_STORAGE_KEY = 'cmx-blackjack-active-round';

const generateClientSeed = () => {
  const array = new Uint8Array(16);
  if (window?.crypto?.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < array.length; i += 1) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

export const useBlackjackRound = () => {
  const [round, setRound] = useState(null);
  const [balance, setBalance] = useState(null);
  const [limits, setLimits] = useState(null);
  const [provablyFair, setProvablyFair] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSeed] = useState(generateClientSeed);
  const [lastAction, setLastAction] = useState(null);

  const persistRoundId = useCallback((nextRound) => {
    if (nextRound?.status && ['player-turn', 'dealer-turn', 'completed'].includes(nextRound.status)) {
      localStorage.setItem(
        ACTIVE_ROUND_STORAGE_KEY,
        JSON.stringify({
          roundId: nextRound.roundId,
          updatedAt: Date.now()
        })
      );
    } else {
      localStorage.removeItem(ACTIVE_ROUND_STORAGE_KEY);
    }
  }, []);

  const hydrateState = useCallback((payload) => {
    if (!payload) return;

    setRound(payload);
    setLastAction(payload.lastAction || null);
    if (typeof payload.balance === 'number') {
      setBalance(payload.balance);
    }
    if (payload.limits) {
      setLimits(payload.limits);
    }
    if (payload.provablyFair) {
      setProvablyFair(payload.provablyFair);
    }
    persistRoundId(payload);
  }, [persistRoundId]);

  const handleError = useCallback((err) => {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      'Blackjack service is temporarily unavailable.';
    setError(message);
  }, []);

  const resumeRoundIfNeeded = useCallback(async () => {
    const stored = localStorage.getItem(ACTIVE_ROUND_STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (!parsed?.roundId) {
        localStorage.removeItem(ACTIVE_ROUND_STORAGE_KEY);
        return;
      }
      const snapshot = await fetchBlackjackRoundState({ roundId: parsed.roundId });
      hydrateState(snapshot);
    } catch (err) {
      console.error('Failed to resume blackjack round', err);
      localStorage.removeItem(ACTIVE_ROUND_STORAGE_KEY);
    }
  }, [hydrateState]);

  useEffect(() => {
    resumeRoundIfNeeded();
  }, [resumeRoundIfNeeded]);

  const startRound = useCallback(
    async (betAmount) => {
      setLoading(true);
      setError(null);
      try {
        const payload = await startBlackjackRound({ betAmount, clientSeed });
        hydrateState(payload);
        return payload;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clientSeed, handleError, hydrateState]
  );

  const performAction = useCallback(
    async (action) => {
      if (!round?.roundId) return null;
      setActionLoading(true);
      setError(null);
      try {
        const payload = await sendBlackjackAction({
          roundId: round.roundId,
          action
        });
        hydrateState(payload);
        return payload;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [round?.roundId, hydrateState, handleError]
  );

  const settleRound = useCallback(
    async () => {
      if (!round?.roundId) return null;
      setActionLoading(true);
      setError(null);
      try {
        const payload = await settleBlackjackRound({
          roundId: round.roundId
        });
        hydrateState(payload);
        return payload;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [round?.roundId, hydrateState, handleError]
  );

  const clearRound = useCallback(() => {
    setRound(null);
    setProvablyFair(null);
    setLimits(null);
    setLastAction(null);
    persistRoundId(null);
  }, [persistRoundId]);

  const clearError = useCallback(() => setError(null), []);

  const canPerform = useCallback(
    (action) => round?.availableActions?.includes(action),
    [round?.availableActions]
  );

  const derivedActiveHand = useMemo(() => {
    if (!round?.player?.hands?.length) return null;
    const index = round.player.activeHandIndex ?? 0;
    return round.player.hands[index] || null;
  }, [round]);

  const derivedState = useMemo(() => {
    const status = round?.status || 'idle';
    const awaitingSettle = ['dealer-turn', 'completed'].includes(status);
    const settled = status === 'settled';
    const availableActions = round?.availableActions || [];
    return {
      status,
      awaitingSettle,
      settled,
      availableActions,
      activeHand: derivedActiveHand,
      config: round?.config,
      flags: round?.flags,
      lockedBet: round?.lockedBet || 0,
      insuranceBet: round?.player?.insuranceBet || 0,
      hasTakenInsurance: Boolean(round?.player?.hasTakenInsurance),
      surrendered: Boolean(round?.player?.surrendered),
      summary: round?.summary || null
    };
  }, [round, derivedActiveHand]);

  const doubleDown = useCallback(() => performAction('double'), [performAction]);
  const hit = useCallback(() => performAction('hit'), [performAction]);
  const stand = useCallback(() => performAction('stand'), [performAction]);
  const split = useCallback(() => performAction('split'), [performAction]);
  const takeInsurance = useCallback(() => performAction('insurance'), [performAction]);
  const surrender = useCallback(() => performAction('surrender'), [performAction]);

  const state = useMemo(
    () => ({
      round,
      balance,
      limits,
      provablyFair,
      loading,
      actionLoading,
      error,
      clientSeed,
      lastAction,
      ...derivedState
    }),
    [
      round,
      balance,
      limits,
      provablyFair,
      loading,
      actionLoading,
      error,
      clientSeed,
      lastAction,
      derivedState
    ]
  );

  return {
    ...state,
    startRound,
    performAction,
    settleRound,
    clearRound,
    clearError,
    hit,
    stand,
    doubleDown,
    split,
    takeInsurance,
    surrender,
    canPerform
  };
};

export default useBlackjackRound;


