import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- FALLBACK QUIZ (Standardized to 10 questions) ---
const getFallbackQuiz = (topicName) => {
  return Array.from({ length: 10 }).map((_, i) => ({
    question: `Fallback Question ${i + 1} about ${topicName}: What is a core concept?`,
    options: ["Abstraction", "Magic", "Chaos", "Entropy"],
    correctAnswer: "Abstraction"
  }));
};

// @desc    Generate 10 Questions (Fixed Count)
const generateQuiz = asyncHandler(async (req, res) => {
  const { topicName } = req.params;
  console.log(`[AI START] Generating 10-Question Quiz for: ${topicName}`);

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are a Technical Interviewer. 
      Generate EXACTLY 10 multiple-choice questions for "${topicName}".
      
      DIFFICULTY MIX:
      - 3 Beginner Questions (Basic definitions/syntax)
      - 4 Intermediate Questions (Common use cases/debugging)
      - 3 Advanced Questions (Edge cases/performance)

      OUTPUT FORMAT (JSON ARRAY ONLY):
      [
        {
          "question": "Question text here...",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "Correct Option Text"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonString = cleanText.substring(cleanText.indexOf('['), cleanText.lastIndexOf(']') + 1);
    
    const quizData = JSON.parse(jsonString);

    // Double check we actually got 10
    if (quizData.length < 10) console.warn(`[AI WARN] Only generated ${quizData.length} questions.`);

    res.status(200).json(quizData);

  } catch (error) {
    console.error(`[AI FAILED] Switching to Simulation Mode.`);
    res.status(200).json(getFallbackQuiz(topicName));
  }
});

// @desc    Generate ADAPTIVE Learning Path
const generateLearningPath = asyncHandler(async (req, res) => {
  // NOTE: We now expect 'score' and 'total' in the body
  const { topicName } = req.params;
  const { score = 0, total = 10 } = req.body; 

  // 1. Calculate Performance
  const percentage = Math.round((score / total) * 100);
  let difficultyLevel = 'Beginner';
  let pathStrategy = '';

  // 2. Define Strategy based on Score
  if (percentage < 30) {
    difficultyLevel = 'Beginner / Remedial';
    pathStrategy = `
      The user scored ${percentage}% (Low). 
      They are struggling with the basics.
      - Focus heavily on FUNDAMENTALS, Syntax, and "Hello World" concepts.
      - Use simple language.
      - Do NOT introduce complex frameworks yet.
    `;
  } else if (percentage < 70) {
    difficultyLevel = 'Intermediate';
    pathStrategy = `
      The user scored ${percentage}% (Average).
      They know the basics but need practice.
      - Focus on real-world patterns, common hooks/methods, and error handling.
      - Bridge the gap between theory and building apps.
    `;
  } else {
    difficultyLevel = 'Advanced / Expert';
    pathStrategy = `
      The user scored ${percentage}% (High).
      They are already proficient.
      - Skip the basics completely.
      - Focus on Performance Optimization, Architecture, Security, and Under-the-hood internals.
      - Challenge them with complex scenarios.
    `;
  }

  console.log(`[AI START] Generating ${difficultyLevel} Path for ${topicName} (Score: ${percentage}%)`);

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Create a custom learning path for "${topicName}".
      
      USER CONTEXT:
      ${pathStrategy}

      REQUIREMENTS:
      1. Create exactly 4 modules tailored to the difficulty level above.
      2. DIRECT DOCUMENTATION LINKS ONLY (No generic homepages).
         - Use deep links to MDN, W3Schools, or Official Docs.
      
      OUTPUT FORMAT (JSON):
      {
        "modules": [
          {
            "title": "Module Title",
            "difficulty": "${difficultyLevel}",
            "description": "Specific summary...",
            "resources": [
              { "name": "Direct Doc Link", "url": "https://..." }
            ]
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonString = cleanText.substring(cleanText.indexOf('{'), cleanText.lastIndexOf('}') + 1);

    res.status(200).json(JSON.parse(jsonString));

  } catch (error) {
    console.error(`[AI FAILED] Using Fallback.`);
    // Fallback response...
    res.status(200).json({
      modules: [{
        title: `${topicName} Essentials`,
        difficulty: difficultyLevel,
        description: "Core concepts (Fallback mode).",
        resources: [{ name: "MDN Search", url: `https://developer.mozilla.org/en-US/search?q=${topicName}` }]
      }]
    });
  }
});

export { generateQuiz, generateLearningPath };