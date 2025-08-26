import express from 'express';
const router = express.Router();
import { generateQuiz } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

// This route will be protected, so only logged-in users can generate quizzes
router.route('/generate-quiz/:topicName').get(protect, generateQuiz);

export default router;