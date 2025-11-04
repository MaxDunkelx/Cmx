import express from 'express';
import { protect } from '../middleware/auth.js';
import { requestWithdrawal, getWithdrawalHistory } from '../controllers/withdrawalController.js';

const router = express.Router();

router.use(protect);
router.post('/request', requestWithdrawal);
router.get('/history', getWithdrawalHistory);

export default router;

