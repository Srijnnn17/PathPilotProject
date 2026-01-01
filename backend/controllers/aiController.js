import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import Topic from '../models/topicModel.js';
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
   FALLBACK DATA
======================= */

const getFallbackQuiz = (topic) => [
  {
    question: `What is a primary feature of ${topic}?`,
    options: ["Scalability", "Low Latency", "Strict Typing", "Component Based"],
    correctAnswer: "Component Based"
  },
  {
    question: "Which of the following is NOT a valid data type?",
    options: ["String", "Boolean", "Float-Array", "Number"],
    correctAnswer: "Float-Array"
  },
  {
    question: `In ${topic}, what is the correct syntax for a comment?`,
    options: ["// Comment", "", "# Comment", "/* Comment */"],
    correctAnswer: "// Comment"
  },
  { question: "What represents 'Truth' in binary?", options: ["0", "1", "null", "undefined"], correctAnswer: "1" },
  { question: "Which complexity is best?", options: ["O(n)", "O(log n)", "O(n^2)", "O(n!)"], correctAnswer: "O(log n)" },
  { question: "What is the purpose of an API?", options: ["Database", "Interface", "Styling", "Testing"], correctAnswer: "Interface" },
  { question: "Which is a frontend framework?", options: ["Express", "Django", "React", "Spring"], correctAnswer: "React" },
  { question: "What does JSON stand for?", options: ["Java Source", "JavaScript Object Notation", "Jupyter Note", "Jumbo Style"], correctAnswer: "JavaScript Object Notation" },
  { question: "Which keyword defines a constant?", options: ["var", "let", "const", "fixed"], correctAnswer: "const" },
  { question: "What is an infinite loop?", options: ["A loop that never ends", "A loop that runs once", "A fast loop", "A broken loop"], correctAnswer: "A loop that never ends" }
];

const getFallbackPath = (topic) => ({
  modules: [
    {
      title: `${topic} Fundamentals`,
      difficulty: "Beginner",
      description: `Master the core building blocks of ${topic}.`,
      resources: [
        { title: "MDN", url: "https://developer.mozilla.org/en-US/" },
        { title: "W3Schools", url: "https://www.w3schools.com/" }
      ]
    },
    {
      title: `Intermediate ${topic}`,
      difficulty: "Intermediate",
      description: "Dive deeper into practical usage and patterns.",
      resources: [
        { title: "FreeCodeCamp", url: "https://www.freecodecamp.org/" },
        { title: "MDN Advanced", url: "https://developer.mozilla.org/en-US/" }
      ]
    },
    {
      title: `Advanced ${topic}`,
      difficulty: "Advanced",
      description: "Performance, architecture, and best practices.",
      resources: [
        { title: "DevDocs", url: "https://devdocs.io/" },
        { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" }
      ]
    }
  ]
});

/* =======================
   CONTROLLERS
======================= */

const generateQuiz = asyncHandler(async (req, res) => {
  const { topicName } = req.params;

  try {
    const prompt = `Create a 10-question multiple-choice quiz for "${topicName}". Return JSON array only.`;
    const text = await generateWithGemini(prompt);

    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start === -1 || end === -1) throw new Error('Invalid JSON');

    const quizData = JSON.parse(text.slice(start, end + 1));
    res.status(200).json(quizData);

  } catch (err) {
    console.error('⚠️ Gemini failed, using fallback quiz');
    res.status(200).json(getFallbackQuiz(topicName));
  }
});

const generateLearningPath = asyncHandler(async (req, res) => {
  const { topicName } = req.params;
  const userId = req.user._id;

  const topic = await Topic.findOne({
    name: { $regex: new RegExp(`^${topicName}$`, 'i') }
  });

  try {
    const prompt = `
      Create a learning path for "${topicName}".
      Return JSON with key "modules".
      Each module: title, difficulty, description, resources[{title,url}].
    `;

    const text = await generateWithGemini(prompt);

    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('Invalid JSON');

    const pathData = JSON.parse(text.slice(start, end + 1));

    if (topic && pathData.modules) {
      await LearningPath.findOneAndUpdate(
        { user: userId, topic: topic._id },
        { modules: pathData.modules },
        { upsert: true, new: true }
      );
    }

    res.status(200).json(pathData);

  } catch (err) {
    console.error("❌ Gemini Error:", err.message || err);

    const fallback = getFallbackPath(topicName);

    if (topic) {
      await LearningPath.findOneAndUpdate(
        { user: userId, topic: topic._id },
        { modules: fallback.modules },
        { upsert: true, new: true }
      );
    }

    res.status(200).json(fallback);
  }
});

export { generateQuiz, generateLearningPath };
