import asyncHandler from 'express-async-handler';
import Topic from '../models/topicModel.js';
import User from '../models/userModel.js';
import QuizAttempt from '../models/quizAttemptModel.js';
import LearningPath from '../models/learningPathModel.js';

// @desc    Get all topics
// @route   GET /api/topics
// @access  Private
const getTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find({});
  res.status(200).json(topics);
});

// @desc    Submit a quiz attempt, update skill, and generate learning path
// @route   POST /api/quizzes/submit
// @access  Private
const submitQuiz = asyncHandler(async (req, res) => {
  const { topicName, responses, questions } = req.body;
  const userId = req.user._id;

  if (!topicName || !responses || !questions) {
    res.status(400);
    throw new Error('Missing required quiz data');
  }

  const topic = await Topic.findOne({ name: topicName });
  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  // --- Calculate Score ---
  let score = 0;
  questions.forEach((question) => {
    const userResponse = responses.find(res => res.question === question.question);
    if (userResponse && userResponse.userAnswer === question.correctAnswer) {
      score++;
    }
  });

  // --- Determine Skill Level ---
  const percentage = (score / questions.length) * 100;
  let skillLevel;
  if (percentage < 40) {
    skillLevel = 'Beginner';
  } else if (percentage < 75) {
    skillLevel = 'Intermediate';
  } else {
    skillLevel = 'Advanced';
  }

  // --- Update User's Skill ---
  const user = await User.findById(userId);
  if (user) {
    user.skills.set(topicName, skillLevel);
    await user.save();
  }

  // --- Generate a Simple Learning Path ---
  // (This is a placeholder; we will make this more dynamic later with AI)
  const modules = [
    { title: `${topicName} Fundamentals`, difficulty: 'Beginner' },
    { title: `Intermediate ${topicName}`, difficulty: 'Intermediate' },
    { title: `Advanced ${topicName} Concepts`, difficulty: 'Advanced' },
  ];
  
  await LearningPath.findOneAndUpdate(
    { user: userId, topic: topic._id },
    { 
      user: userId,
      topic: topic._id,
      modules: modules
    },
    { upsert: true, new: true, setDefaultsOnInsert: true } // Upsert: creates if not found, updates if found
  );

  // --- Save Quiz Attempt ---
  const attempt = await QuizAttempt.create({
    user: userId,
    topic: topic._id,
    topicName,
    score,
    totalQuestions: questions.length,
    responses: questions.map(q => ({
      ...q,
      userAnswer: responses.find(res => res.question === q.question)?.userAnswer || null,
    })),
  });

  res.status(201).json({ attempt, skillLevel });
});

// @desc    Get logged in user's quiz attempts
// @route   GET /api/quizzes/my-attempts
// @access  Private
const getMyQuizAttempts = asyncHandler(async (req, res) => {
  const attempts = await QuizAttempt.find({ user: req.user._id }).populate('topic', 'name');
  res.status(200).json(attempts);
});

export { getTopics, submitQuiz, getMyQuizAttempts };