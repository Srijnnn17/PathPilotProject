import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import Topic from '../models/topicModel.js';

dotenv.config();

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

// 👇 THIS IS THE MISSING FUNCTION
// @desc    Generate a learning path for a topic
// @route   GET /api/ai/generate-path/:topicName
// @access  Private
const generateLearningPath = asyncHandler(async (req, res) => {
  const { topicName } = req.params;

  if (!topicName) {
    res.status(400);
    throw new Error('Topic name is required');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // const prompt = `
  //   **Objective**: Create a structured, personalized learning path for the topic specified below.
  //   **Topic**: ${topicName}
  //   **Instructions**:
  //   1.  Generate a list of 3 to 5 learning modules.
  //   2.  For each module, provide a "title" and a "difficulty" level ('Beginner', 'Intermediate', or 'Advanced').
  //   3.  The modules should be in a logical learning order, starting from the basics.
  //   4.  Your entire response must be a single, valid JSON object with a single key "modules" which contains an array of the module objects. Do not include any text or markdown formatting before or after the JSON object.
  //   **JSON Object Format**:
  //   {
  //     "modules": [
  //       { "title": "Introduction to ${topicName}", "difficulty": "Beginner" },
  //       { "title": "Core Concepts of ${topicName}", "difficulty": "Intermediate" },
  //       { "title": "Advanced ${topicName} Techniques", "difficulty": "Advanced" }
  //     ]
  //   }
  // `;

  const prompt = `
**Objective**: Create a structured, personalized learning path for the topic specified below.  
**Topic**: ${topicName}  

**Instructions**:  
1. Generate a list of 3 to 5 learning modules.  
2. For each module, provide:  
   - "title"  
   - "difficulty" level ('Beginner', 'Intermediate', or 'Advanced')  
   - "description" (2–3 sentences about what the learner will cover in this module)  
   - "resources" → an array of at least 2 recommended learning resources.  
     - Each resource must have "name" and "url".  
     - Use only **real, well-known sources** (such as MDN Web Docs, freeCodeCamp, W3Schools, official documentation, Coursera, Udemy, YouTube channels like Fireship, NetNinja, Traversy Media, etc.).  
     - Do **not** invent or hallucinate URLs.  
     - If a trusted source does not exist for a concept, skip adding a fake one.  
3. The modules should be in a logical order, starting from the basics and moving to advanced.  
4. Your entire response must be a single, valid JSON object with a single key "modules".  
5. Do not include any extra text, explanations, or markdown outside the JSON object.  

**JSON Object Format**:  
{
  "modules": [
    {
      "title": "Introduction to ${topicName}",
      "difficulty": "Beginner",
      "description": "A short explanation of what this module covers...",
      "resources": [
        { "name": "Resource Name", "url": "https://example.com" },
        { "name": "Another Resource", "url": "https://example.com" }
      ]
    }
  ]
}
`;





  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const pathData = JSON.parse(jsonText);

    res.status(200).json(pathData);
  } catch (error) {
    console.error(`Error generating learning path for topic "${topicName}":`, error);
    res.status(500);
    throw new Error('Failed to generate learning path from AI service.');
  }
});

export { generateQuiz, generateLearningPath };