import express from 'express';
const router = express.Router();
import { generateQuiz, generateLearningPath } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

// 👇 CHANGED: Switched from .get() to .post()
// This allows the backend to read the 'score' and 'total' from the request body.
router.route('/generate-quiz/:topicName').post(protect, generateQuiz);
router.route('/generate-path/:topicName').post(protect, generateLearningPath);

export default router;