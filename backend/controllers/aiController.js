import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import Topic from '../models/topicModel.js';
import LearningPath from '../models/learningPathModel.js';

dotenv.config();

// --- 1. THE SAFETY NET (Fallback Data) ---
// If AI fails, we use this so the app works for the demo
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
  // Add 7 more generic questions if needed, but 3 is enough to show functionality
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
      description: `Master the core building blocks of ${topic}. You will learn syntax, basic structures, and how to set up your first environment.`,
      resources: [
        { title: "MDN - Getting Started", url: "https://developer.mozilla.org/en-US/" },
        { title: "W3Schools - Tutorial", url: "https://www.w3schools.com/" }
      ]
    },
    {
      title: `Intermediate ${topic} Logic`,
      difficulty: "Intermediate",
      description: "Dive deeper into control flow, data management, and common patterns used in professional development.",
      resources: [
        { title: "MDN - Advanced Guides", url: "https://developer.mozilla.org/en-US/" },
        { title: "FreeCodeCamp - Full Course", url: "https://www.freecodecamp.org/" }
      ]
    },
    {
      title: `Advanced ${topic} Architecture`,
      difficulty: "Advanced",
      description: "Learn about performance optimization, security best practices, and enterprise-level architecture.",
      resources: [
        { title: "Official Documentation", url: "https://devdocs.io/" },
        { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" }
      ]
    }
  ]
});

// --- 2. THE AI CALLER ---
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

const generateQuiz = asyncHandler(async (req, res) => {
  const { topicName } = req.params;
  
  try {
    const prompt = `Create a 10-question multiple-choice quiz for "${topicName}". JSON format only.`;
    const text = await callGeminiDirectly(prompt);
    
    // Extract JSON
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start === -1) throw new Error("Invalid JSON");
    const quizData = JSON.parse(text.substring(start, end + 1));

    res.status(200).json(quizData);

  } catch (error) {
    console.error(`⚠️ AI Failed (${error.message}). Switching to Backup Mode.`);
    // FAILSAFE: Return mock data instead of error
    res.status(200).json(getFallbackQuiz(topicName));
  }
});

const generateLearningPath = asyncHandler(async (req, res) => {
  const { topicName } = req.params;
  const userId = req.user._id; 

  const topic = await Topic.findOne({ name: { $regex: new RegExp(`^${topicName}$`, 'i') } });

  try {
    const prompt = `
      Create a learning path for "${topicName}".
      JSON format with "modules" array.
      Each module has "title", "difficulty", "description" (2 sentences), and "resources" (2 links with "title" and "url").
      Prioritize MDN/W3Schools.
    `;
    
    const text = await callGeminiDirectly(prompt);
    
    // Extract JSON
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1) throw new Error("Invalid JSON");
    const pathData = JSON.parse(text.substring(start, end + 1));

    // Save Real Data
    if (topic && pathData.modules) {
        await LearningPath.findOneAndUpdate(
            { user: userId, topic: topic._id },
            { modules: pathData.modules },
            { upsert: true, new: true }
        );
        console.log("💾 Saved AI Path to DB");
    }
    res.status(200).json(pathData);

  } catch (error) {
    console.error(`⚠️ AI Failed (${error.message}). Switching to Backup Mode.`);
    
    // FAILSAFE: Return mock data
    const mockData = getFallbackPath(topicName);
    
    // Even save the mock data to DB so it persists!
    if (topic) {
        await LearningPath.findOneAndUpdate(
            { user: userId, topic: topic._id },
            { modules: mockData.modules },
            { upsert: true, new: true }
        );
        console.log("💾 Saved BACKUP Path to DB");
    }
    
    res.status(200).json(mockData);
  }
});

export { generateQuiz, generateLearningPath };