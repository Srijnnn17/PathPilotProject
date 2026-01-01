import express from 'express';
const router = express.Router();

// 1. Import Controllers
// ✅ FIXED: Imported from 'topicController.js' where we defined it
import { createTopic, getAllTopics } from '../controllers/topicController.js'; 
import { generateQuiz, generateLearningPath } from '../controllers/aiController.js';

import { protect } from '../middleware/authMiddleware.js';

// --- ROUTES ---

// GET /api/topics/ -> Get all topics
// POST /api/topics/ -> Create a topic
router.route('/').get(protect, getAllTopics).post(protect, createTopic);

// POST /api/topics/generate-quiz/:topicName
// ✅ FIXED: Changed to .post() and URL to /generate-quiz/ to match Frontend
router.route('/generate-quiz/:topicName').post(protect, generateQuiz);

// POST /api/topics/generate-path/:topicName
// ✅ FIXED: Already .post(), matches Frontend
router.route('/generate-path/:topicName').post(protect, generateLearningPath);

export default router;