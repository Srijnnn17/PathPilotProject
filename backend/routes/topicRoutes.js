import express from 'express';
const router = express.Router();
import { getTopics } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getTopics);

export default router;