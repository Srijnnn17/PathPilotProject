import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import Topic from '../models/topicModel.js';
import User from '../models/userModel.js';
import QuizAttempt from '../models/quizAttemptModel.js';
import LearningPath from '../models/learningPathModel.js';

dotenv.config();

// --- 1. THE SAFETY NET (Fallback Path) ---
// Used if AI fails so the user still gets a result
const getFallbackPath = (topicName, skillLevel) => [
  { 
    title: `${topicName} Fundamentals (${skillLevel})`, 
    difficulty: 'Beginner',
    description: `A solid introduction to ${topicName} tailored for your ${skillLevel} skill level.`,
    resources: [
      { name: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/" },
      { name: "W3Schools", url: "https://www.w3schools.com/" }
    ]
  },
  { 
    title: `Core Concepts of ${topicName}`, 
    difficulty: 'Intermediate',
    description: 'Deep dive into the essential logic and structure.',
    resources: [
      { name: "FreeCodeCamp", url: "https://www.freecodecamp.org/" },
      { name: "GeeksForGeeks", url: "https://www.geeksforgeeks.org/" }
    ]
  },
  { 
    title: `Advanced ${topicName} Techniques`, 
    difficulty: 'Advanced',
    description: 'Mastering performance, security, and best practices.',
    resources: [
      { name: "Official Documentation", url: "https://devdocs.io/" },
      { name: "YouTube Crash Course", url: "https://www.youtube.com/" }
    ]
  }
];

const callGeminiDirectly = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${apiKey}`;

  console.log("🤖 Asking Gemini...");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Gemini API Error");
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text;
};


// --- 3. CONTROLLERS ---

// @desc    Get all topics
// @route   GET /api/topics
// @access  Private
const getTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find({});
  res.status(200).json(topics);
});

// @desc    Submit a quiz attempt, update skill, and generate AI learning path
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

  // --- 1. Calculate Score ---
  let score = 0;
  questions.forEach((question) => {
    const userResponse = responses.find((res) => res.question === question.question);
    if (userResponse && userResponse.userAnswer === question.correctAnswer) {
      score++;
    }
  });

  // --- 2. Determine Skill Level ---
  const percentage = (score / questions.length) * 100;
  let skillLevel;
  if (percentage < 40) skillLevel = 'Beginner';
  else if (percentage < 75) skillLevel = 'Intermediate';
  else skillLevel = 'Advanced';

  // --- 3. Update User's Skill ---
  const user = await User.findById(userId);
  if (user) {
    user.skills.set(topic._id.toString(), skillLevel);
    await user.save();
  }

  // --- 4. Generate REAL AI Learning Path ---
  let aiGeneratedModules = [];

  try {
    const prompt = `
      Create a learning path for: "${topicName}".
      User Skill: ${skillLevel} (Score: ${percentage}%).
      
      **Requirements**:
      1. 3-5 modules.
      2. **Resources**: 2 links per module (MDN/W3Schools).
      3. **Output**: JSON only. Key "modules".
      
      **JSON Structure**:
      {
        "modules": [
          {
            "title": "Module Title",
            "difficulty": "Beginner",
            "description": "Short description...",
            "resources": [
              { "title": "MDN Guide", "url": "https://developer.mozilla.org" },
              { "title": "W3Schools", "url": "https://www.w3schools.com" }
            ]
          }
        ]
      }
    `;

    const text = await callGeminiDirectly(prompt);

    // Clean JSON
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
       const jsonText = text.substring(start, end + 1);
       const parsedData = JSON.parse(jsonText);
       if (parsedData.modules) aiGeneratedModules = parsedData.modules;
    } else {
       throw new Error("Invalid JSON format from AI");
    }

  } catch (error) {
    console.error(`⚠️ AI Path Gen Failed: ${error.message}. Switching to Backup.`);
    // FAILSAFE: Use backup modules
    aiGeneratedModules = getFallbackPath(topicName, skillLevel);
  }
  
  // --- 5. Save Learning Path to Database ---
  await LearningPath.findOneAndUpdate(
    { user: userId, topic: topic._id },
    { 
      user: userId,
      topic: topic._id,
      modules: aiGeneratedModules 
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // --- 6. Save Quiz Attempt ---
  const attempt = await QuizAttempt.create({
    user: userId,
    topic: topic._id,
    topicName,
    score,
    totalQuestions: questions.length,
    responses: questions.map((q) => ({
      ...q,
      userAnswer: responses.find((res) => res.question === q.question)?.userAnswer || null,
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