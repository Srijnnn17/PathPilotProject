import express from 'express';
const router = express.Router();
import { getTopics, submitQuiz } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/topics').get(protect, getTopics); // Protect this route
router.route('/submit').post(protect, submitQuiz); // Add submit route

export default router;