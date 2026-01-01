import asyncHandler from 'express-async-handler';
import Topic from '../models/topicModel.js';
import User from '../models/userModel.js';
import QuizAttempt from '../models/quizAttemptModel.js';
import LearningPath from '../models/learningPathModel.js';

// @desc    Submit a quiz attempt, update skill, and generate learning path
// @route   POST /api/quizzes/submit
// @access  Private
const submitQuiz = asyncHandler(async (req, res) => {
  const { topicName, responses, questions } = req.body;
  const userId = req.user._id;

  console.log('[QUIZ SUBMIT] Received submission:', { topicName, userId, responsesCount: responses?.length, questionsCount: questions?.length });

  if (!topicName || !responses || !questions) {
    console.error('[QUIZ SUBMIT] Missing required data:', { topicName: !!topicName, responses: !!responses, questions: !!questions });
    res.status(400);
    throw new Error('Missing required quiz data');
  }

  // Try to find topic by exact name match first
  let topic = await Topic.findOne({ name: topicName });
  
  // If not found, try case-insensitive search
  if (!topic) {
    topic = await Topic.findOne({ name: { $regex: new RegExp(`^${topicName}$`, 'i') } });
  }

  // If still not found, create it (this ensures quiz can be saved even if topic wasn't seeded)
  if (!topic) {
    console.log(`[QUIZ SUBMIT] Topic "${topicName}" not found, creating it...`);
    topic = await Topic.create({
      name: topicName,
      description: `Quiz questions for ${topicName}`
    });
    console.log(`[QUIZ SUBMIT] Created topic:`, topic._id);
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
  // Use topic._id as the key to avoid "." issues
  const user = await User.findById(userId);
  if (user) {
    user.skills.set(topic._id.toString(), skillLevel);
    await user.save();
  }

  // --- Generate a Simple Learning Path ---
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
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // --- Save Quiz Attempt ---
  try {
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

    console.log(`[QUIZ SUBMIT] Successfully saved quiz attempt:`, attempt._id);
    res.status(201).json({ attempt, skillLevel });
  } catch (dbError) {
    console.error('[QUIZ SUBMIT] Database error saving attempt:', dbError);
    throw dbError;
  }
});

// @desc    Get logged in user's quiz attempts
// @route   GET /api/quizzes/my-attempts
// @access  Private
const getMyQuizAttempts = asyncHandler(async (req, res) => {
  const attempts = await QuizAttempt.find({ user: req.user._id })
    .populate('topic', 'name')
    .sort({ createdAt: -1 }); // Most recent first
  res.status(200).json(attempts);
});

export { submitQuiz, getMyQuizAttempts };