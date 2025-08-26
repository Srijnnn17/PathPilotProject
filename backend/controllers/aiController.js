import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config(); // Ensure .env variables are loaded in this file

// Initialize the Google Generative AI client directly with the key
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

  // The detailed prompt to ensure consistent JSON output
  const prompt = `
    Create a quiz with exactly 10 multiple-choice questions for the topic: "${topicName}".
    The difficulty should be suitable for classifying a user's skill level as beginner, intermediate, or advanced.
    For each question, provide:
    1. A "question" text.
    2. An array of 4 "options".
    3. The exact "correctAnswer" from the options array.

    Return the output as a single valid JSON object. Do not include any text or markdown formatting before or after the JSON object. The JSON object should be an array of 10 question objects.
    Example format for a single question object:
    {
      "question": "What is a closure in JavaScript?",
      "options": ["A function having access to the parent scope", "A specific type of loop", "A data type", "An HTML element"],
      "correctAnswer": "A function having access to the parent scope"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    const jsonText = text.replace(/```json/g, '').replace(/```/g, '');

    const quizData = JSON.parse(jsonText);

    res.status(200).json(quizData);
  } catch (error) {
    console.error('Error in generateQuiz controller:', error);
    res.status(500);
    throw new Error('Failed to generate quiz from AI service');
  }
});

export { generateQuiz };