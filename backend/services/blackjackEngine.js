import { generateFairRandom, generateHash } from '../utils/provablyFair.js';

const SUITS = ['S', 'H', 'D', 'C']; // Spades, Hearts, Diamonds, Clubs
const SUIT_SYMBOLS = {
  S: '♠',
  H: '♥',
  D: '♦',
  C: '♣'
};

const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const DEFAULT_CONFIG = {
  decks: 6,
  cutCardPenetration: 0.75,
  dealerHitsSoft17: false,
  allowDoubleAfterSplit: true,
  allowDoubleOnAnyTwo: true,
  allowSurrender: true,
  maxSplitHands: 4,
  blackjackPayout: 1.5, // 3:2 payout
  allowResplitAces: false,
  allowHitSplitAces: false
};

const clone = (value) => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
};

const buildDeck = (decks = 1) => {
  const cards = [];
  for (let d = 0; d < decks; d += 1) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        cards.push({ rank, suit });
      }
    }
  }
  return cards;
};

const shuffleDeck = (cards, seedKey) => {
  const shuffled = [...cards];
  let swapIndex = 0;

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = generateFairRandom(seedKey, i, swapIndex);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    swapIndex += 1;
  }

  return shuffled;
};

export const initializeShoe = ({
  serverSeed,
  clientSeed = '',
  nonce = '0',
  config = {}
}) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const baseDeck = buildDeck(mergedConfig.decks);
  const seedKey = `${serverSeed}-${clientSeed}-${nonce}`;
  const cards = shuffleDeck(baseDeck, seedKey);
  const cutCardPosition = Math.floor(cards.length * mergedConfig.cutCardPenetration);

  return {
    cards,
    position: 0,
    cutCardPosition,
    config: {
      decks: mergedConfig.decks,
      cutCardPenetration: mergedConfig.cutCardPenetration
    },
    provablyFair: {
      serverSeed,
      clientSeed,
      nonce,
      seedKey,
      shoeHash: generateHash(seedKey)
    }
  };
};

export const drawCard = (shoeState) => {
  if (!shoeState || !shoeState.cards) {
    throw new Error('Invalid shoe state');
  }

  if (shoeState.position >= shoeState.cards.length) {
    throw new Error('Shoe is depleted');
  }

  const card = shoeState.cards[shoeState.position];
  const nextShoe = {
    ...shoeState,
    position: shoeState.position + 1
  };

  return { card, shoe: nextShoe };
};

export const cardToString = (card) => {
  if (!card) return '';
  const suitSymbol = SUIT_SYMBOLS[card.suit] || card.suit;
  return `${card.rank}${suitSymbol}`;
};

export const evaluateHand = (cards) => {
  if (!Array.isArray(cards)) {
    return {
      totals: [],
      bestTotal: 0,
      isSoft: false,
      isBlackjack: false,
      isBust: false
    };
  }

  const totals = [0];
  let aceCount = 0;

  cards.forEach((card) => {
    const rank = card.rank;
    const newTotals = [];
    if (rank === 'A') {
      aceCount += 1;
      totals.forEach((total) => {
        newTotals.push(total + 1);
        newTotals.push(total + 11);
      });
    } else if (['J', 'Q', 'K'].includes(rank)) {
      totals.forEach((total) => newTotals.push(total + 10));
    } else {
      const value = parseInt(rank, 10);
      totals.forEach((total) => newTotals.push(total + value));
    }
    totals.length = 0;
    newTotals.forEach((total) => totals.push(total));
  });

  const uniqueTotals = Array.from(new Set(totals));
  const validTotals = uniqueTotals.filter((total) => total <= 21);
  const bestTotal = validTotals.length > 0 ? Math.max(...validTotals) : Math.min(...uniqueTotals);
  const isSoft = validTotals.some((total) => total <= 21 && total !== bestTotal && total + 10 === bestTotal);
  const isBlackjack = cards.length === 2 && bestTotal === 21;
  const isBust = Math.min(...uniqueTotals) > 21;

  return {
    totals: uniqueTotals.sort((a, b) => a - b),
    bestTotal,
    isSoft,
    isBlackjack,
    isBust,
    aceCount
  };
};

const initialPlayerHand = (cards, bet) => {
  const evaluation = evaluateHand(cards);
  return {
    id: `hand-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    cards,
    bet,
    status: evaluation.isBlackjack ? 'blackjack' : 'playing',
    canSplit: cards.length === 2 && getCardNumericValue(cards[0]) === getCardNumericValue(cards[1]),
    hasDoubled: false,
    hasSplit: false,
    result: null,
    evaluation,
    history: []
  };
};

const getCardNumericValue = (card) => {
  if (card.rank === 'A') return 11;
  if (['K', 'Q', 'J'].includes(card.rank)) return 10;
  return parseInt(card.rank, 10);
};

const shouldOfferInsurance = (dealerCards) => dealerCards[0]?.rank === 'A';

const shouldDealerDraw = (dealerEvaluation, config) => {
  if (dealerEvaluation.isBust) return false;
  if (dealerEvaluation.bestTotal < 17) return true;
  if (dealerEvaluation.bestTotal === 17 && dealerEvaluation.isSoft && config.dealerHitsSoft17) {
    return true;
  }
  return false;
};

export const createRoundState = ({
  shoeState,
  betAmount,
  config = {},
  metadata = {}
}) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  let workingShoe = clone(shoeState);

  const initialDraws = [];
  for (let i = 0; i < 4; i += 1) {
    const draw = drawCard(workingShoe);
    initialDraws.push(draw.card);
    workingShoe = draw.shoe;
  }

  const playerCards = [initialDraws[0], initialDraws[2]];
  const dealerCards = [initialDraws[1], initialDraws[3]];
  const playerHand = initialPlayerHand(playerCards, betAmount);
  const dealerEvaluation = evaluateHand(dealerCards);
  const playerEvaluation = evaluateHand(playerCards);

  const roundState = {
    roundId: metadata.roundId || `bj-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    status: 'player-turn',
    createdAt: Date.now(),
    lastActionAt: Date.now(),
    config: mergedConfig,
    shoe: workingShoe,
    dealer: {
      cards: dealerCards,
      evaluation: dealerEvaluation,
      revealHoleCard: false
    },
    player: {
      hands: [playerHand],
      activeHandIndex: 0,
      insuranceBet: 0,
      hasTakenInsurance: false,
      surrendered: false
    },
    bets: {
      baseBet: betAmount,
      totalWager: betAmount,
      insuranceBet: 0
    },
    flags: {
      offerInsurance: shouldOfferInsurance(dealerCards),
      playerHasNatural: playerEvaluation.isBlackjack,
      dealerHasNatural: dealerEvaluation.isBlackjack
    },
    history: [
      {
        type: 'deal',
        at: Date.now(),
        playerCards: playerCards.map(cardToString),
        dealerUpCard: cardToString(dealerCards[0]),
        dealerHoleCardHash: dealerEvaluation.isBlackjack ? null : 'hidden'
      }
    ],
    metadata
  };

  if (roundState.flags.playerHasNatural || roundState.flags.dealerHasNatural) {
    roundState.status = 'dealer-turn';
    roundState.dealer.revealHoleCard = true;
  }

  return roundState;
};

export const getAvailableActions = (state, { availableBalance = 0 } = {}) => {
  if (!state || state.status !== 'player-turn') return [];

  const hand = state.player.hands[state.player.activeHandIndex];
  if (!hand || hand.status !== 'playing') return [];

  const actions = ['hit', 'stand'];

  const canDouble = !hand.hasDoubled
    && hand.cards.length === 2
    && state.config.allowDoubleOnAnyTwo
    && (!hand.hasSplit || state.config.allowDoubleAfterSplit)
    && availableBalance >= hand.bet;

  if (canDouble) {
    actions.push('double');
  }

  const canSplit = hand.cards.length === 2
    && hand.canSplit
    && state.player.hands.length < state.config.maxSplitHands
    && availableBalance >= hand.bet;

  if (canSplit) {
    actions.push('split');
  }

  if (state.config.allowSurrender && hand.history.length === 0) {
    actions.push('surrender');
  }

  if (state.flags.offerInsurance && !state.player.hasTakenInsurance && hand.history.length === 0) {
    const insuranceCost = Math.floor(hand.bet / 2);
    if (availableBalance >= insuranceCost) {
      actions.push('insurance');
    }
  }

  return actions;
};

const advanceToNextHand = (state) => {
  const nextIndex = state.player.hands.findIndex(
    (hand, idx) => idx > state.player.activeHandIndex && hand.status === 'playing'
  );
  if (nextIndex === -1) {
    state.status = 'dealer-turn';
    state.player.activeHandIndex = Math.min(state.player.activeHandIndex, state.player.hands.length - 1);
  } else {
    state.player.activeHandIndex = nextIndex;
  }
  return state;
};

const markHandCompleteIfNeeded = (hand) => {
  if (hand.evaluation.isBust) {
    hand.status = 'bust';
  } else if (hand.evaluation.bestTotal >= 21) {
    hand.status = 'stood';
  }
};

const takeInsurance = (state, hand) => {
  const insuranceBet = Math.floor(hand.bet / 2);
  state.player.insuranceBet = insuranceBet;
  state.player.hasTakenInsurance = true;
  state.bets.insuranceBet = insuranceBet;
  state.bets.totalWager += insuranceBet;
  hand.history.push({ type: 'insurance', at: Date.now(), amount: insuranceBet });
  state.flags.offerInsurance = false;
  return state;
};

const handleSplit = (state, hand) => {
  const { config } = state;
  const [firstCard, secondCard] = hand.cards;
  const newHands = clone(state.player.hands);

  const firstHand = {
    ...hand,
    cards: [firstCard],
    evaluation: evaluateHand([firstCard]),
    status: 'playing',
    hasSplit: true,
    history: [...hand.history, { type: 'split-root', at: Date.now() }]
  };

  const secondHand = {
    ...hand,
    id: `hand-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    cards: [secondCard],
    evaluation: evaluateHand([secondCard]),
    status: 'playing',
    hasSplit: true,
    history: [{ type: 'split-child', at: Date.now() }]
  };

  const drawFirst = drawCard(state.shoe);
  firstHand.cards.push(drawFirst.card);
  firstHand.evaluation = evaluateHand(firstHand.cards);
  state.shoe = drawFirst.shoe;

  const drawSecond = drawCard(state.shoe);
  secondHand.cards.push(drawSecond.card);
  secondHand.evaluation = evaluateHand(secondHand.cards);
  state.shoe = drawSecond.shoe;

  firstHand.canSplit = firstHand.cards.length === 2
    && getCardNumericValue(firstHand.cards[0]) === getCardNumericValue(firstHand.cards[1]);
  secondHand.canSplit = secondHand.cards.length === 2
    && getCardNumericValue(secondHand.cards[0]) === getCardNumericValue(secondHand.cards[1]);

  if (firstCard.rank === 'A' && !config.allowResplitAces) {
    firstHand.canSplit = false;
    secondHand.canSplit = false;
  }

  if (firstCard.rank === 'A' && secondCard.rank === 'A' && !config.allowHitSplitAces) {
    firstHand.status = 'stood';
    secondHand.status = 'stood';
  }

  newHands[state.player.activeHandIndex] = firstHand;
  newHands.splice(state.player.activeHandIndex + 1, 0, secondHand);

  state.player.hands = newHands;
  state.bets.totalWager += hand.bet;

  return state;
};

export const applyPlayerAction = (roundState, action, options = {}) => {
  const state = clone(roundState);
  const { availableBalance = 0 } = options;

  if (state.status !== 'player-turn') {
    throw new Error('Player actions are not allowed at this stage');
  }

  const hand = state.player.hands[state.player.activeHandIndex];
  if (!hand || hand.status !== 'playing') {
    return state;
  }

  state.metadata = state.metadata || {};
  state.metadata.lastBetDelta = 0;
  state.metadata.lastAction = action.type;
  if (action.type !== 'insurance') {
    state.flags.offerInsurance = false;
  }

  switch (action.type) {
    case 'hit': {
      const draw = drawCard(state.shoe);
      hand.cards.push(draw.card);
      hand.evaluation = evaluateHand(hand.cards);
      hand.history.push({ type: 'hit', at: Date.now(), card: cardToString(draw.card) });
      state.history.push({ type: 'hit', at: Date.now(), handId: hand.id, card: cardToString(draw.card) });
      state.shoe = draw.shoe;
      markHandCompleteIfNeeded(hand);
      if (hand.status !== 'playing') {
        advanceToNextHand(state);
      }
      break;
    }
    case 'stand': {
      state.history.push({ type: 'stand', at: Date.now(), handId: hand.id });
      hand.status = 'stood';
      hand.history.push({ type: 'stand', at: Date.now() });
      advanceToNextHand(state);
      break;
    }
    case 'double': {
      if (hand.hasDoubled || hand.cards.length !== 2) {
        throw new Error('Double down not permitted');
      }
      if (availableBalance < hand.bet) {
        throw new Error('Insufficient balance to double');
      }
      const originalBet = hand.bet;
      hand.bet += originalBet;
      state.bets.totalWager += originalBet;
      hand.hasDoubled = true;
      const draw = drawCard(state.shoe);
      hand.cards.push(draw.card);
      hand.evaluation = evaluateHand(hand.cards);
      hand.history.push({ type: 'double', at: Date.now(), card: cardToString(draw.card) });
      state.shoe = draw.shoe;
      hand.status = hand.evaluation.isBust ? 'bust' : 'stood';
      state.metadata.lastBetDelta = originalBet;
      state.history.push({ type: 'double', at: Date.now(), handId: hand.id, additionalBet: originalBet });
      advanceToNextHand(state);
      break;
    }
    case 'split': {
      if (hand.cards.length !== 2) {
        throw new Error('Cannot split without exactly two cards');
      }
      if (availableBalance < hand.bet) {
        throw new Error('Insufficient balance to split');
      }
      const additionalBet = hand.bet;
      state.history.push({ type: 'split', at: Date.now(), handId: hand.id, additionalBet });
      handleSplit(state, hand);
      state.metadata.lastBetDelta = additionalBet;
      break;
    }
    case 'surrender': {
      if (!state.config.allowSurrender || hand.history.length > 0) {
        throw new Error('Surrender not permitted now');
      }
      hand.status = 'surrendered';
      hand.result = 'surrender';
      hand.history.push({ type: 'surrender', at: Date.now() });
      state.history.push({ type: 'surrender', at: Date.now(), handId: hand.id });
      state.status = state.player.hands.every((h) => h.status !== 'playing') ? 'dealer-turn' : state.status;
      break;
    }
    case 'insurance': {
      if (!state.flags.offerInsurance || state.player.hasTakenInsurance) {
        throw new Error('Insurance not available');
      }
      const insuranceCost = Math.floor(hand.bet / 2);
      if (availableBalance < insuranceCost) {
        throw new Error('Insufficient balance for insurance');
      }
      takeInsurance(state, hand);
      state.metadata.lastBetDelta = insuranceCost;
      state.history.push({ type: 'insurance', at: Date.now(), amount: insuranceCost });
      break;
    }
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }

  state.lastActionAt = Date.now();

  if (state.status !== 'dealer-turn') {
    const stillPlaying = state.player.hands.some((h) => h.status === 'playing');
    if (!stillPlaying) {
      state.status = 'dealer-turn';
    }
  }

  return state;
};

export const playDealer = (roundState) => {
  const state = clone(roundState);
  if (state.status !== 'dealer-turn') {
    return state;
  }

  state.dealer.revealHoleCard = true;
  let dealerEval = evaluateHand(state.dealer.cards);

  const playerHasActive = state.player.hands.some(
    (hand) => !['bust', 'surrender'].includes(hand.status)
  );

  if (!playerHasActive) {
    state.status = 'completed';
    state.dealer.evaluation = dealerEval;
    return state;
  }

  const playerHasNatural = state.flags.playerHasNatural;
  const dealerHasNatural = state.flags.dealerHasNatural;

  if (dealerHasNatural || playerHasNatural) {
    state.status = 'completed';
    state.dealer.evaluation = dealerEval;
    return state;
  }

  while (shouldDealerDraw(dealerEval, state.config)) {
    const draw = drawCard(state.shoe);
    state.dealer.cards.push(draw.card);
    dealerEval = evaluateHand(state.dealer.cards);
    state.shoe = draw.shoe;
  }

  state.dealer.evaluation = dealerEval;
  state.status = 'completed';
  return state;
};

const settleHand = (hand, dealerEval, config) => {
  const result = {
    outcome: 'loss',
    winnings: 0,
    net: -hand.bet,
    handTotal: hand.evaluation.bestTotal,
    dealerTotal: dealerEval.bestTotal
  };

  if (hand.status === 'surrendered') {
    result.outcome = 'surrender';
    result.winnings = Math.floor(hand.bet / 2);
    result.net = -Math.floor(hand.bet / 2);
    return result;
  }

  if (hand.status === 'bust') {
    return result;
  }

  const playerEval = hand.evaluation;

  if (playerEval.isBlackjack && dealerEval.isBlackjack) {
    result.outcome = 'push';
    result.winnings = hand.bet;
    result.net = 0;
    return result;
  }

  if (playerEval.isBlackjack && !dealerEval.isBlackjack) {
    const payout = Math.round(hand.bet * (1 + config.blackjackPayout));
    result.outcome = 'blackjack';
    result.winnings = payout;
    result.net = payout - hand.bet;
    return result;
  }

  if (dealerEval.isBlackjack && !playerEval.isBlackjack) {
    return result;
  }

  if (dealerEval.isBust) {
    const payout = hand.bet * 2;
    result.outcome = 'win';
    result.winnings = payout;
    result.net = hand.bet;
    return result;
  }

  if (playerEval.bestTotal > dealerEval.bestTotal) {
    const payout = hand.bet * 2;
    result.outcome = 'win';
    result.winnings = payout;
    result.net = hand.bet;
    return result;
  }

  if (playerEval.bestTotal === dealerEval.bestTotal) {
    result.outcome = 'push';
    result.winnings = hand.bet;
    result.net = 0;
    return result;
  }

  return result;
};

export const settleRound = (roundState) => {
  const state = clone(roundState);
  if (state.status !== 'completed') {
    throw new Error('Cannot settle round before completion');
  }

  const dealerEval = state.dealer.evaluation || evaluateHand(state.dealer.cards);
  const handResults = [];

  state.player.hands = state.player.hands.map((hand) => {
    const result = settleHand(hand, dealerEval, state.config);
    hand.result = result.outcome;
    hand.payout = result.winnings;
    hand.net = result.net;
    handResults.push({
      handId: hand.id,
      outcome: result.outcome,
      wager: hand.bet,
      payout: result.winnings,
      net: result.net,
      cards: hand.cards.map(cardToString),
      total: hand.evaluation.bestTotal
    });
    return hand;
  });

  let insurancePayout = 0;
  if (state.player.hasTakenInsurance) {
    if (dealerEval.isBlackjack) {
      insurancePayout = state.player.insuranceBet * 3;
    }
  }

  const totalWager = state.player.hands.reduce((sum, hand) => sum + hand.bet, 0);
  const insuranceBet = state.player.insuranceBet;
  const totalPayout = handResults.reduce((sum, item) => sum + item.payout, 0) + insurancePayout;
  const netResult = totalPayout - (totalWager + insuranceBet);

  const summary = {
    roundId: state.roundId,
    dealerCards: state.dealer.cards.map(cardToString),
    dealerTotal: dealerEval.bestTotal,
    dealerBust: dealerEval.isBust,
    handResults,
    totals: {
      wagered: totalWager,
      insuranceBet,
      payout: totalPayout,
      net: netResult
    },
    insurance: {
      placed: state.player.hasTakenInsurance,
      bet: insuranceBet,
      payout: insurancePayout
    }
  };

  state.status = 'settled';
  state.summary = summary;
  return state;
};

export const serializeRoundState = (state) => {
  const serialized = clone(state);
  if (serialized.dealer && !serialized.dealer.revealHoleCard) {
    const hiddenCards = serialized.dealer.cards.map((card, idx) => (idx === 0 ? card : { rank: '##', suit: '?' }));
    serialized.dealer.cards = hiddenCards;
  }
  return serialized;
};

export default {
  DEFAULT_CONFIG,
  initializeShoe,
  drawCard,
  createRoundState,
  getAvailableActions,
  applyPlayerAction,
  playDealer,
  settleRound,
  serializeRoundState,
  evaluateHand,
  cardToString
};

