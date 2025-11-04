import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  getUsers,
  getWithdrawals,
  approveWithdrawal,
  rejectWithdrawal
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/users', getUsers);
router.get('/withdrawals', getWithdrawals);
router.post('/withdrawals/:id/approve', approveWithdrawal);
router.post('/withdrawals/:id/reject', rejectWithdrawal);

export default router;

