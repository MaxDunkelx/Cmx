import express from 'express';
import { protect } from '../middleware/auth.js';
import { getBalance, getTransactions, createWallet } from '../controllers/walletController.js';

const router = express.Router();

router.use(protect);
router.post('/initialize', createWallet);
router.get('/balance', getBalance);
router.get('/transactions', getTransactions);

export default router;

