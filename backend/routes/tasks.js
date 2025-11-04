import express from 'express';
import { protect } from '../middleware/auth.js';
import { getTasks, completeTask } from '../controllers/taskController.js';

const router = express.Router();

router.use(protect);
router.get('/', getTasks);
router.post('/:id/complete', completeTask);

export default router;

