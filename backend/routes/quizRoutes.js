import express from 'express';
const router = express.Router();
import { submitQuiz, getMyQuizAttempts } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/submit').post(protect, submitQuiz);
router.route('/my-attempts').get(protect, getMyQuizAttempts);

export default router;