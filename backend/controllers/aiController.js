import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import Topic from '../models/topicModel.js';
import LearningPath from '../models/learningPathModel.js'; // 👈 IMPORTANT IMPORT

dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Generate a quiz for a specific topic
// @route   GET /api/ai/generate-quiz/:topicName
// @access  Private
const generateQuiz = asyncHandler(async (req, res) => {
  const { topicName } = req.params;

  if (!topicName) {
    res.status(400);
    throw new Error('Topic name is required');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    **Objective**: Create a multiple-choice quiz about: ${topicName}
    **Instructions**:
    1. Generate exactly 10 questions.
    2. Each question must have 4 options and 1 correct answer.
    3. Return ONLY a valid JSON array. No markdown.
    **JSON Format**:
    [
      {
        "question": "Question text...",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "A"
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean string to ensure valid JSON
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const quizData = JSON.parse(jsonText);

    res.status(200).json(quizData);
  } catch (error) {
    console.error(`Quiz Generation Error for ${topicName}:`, error);
    // Fallback quiz so the interview demo doesn't crash
    res.status(200).json([
        {
            question: `(Demo Mode) Could not generate new quiz for ${topicName}.`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: "Option A"
        }
    ]);
  }
});

// @desc    Generate a learning path (With Database Caching)
// @route   GET /api/ai/generate-path/:topicName
// @access  Private
const generateLearningPath = asyncHandler(async (req, res) => {
  const { topicName } = req.params;
  const userId = req.user._id; 

  // --- STEP 1: SMART CACHE CHECK (Saves Quota!) ---
  // Find the topic ID first
  const topic = await Topic.findOne({ name: { $regex: new RegExp(`^${topicName}$`, 'i') } });
  
  if (topic) {
      // Check if this user already has a path for this topic
      const existingPath = await LearningPath.findOne({ user: userId, topic: topic._id });
      
      if (existingPath) {
          console.log("✅ CACHE HIT: Loading Learning Path from Database (0 Quota Used)");
          return res.status(200).json(existingPath); 
      }
  }

  // --- STEP 2: CALL GOOGLE AI (Only if not in DB) ---
  console.log("⚠️ CACHE MISS: Calling Gemini API...");
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      **Objective**: Create a learning path for: ${topicName}
      **Format**: JSON object with a "modules" key.
      **Structure**: 
      {
        "modules": [
          {
            "title": "Module Name",
            "difficulty": "Beginner",
            "description": "Short description",
            "resources": [ { "name": "Source Name", "url": "https://valid-url.com" } ]
          }
        ]
      }
      **Constraint**: Return ONLY valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const pathData = JSON.parse(jsonText);

    // --- STEP 3: SAVE TO DATABASE ---
    if (topic && pathData.modules) {
        await LearningPath.create({
            user: userId,
            topic: topic._id,
            modules: pathData.modules
        });
        console.log("💾 Saved new path to Database");
    }

    res.status(200).json(pathData);

  } catch (error) {
    console.error("Path Generation Error:", error);
    res.status(503).json({ message: "AI Service busy. Please try again." });
  }
});

export { generateQuiz, generateLearningPath };