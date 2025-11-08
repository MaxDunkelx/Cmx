import GameSession from '../models/GameSession.js';
import Wallet from '../models/Wallet.js';
import BlackjackRound from '../models/BlackjackRound.js';
import { createProvablyFairConfig, generateSeed } from '../utils/provablyFair.js';
import { generateSlotsResult, generateRouletteResult, generatePokerHand } from '../utils/gameLogic.js';
import {
  initializeShoe,
  createRoundState,
  getAvailableActions,
  applyPlayerAction,
  playDealer,
  settleRound,
  serializeRoundState,
  cardToString
} from '../services/blackjackEngine.js';

const BLACKJACK_LIMITS = {
  minBet: 100,
  maxBet: 100000
};

const ACTIVE_ROUND_STATUSES = ['player-turn', 'dealer-turn', 'completed'];

const buildRoundId = () => `bj-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const cloneDeep = (value) => JSON.parse(JSON.stringify(value));

const formatCard = (card) => {
  if (!card) return '';
  if (typeof card === 'string') return card;
  if (card.rank === '##') {
    return '??';
  }
  return cardToString(card);
};

const hydrateRoundState = (roundDoc) => {
  const state = cloneDeep(roundDoc.state || {});
  state.shoe = cloneDeep(roundDoc.shoe || {});
  return state;
};

const persistRoundState = (roundDoc, engineState) => {
  const snapshot = cloneDeep(engineState);
  const { shoe, ...stateWithoutShoe } = snapshot;

  roundDoc.shoe = shoe;
  roundDoc.state = stateWithoutShoe;
  roundDoc.status = stateWithoutShoe.status;
  roundDoc.history = stateWithoutShoe.history || [];
  roundDoc.tableConfig = stateWithoutShoe.config || {};
  roundDoc.lastActionAt = new Date(stateWithoutShoe.lastActionAt || Date.now());
  if (stateWithoutShoe.summary) {
    roundDoc.summary = stateWithoutShoe.summary;
  }

  roundDoc.markModified('shoe');
  roundDoc.markModified('state');
  roundDoc.markModified('history');
  roundDoc.markModified('tableConfig');
  roundDoc.markModified('summary');
};

const mapHandForClient = (hand) => ({
  id: hand.id,
  cards: (hand.cards || []).map(cardToString),
  bet: hand.bet,
  status: hand.status,
  canSplit: hand.canSplit,
  hasDoubled: hand.hasDoubled,
  evaluation: hand.evaluation,
  history: hand.history || []
});

const buildPublicRoundState = (roundDoc, availableBalance = 0) => {
  const engineState = hydrateRoundState(roundDoc);
  const serialized = serializeRoundState(engineState);
  delete serialized.shoe;

  const dealerCards = (serialized.dealer.cards || []).map(formatCard);
  const playerHands = (serialized.player.hands || []).map(mapHandForClient);

  const availableActions =
    serialized.status === 'player-turn'
      ? getAvailableActions(engineState, { availableBalance })
      : [];

  return {
    roundId: serialized.roundId,
    status: serialized.status,
    dealer: {
      cards: dealerCards,
      revealHoleCard: serialized.dealer.revealHoleCard,
      evaluation: serialized.dealer.revealHoleCard ? serialized.dealer.evaluation : null
    },
    player: {
      hands: playerHands,
      activeHandIndex: serialized.player.activeHandIndex
    },
    flags: serialized.flags,
    insurance: {
      offered: serialized.flags.offerInsurance,
      placed: serialized.player.hasTakenInsurance,
      bet: roundDoc.insuranceBet || 0
    },
    history: serialized.history,
    summary: serialized.summary || roundDoc.summary,
    tableConfig: serialized.config,
    lastActionAt: serialized.lastActionAt,
    createdAt: roundDoc.createdAt,
    availableActions,
    lockedAmount: roundDoc.lockedAmount,
    insuranceBet: roundDoc.insuranceBet
  };
};

export const spinSlots = async (req, res, next) => {
  try {
    const { betAmount } = req.body;
    const userId = req.user.id;
    
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.currentBalance < betAmount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }
    
    const { seed, hash, publicHash } = createProvablyFairConfig();
    const result = generateSlotsResult(seed, betAmount);
    
    console.log('🎰 BACKEND GENERATING SLOTS:');
    console.log('  - Reels array:', result.reels);
    console.log('  - Reels length:', result.reels.length);
    console.log('  - Grid:', result.grid);
    console.log('  - Result:', result.result);
    console.log('  - Win amount:', result.winAmount);
    
    wallet.currentBalance -= betAmount;
    wallet.totalLost += betAmount;
    
    if (result.winAmount > 0) {
      wallet.currentBalance += result.winAmount;
      wallet.totalEarned += result.winAmount;
    }
    
    const session = await GameSession.create({
      userId,
      gameType: 'slots',
      gameId: `slots-${Date.now()}`,
      betAmount,
      winAmount: result.winAmount,
      result: result.result,
      details: result,
      seed,
      hash,
      publicHash,
      completedAt: Date.now()
    });
    
    await wallet.save();
    
    const responseData = {
      ...result,
      balance: wallet.currentBalance,
      sessionId: session._id
    };
    
    console.log('📤 SENDING TO FRONTEND:', responseData);
    console.log('📤 Response reels:', responseData.reels);
    
    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};

export const spinRoulette = async (req, res, next) => {
  try {
    const { betAmount, betNumber, betType } = req.body;
    const userId = req.user.id;
    
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.currentBalance < betAmount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }
    
    const { seed, hash, publicHash } = createProvablyFairConfig();
    const result = generateRouletteResult(seed, betAmount, betNumber, betType);
    
    wallet.currentBalance -= betAmount;
    wallet.totalLost += betAmount;
    
    if (result.winAmount > 0) {
      wallet.currentBalance += result.winAmount;
      wallet.totalEarned += result.winAmount;
    }
    
    const session = await GameSession.create({
      userId,
      gameType: 'roulette',
      gameId: `roulette-${Date.now()}`,
      betAmount,
      winAmount: result.winAmount,
      result: result.result,
      details: result,
      seed,
      hash,
      publicHash,
      completedAt: Date.now()
    });
    
    await wallet.save();
    
    res.status(200).json({
      success: true,
      data: {
        ...result,
        sessionId: session._id,
        newBalance: wallet.currentBalance
      }
    });
  } catch (error) {
    next(error);
  }
};

export const startBlackjackRound = async (req, res, next) => {
  try {
    const { betAmount, clientSeed } = req.body;
    const userId = req.user.id;

    const parsedBet = Number(betAmount);

    if (!Number.isFinite(parsedBet) || parsedBet <= 0 || !Number.isInteger(parsedBet)) {
      return res.status(400).json({
        success: false,
        message: 'Bet amount must be a positive whole number.'
      });
    }

    if (parsedBet < BLACKJACK_LIMITS.minBet || parsedBet > BLACKJACK_LIMITS.maxBet) {
      return res.status(400).json({
        success: false,
        message: `Bet must be between ${BLACKJACK_LIMITS.minBet.toLocaleString()} and ${BLACKJACK_LIMITS.maxBet.toLocaleString()} CMX.`
      });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.currentBalance < parsedBet) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    const activeRound = await BlackjackRound.findOne({
      userId,
      status: { $in: ACTIVE_ROUND_STATUSES }
    });

    if (activeRound) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active blackjack round. Finish it before starting a new one.',
        roundId: activeRound.roundId
      });
    }

    const { seed: serverSeed, hash: serverSeedHash, publicHash } = createProvablyFairConfig();
    const normalizedClientSeed =
      typeof clientSeed === 'string' && clientSeed.trim().length >= 8
        ? clientSeed.trim()
        : generateSeed();

    const nonce = '0';
    const roundId = buildRoundId();

    const shoe = initializeShoe({
      serverSeed,
      clientSeed: normalizedClientSeed,
      nonce
    });

    const engineState = createRoundState({
      shoeState: shoe,
      betAmount: parsedBet,
      metadata: {
        roundId,
        clientSeed: normalizedClientSeed
      }
    });

    wallet.currentBalance -= parsedBet;

    const snapshot = cloneDeep(engineState);
    const { shoe: shoeSnapshot, ...stateWithoutShoe } = snapshot;

    const roundDoc = new BlackjackRound({
      roundId,
      userId,
      status: stateWithoutShoe.status,
      betAmount: parsedBet,
      lockedAmount: parsedBet,
      insuranceBet: 0,
      provablyFair: {
        serverSeed,
        serverSeedHash,
        publicHash,
        clientSeed: normalizedClientSeed,
        nonce,
        shoeHash: shoe.provablyFair.shoeHash
      },
      shoe: shoeSnapshot,
      state: stateWithoutShoe,
      history: stateWithoutShoe.history || [],
      tableConfig: stateWithoutShoe.config || {},
      lastActionAt: new Date(stateWithoutShoe.lastActionAt || Date.now())
    });

    await roundDoc.save();
    await wallet.save();

    const payload = buildPublicRoundState(roundDoc, wallet.currentBalance);

    return res.status(200).json({
      success: true,
      data: {
        ...payload,
        balance: wallet.currentBalance,
        provablyFair: {
          serverSeedHash,
          publicHash,
          clientSeed: normalizedClientSeed,
          shoeHash: shoe.provablyFair.shoeHash
        },
        limits: BLACKJACK_LIMITS
      }
    });
  } catch (error) {
    next(error);
  }
};

export const actOnBlackjackRound = async (req, res, next) => {
  try {
    const { roundId, action } = req.body;
    const userId = req.user.id;

    if (!roundId || !action) {
      return res.status(400).json({
        success: false,
        message: 'Round ID and action are required.'
      });
    }

    const roundDoc = await BlackjackRound.findOne({ roundId, userId });
    if (!roundDoc) {
      return res.status(404).json({
        success: false,
        message: 'Blackjack round not found.'
      });
    }

    if (roundDoc.status === 'settled') {
      return res.status(400).json({
        success: false,
        message: 'This blackjack round has already been settled.'
      });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(400).json({
        success: false,
        message: 'Wallet not found for user.'
      });
    }

    const engineState = hydrateRoundState(roundDoc);

    if (engineState.status !== 'player-turn') {
      return res.status(400).json({
        success: false,
        message: 'No player action is available at this stage.'
      });
    }

    const normalizedAction = action.toString().toLowerCase();
    const availableActions = getAvailableActions(engineState, {
      availableBalance: wallet.currentBalance
    });

    if (!availableActions.includes(normalizedAction)) {
      return res.status(400).json({
        success: false,
        message: 'Requested action is not available.',
        availableActions
      });
    }

    const nextState = applyPlayerAction(
      engineState,
      { type: normalizedAction },
      { availableBalance: wallet.currentBalance }
    );

    const betDelta = nextState.metadata?.lastBetDelta || 0;
    if (betDelta > 0) {
      if (wallet.currentBalance < betDelta) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance for this action.'
        });
      }
      wallet.currentBalance -= betDelta;
      roundDoc.lockedAmount += betDelta;
      roundDoc.markModified('lockedAmount');

      if (normalizedAction === 'insurance') {
        roundDoc.insuranceBet += betDelta;
        roundDoc.markModified('insuranceBet');
      }
    }

    persistRoundState(roundDoc, nextState);

    await roundDoc.save();
    await wallet.save();

    const payload = buildPublicRoundState(roundDoc, wallet.currentBalance);

    return res.status(200).json({
      success: true,
      data: {
        ...payload,
        balance: wallet.currentBalance
      }
    });
  } catch (error) {
    next(error);
  }
};

export const settleBlackjackRound = async (req, res, next) => {
  try {
    const { roundId } = req.body;
    const userId = req.user.id;

    if (!roundId) {
      return res.status(400).json({
        success: false,
        message: 'Round ID is required.'
      });
    }

    const roundDoc = await BlackjackRound.findOne({ roundId, userId });
    if (!roundDoc) {
      return res.status(404).json({
        success: false,
        message: 'Blackjack round not found.'
      });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(400).json({
        success: false,
        message: 'Wallet not found for user.'
      });
    }

    if (roundDoc.status === 'settled') {
      const payload = buildPublicRoundState(roundDoc, wallet.currentBalance);
      return res.status(200).json({
        success: true,
        data: {
          ...payload,
          balance: wallet.currentBalance,
          provablyFair: roundDoc.provablyFair,
          summary: roundDoc.summary
        }
      });
    }

    let engineState = hydrateRoundState(roundDoc);

    if (engineState.status === 'player-turn') {
      return res.status(400).json({
        success: false,
        message: 'Player actions are still pending for this round.'
      });
    }

    if (engineState.status === 'dealer-turn') {
      engineState = playDealer(engineState);
    }

    engineState = settleRound(engineState);
    const summary = engineState.summary;
    const payout = summary.totals.payout;
    const net = summary.totals.net;

    wallet.currentBalance += payout;
    if (net > 0) {
      wallet.totalEarned += net;
    } else if (net < 0) {
      wallet.totalLost += Math.abs(net);
    }

    roundDoc.lockedAmount = 0;
    roundDoc.markModified('lockedAmount');
    roundDoc.insuranceBet = summary.insurance?.bet || roundDoc.insuranceBet || 0;
    roundDoc.markModified('insuranceBet');
    roundDoc.summary = summary;
    roundDoc.settledAt = new Date();
    roundDoc.provablyFair = {
      ...roundDoc.provablyFair,
      revealedAt: new Date()
    };
    roundDoc.markModified('provablyFair');

    persistRoundState(roundDoc, engineState);
    roundDoc.status = 'settled';

    await roundDoc.save();
    await wallet.save();

    const outcome = net > 0 ? 'win' : net < 0 ? 'loss' : 'draw';

    await GameSession.create({
      userId,
      gameType: 'blackjack',
      gameId: roundDoc.roundId,
      betAmount: summary.totals.wagered + (summary.totals.insuranceBet || 0),
      winAmount: payout,
      result: outcome,
      details: {
        ...summary,
        provablyFair: roundDoc.provablyFair
      },
      seed: roundDoc.provablyFair.serverSeed,
      hash: roundDoc.provablyFair.serverSeedHash,
      publicHash: roundDoc.provablyFair.publicHash,
      completedAt: new Date()
    });

    const payload = buildPublicRoundState(roundDoc, wallet.currentBalance);

    return res.status(200).json({
      success: true,
      data: {
        ...payload,
        balance: wallet.currentBalance,
        summary,
        provablyFair: {
          serverSeed: roundDoc.provablyFair.serverSeed,
          serverSeedHash: roundDoc.provablyFair.serverSeedHash,
          publicHash: roundDoc.provablyFair.publicHash,
          clientSeed: roundDoc.provablyFair.clientSeed,
          nonce: roundDoc.provablyFair.nonce,
          shoeHash: roundDoc.provablyFair.shoeHash
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getBlackjackRoundState = async (req, res, next) => {
  try {
    const { roundId } = req.params;
    const userId = req.user.id;

    const roundDoc = await BlackjackRound.findOne({ roundId, userId });
    if (!roundDoc) {
      return res.status(404).json({
        success: false,
        message: 'Blackjack round not found.'
      });
    }

    const wallet = await Wallet.findOne({ userId });
    const balance = wallet ? wallet.currentBalance : 0;

    const payload = buildPublicRoundState(roundDoc, balance);

    return res.status(200).json({
      success: true,
      data: {
        ...payload,
        balance
      }
    });
  } catch (error) {
    next(error);
  }
};

export const legacyPlayBlackjack = (req, res) => {
  return res.status(410).json({
    success: false,
    message: 'Legacy blackjack endpoint has been replaced. Use /api/games/blackjack/start, /action, and /settle.'
  });
};

export const playPoker = async (req, res, next) => {
  try {
    const hand = generatePokerHand(`${req.user.id}-${Date.now()}`);
    
    res.status(200).json({
      success: true,
      data: { hand }
    });
  } catch (error) {
    next(error);
  }
};

