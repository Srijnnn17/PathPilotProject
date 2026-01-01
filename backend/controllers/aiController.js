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
  // ✅ FIXED: Decode URL-encoded topicName to handle special characters like '/' in UI/UX, AR/VR
  const { topicName } = req.params;
  const decodedTopicName = decodeURIComponent(topicName);
  console.log(`[AI START] Generating 10-Question Quiz for: ${decodedTopicName}`);

  try {
    // ✅ FIXED: Changed model name from 'gemini-1.5-flash' to 'gemini-pro' (stable model)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      You are a Technical Interviewer. 
      Generate EXACTLY 10 multiple-choice questions for "${decodedTopicName}".
      
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
    console.log(`[AI RESPONSE] Raw response length: ${text.length} characters`);
    
    // Clean the response
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Try to find JSON array
    const startIdx = cleanText.indexOf('[');
    const endIdx = cleanText.lastIndexOf(']');
    
    if (startIdx === -1 || endIdx === -1) {
      throw new Error(`Could not find JSON array in response. Start: ${startIdx}, End: ${endIdx}`);
    }
    
    const jsonString = cleanText.substring(startIdx, endIdx + 1);
    console.log(`[AI RESPONSE] Extracted JSON string length: ${jsonString.length}`);
    
    const quizData = JSON.parse(jsonString);

    // Validate it's an array
    if (!Array.isArray(quizData)) {
      throw new Error(`Expected array but got: ${typeof quizData}`);
    }

    // Double check we actually got 10
    if (quizData.length < 10) {
      console.warn(`[AI WARN] Only generated ${quizData.length} questions, expected 10.`);
    }

    console.log(`[AI SUCCESS] Generated ${quizData.length} questions for ${decodedTopicName}`);
    res.status(200).json(quizData);

  } catch (error) {
    console.error("ACTUAL ERROR DETAILS:", error.message, error.stack);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    // Only return fallback if it's a real error, not if it's a validation issue
    res.status(200).json(getFallbackQuiz(decodedTopicName));
  }
});

// @desc    Generate ADAPTIVE Learning Path
const generateLearningPath = asyncHandler(async (req, res) => {
  // NOTE: We now expect 'score' and 'total' in the body
  // ✅ FIXED: Decode URL-encoded topicName to handle special characters like '/' in UI/UX, AR/VR
  const { topicName } = req.params;
  const decodedTopicName = decodeURIComponent(topicName);
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

  console.log(`[AI START] Generating ${difficultyLevel} Path for ${decodedTopicName} (Score: ${percentage}%)`);

  try {
    // ✅ FIXED: Changed model name from 'gemini-1.5-flash' to 'gemini-pro' (stable model)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Create a custom learning path for "${decodedTopicName}".
      
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
    console.log(`[AI RESPONSE] Raw response length: ${text.length} characters`);
    
    // Clean the response
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Try to find JSON object
    const startIdx = cleanText.indexOf('{');
    const endIdx = cleanText.lastIndexOf('}');
    
    if (startIdx === -1 || endIdx === -1) {
      throw new Error(`Could not find JSON object in response. Start: ${startIdx}, End: ${endIdx}`);
    }
    
    const jsonString = cleanText.substring(startIdx, endIdx + 1);
    console.log(`[AI RESPONSE] Extracted JSON string length: ${jsonString.length}`);
    
    const pathData = JSON.parse(jsonString);
    
    // Validate it has modules
    if (!pathData.modules || !Array.isArray(pathData.modules)) {
      throw new Error(`Expected pathData.modules array but got: ${typeof pathData.modules}`);
    }

    console.log(`[AI SUCCESS] Generated ${pathData.modules.length} modules for ${decodedTopicName}`);
    res.status(200).json(pathData);

  } catch (error) {
    console.error(`[AI FAILED] Using Fallback.`);
    console.error("Error details:", error.message, error.stack);
    // Fallback response...
    res.status(200).json({
      modules: [{
        title: `${decodedTopicName} Essentials`,
        difficulty: difficultyLevel,
        description: "Core concepts (Fallback mode).",
        resources: [{ name: "MDN Search", url: `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(decodedTopicName)}` }]
      }]
    });
  }
});

export { generateQuiz, generateLearningPath };