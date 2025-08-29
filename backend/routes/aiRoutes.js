import express from 'express';
const router = express.Router();
import { generateQuiz, generateLearningPath } from '../controllers/aiController.js'; // 👈 Import
import { protect } from '../middleware/authMiddleware.js';

router.route('/generate-quiz/:topicName').get(protect, generateQuiz);
router.route('/generate-path/:topicName').get(protect, generateLearningPath); // 👈 Add this line

export default router;