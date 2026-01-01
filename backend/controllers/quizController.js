import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import Topic from '../models/topicModel.js';
import User from '../models/userModel.js';
import QuizAttempt from '../models/quizAttemptModel.js';
import LearningPath from '../models/learningPathModel.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

/* =======================
   GEMINI SDK SETUP
======================= */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateWithGemini = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

/* =======================
   FALLBACK LEARNING PATH
======================= */
const getFallbackPath = (topicName, skillLevel) => [
  {
    title: `${topicName} Fundamentals (${skillLevel})`,
    difficulty: 'Beginner',
    description: `A solid introduction to ${topicName} tailored for your ${skillLevel} skill level.`,
    resources: [
      { title: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/" },
      { title: "W3Schools", url: "https://www.w3schools.com/" }
    ]
  },
  {
    title: `Core Concepts of ${topicName}`,
    difficulty: 'Intermediate',
    description: 'Deep dive into the essential logic and structure.',
    resources: [
      { title: "FreeCodeCamp", url: "https://www.freecodecamp.org/" },
      { title: "GeeksForGeeks", url: "https://www.geeksforgeeks.org/" }
    ]
  },
  {
    title: `Advanced ${topicName} Techniques`,
    difficulty: 'Advanced',
    description: 'Mastering performance, security, and best practices.',
    resources: [
      { title: "Official Documentation", url: "https://devdocs.io/" },
      { title: "YouTube Crash Course", url: "https://www.youtube.com/" }
    ]
  }
];

/* =======================
   CONTROLLERS
======================= */

// @desc    Get all topics
// @route   GET /api/topics
// @access  Private
const getTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find({});
  res.status(200).json(topics);
});

// @desc    Submit quiz, update skill, generate learning path
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

  /* ---------- SCORE ---------- */
  let score = 0;
  questions.forEach((q) => {
    const userResponse = responses.find((r) => r.question === q.question);
    if (userResponse && userResponse.userAnswer === q.correctAnswer) {
      score++;
    }
  });

  const percentage = (score / questions.length) * 100;
  let skillLevel =
    percentage < 40 ? 'Beginner' :
    percentage < 75 ? 'Intermediate' :
    'Advanced';

  /* ---------- UPDATE USER SKILL ---------- */
  const user = await User.findById(userId);
  if (user) {
    user.skills.set(topic._id.toString(), skillLevel);
    await user.save();
  }

  /* ---------- AI LEARNING PATH ---------- */
  let aiGeneratedModules = [];

  try {
    const prompt = `
      Create a learning path for "${topicName}".
      User skill level: ${skillLevel}.
      Output STRICT JSON only with key "modules".

      Each module:
      - title
      - difficulty
      - description
      - resources: [{ "title", "url" }]

      Use MDN and W3Schools.
    `;

    const text = await generateWithGemini(prompt);

    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) {
      throw new Error('Invalid JSON from Gemini');
    }

    const parsed = JSON.parse(text.slice(start, end + 1));
    if (parsed.modules) aiGeneratedModules = parsed.modules;

  } catch (err) {
    console.error("❌ Gemini Error:", err.message || err);
    aiGeneratedModules = getFallbackPath(topicName, skillLevel);
  }

  /* ---------- SAVE LEARNING PATH ---------- */
  await LearningPath.findOneAndUpdate(
    { user: userId, topic: topic._id },
    { user: userId, topic: topic._id, modules: aiGeneratedModules },
    { upsert: true, new: true }
  );

  /* ---------- SAVE QUIZ ATTEMPT ---------- */
  const attempt = await QuizAttempt.create({
    user: userId,
    topic: topic._id,
    topicName,
    score,
    totalQuestions: questions.length,
    responses: questions.map((q) => ({
      ...q,
      userAnswer:
        responses.find((r) => r.question === q.question)?.userAnswer || null,
    })),
  });

  res.status(201).json({ attempt, skillLevel });
});

// @desc    Get logged-in user's attempts
// @route   GET /api/quizzes/my-attempts
// @access  Private
const getMyQuizAttempts = asyncHandler(async (req, res) => {
  const attempts = await QuizAttempt
    .find({ user: req.user._id })
    .populate('topic', 'name');

  res.status(200).json(attempts);
});

export { getTopics, submitQuiz, getMyQuizAttempts };
