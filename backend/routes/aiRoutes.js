import express from 'express';
import { generateQuiz } from '../controllers/aiController.js';

const router = express.Router();

// Correct: use :topicId
router.get('/generate-quiz/:topicId', generateQuiz);

export default router;