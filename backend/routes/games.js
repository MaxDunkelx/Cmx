import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  spinSlots,
  spinRoulette,
  playBlackjack,
  playPoker
} from '../controllers/gameController.js';

const router = express.Router();

router.use(protect);
router.post('/slots/spin', spinSlots);
router.post('/roulette/spin', spinRoulette);
router.post('/blackjack/play', playBlackjack);
router.post('/poker/play', playPoker);

export default router;

