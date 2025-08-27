import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import Topic from '../models/topicModel.js';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Generate a quiz for a specific topic (by ID or name)
const generateQuiz = asyncHandler(async (req, res) => {
  let { topicId } = req.params;
  let topicName;

  // If topicId looks like an ObjectId, look up the topic
  if (/^[a-f\d]{24}$/i.test(topicId)) {
    const topicDoc = await Topic.findById(topicId);
    if (!topicDoc) {
      res.status(404);
      throw new Error('Topic not found');
    }
    topicName = topicDoc.name;
  } else {
    topicName = topicId;
  }

  if (!topicName) {
    res.status(400);
    throw new Error('Topic name is required');
  }

  console.log('Generating quiz for topic:', topicName);

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    **Objective**: Create a multiple-choice quiz about the programming topic specified below.

    **Topic**: ${topicName}

    **Instructions**:
    1. Generate exactly 10 multiple-choice questions strictly related to the topic of "${topicName}".
    2. The questions should vary in difficulty to assess different skill levels (beginner to advanced).
    3. Each question must have exactly 4 options.
    4. One of the options must be the single correct answer.
    5. Your entire response must be a single, valid JSON array of 10 objects. Do not include any text, explanation, or markdown formatting (like \`\`\`json) before or after the JSON array.

    **JSON Object Format for Each Question**:
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correctAnswer": "..."
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const quizData = JSON.parse(jsonText);

    // Final check to ensure we got 10 questions
    if (!Array.isArray(quizData) || quizData.length !== 10) {
      throw new Error('AI did not return the expected number of questions.');
    }

    res.status(200).json(quizData);
  } catch (error) {
    console.error(`Error generating quiz for topic "${topicName}":`, error);
    res.status(500);
    throw new Error('Failed to generate quiz from AI service. Please try again.');
  }
});

export { generateQuiz };