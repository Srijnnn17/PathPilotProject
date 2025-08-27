import asyncHandler from 'express-async-handler';
import Topic from '../models/topicModel.js';
import QuizAttempt from '../models/quizAttemptModel.js';

// @desc    Get all topics
// @route   GET /api/topics
// @access  Private
const getTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find({});
  res.status(200).json(topics);
});

// @desc    Submit a quiz attempt
// @route   POST /api/quizzes/submit
// @access  Private
const submitQuiz = asyncHandler(async (req, res) => {
  const { topicName, responses, questions } = req.body;
  const userId = req.user._id;

  if (!topicName || !responses || !questions) {
    res.status(400);
    throw new Error('Missing required quiz data');
  }

  // Find the topic by name to get its ID
  const topic = await Topic.findOne({ name: topicName });
  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  // Securely calculate score on the backend
  let score = 0;
  questions.forEach((question) => {
    const userResponse = responses.find(res => res.question === question.question);
    if (userResponse && userResponse.userAnswer === question.correctAnswer) {
      score++;
    }
  });

  const attempt = await QuizAttempt.create({
    user: userId,
    topic: topic._id, // Use the found topic ID
    topicName, // We can also save the name for convenience
    score,
    totalQuestions: questions.length,
    responses: questions.map(q => ({
      ...q,
      userAnswer: responses.find(res => res.question === q.question)?.userAnswer || null,
    })),
  });

  res.status(201).json(attempt);
});

// @desc    Get logged in user's quiz attempts
// @route   GET /api/quizzes/my-attempts
// @access  Private
const getMyQuizAttempts = asyncHandler(async (req, res) => {
  const attempts = await QuizAttempt.find({ user: req.user._id }).populate('topic', 'name');
  res.status(200).json(attempts);
});

export { getTopics, submitQuiz, getMyQuizAttempts };