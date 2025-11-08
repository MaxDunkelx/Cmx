import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  spinSlots,
  spinRoulette,
  startBlackjackRound,
  actOnBlackjackRound,
  settleBlackjackRound,
  getBlackjackRoundState,
  legacyPlayBlackjack,
  playPoker
} from '../controllers/gameController.js';

const router = express.Router();

router.use(protect);
router.post('/slots/spin', spinSlots);
router.post('/roulette/spin', spinRoulette);
router.post('/blackjack/start', startBlackjackRound);
router.post('/blackjack/action', actOnBlackjackRound);
router.post('/blackjack/settle', settleBlackjackRound);
router.get('/blackjack/state/:roundId', getBlackjackRoundState);
router.post('/blackjack/play', legacyPlayBlackjack);
router.post('/poker/play', playPoker);

export default router;

