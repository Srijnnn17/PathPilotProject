import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import Google AI
import dotenv from 'dotenv';
import Topic from '../models/topicModel.js';
import User from '../models/userModel.js';
import QuizAttempt from '../models/quizAttemptModel.js';
import LearningPath from '../models/learningPathModel.js';

dotenv.config();

// Validate API key before initializing
if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set in environment variables');
  throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env file.');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
  if (percentage < 40) {
    skillLevel = 'Beginner';
  } else if (percentage < 75) {
    skillLevel = 'Intermediate';
  } else {
    skillLevel = 'Advanced';
  }

  // --- 3. Update User's Skill ---
  const user = await User.findById(userId);
  if (user) {
    user.skills.set(topic._id.toString(), skillLevel);
    await user.save();
  }

  // --- 4. Generate REAL AI Learning Path (Replaces hardcoded dummy data) ---
  let aiGeneratedModules = [];

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      **Objective**: Create a structured, personalized learning path for the topic specified below.  
      **Topic**: ${topicName}  
      **User Skill Level**: ${skillLevel} (The user just scored ${percentage}% on a quiz)

      **Instructions**:  
      1. Generate a list of 3 to 5 learning modules specifically tailored to a ${skillLevel} level learner.  
      2. For each module, provide:  
         - "title"  
         - "difficulty" level ('Beginner', 'Intermediate', or 'Advanced')  
         - "description" (2–3 sentences about what the learner will cover)  
         - "resources" → an array of at least 2 recommended learning resources.  
           - Each resource must have "name" and "url".  
           - Use only **real, well-known sources** (MDN, W3Schools, freeCodeCamp, official docs, etc.).  
      3. Your entire response must be a single, valid JSON object with a single key "modules".  
      4. Do not include any extra text or markdown formatting.

      **JSON Format**:  
      {
        "modules": [
          {
            "title": "Module Title",
            "difficulty": "Beginner",
            "description": "...",
            "resources": [ { "name": "...", "url": "..." } ]
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('AI service returned empty response');
    }
    
    // Clean the text to ensure pure JSON
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON Parse Error in learning path generation:', parseError);
      console.error('Raw AI Response:', text);
      throw new Error('AI service returned invalid JSON format');
    }
    
    if (parsedData.modules) {
        aiGeneratedModules = parsedData.modules;
    }

  } catch (error) {
    console.error("AI Generation failed, falling back to default:", error);
    // Fallback if AI fails so the app doesn't crash
    aiGeneratedModules = [
      { 
        title: `${topicName} Fundamentals`, 
        difficulty: 'Beginner',
        description: 'Core concepts (AI generation failed, showing default).',
        resources: []
      },
      { 
        title: `Intermediate ${topicName}`, 
        difficulty: 'Intermediate',
        description: 'Building deeper knowledge.',
        resources: []
      }
    ];
  }
  
  // --- 5. Save Learning Path to Database ---
  await LearningPath.findOneAndUpdate(
    { user: userId, topic: topic._id },
    { 
      user: userId,
      topic: topic._id,
      modules: aiGeneratedModules // Saving the AI data here!
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