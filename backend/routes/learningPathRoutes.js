import express from 'express';
const router = express.Router();
import { getLearningPath } from '../controllers/learningPathController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/:topicId').get(protect, getLearningPath);

export default router;