import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { questionPools } from '../data/questionsPool.js';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ FIXED: List of model names to try (newest to oldest fallback)
// Based on Google AI API: these are the currently supported model names
const MODEL_NAMES = [
  'gemini-1.5-flash',         // Stable flash (most commonly available)
  'gemini-1.5-pro',           // Stable pro
  'gemini-pro'                // Legacy fallback
];

// Cache for working model name (not the model object itself, as it's lightweight to recreate)
let cachedModelName = null;

// Helper function to get working model - tries models in order until one works
const getWorkingModel = () => {
  // If we have a cached working model name, use it
  if (cachedModelName) {
    const cachedIndex = MODEL_NAMES.indexOf(cachedModelName);
    return { 
      model: genAI.getGenerativeModel({ model: cachedModelName }), 
      modelName: cachedModelName,
      index: cachedIndex >= 0 ? cachedIndex : 0
    };
  }
  
  // Start with the first (most likely) model name
  const modelName = MODEL_NAMES[0];
  return { 
    model: genAI.getGenerativeModel({ model: modelName }), 
    modelName,
    index: 0
  };
};

// Helper to try next model if current one fails
const tryNextModel = (currentIndex, error) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a3ae1635-2ad5-4eed-a9fd-5c91cc510654',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'aiController.js:tryNextModel',message:'Model failed, trying next',data:{failedModel:MODEL_NAMES[currentIndex],error:error.message,nextIndex:currentIndex+1},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  if (currentIndex < MODEL_NAMES.length - 1) {
    const nextModelName = MODEL_NAMES[currentIndex + 1];
    console.warn(`[MODEL] ${MODEL_NAMES[currentIndex]} failed: ${error.message}. Trying ${nextModelName}...`);
    return { model: genAI.getGenerativeModel({ model: nextModelName }), modelName: nextModelName, index: currentIndex + 1 };
  }
  return null;
};

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
  console.log(`[QUIZ START] Generating 10-Question Quiz for: ${decodedTopicName}`);

  try {
    // Validate questionPools is loaded
    if (!questionPools || typeof questionPools !== 'object') {
      console.error('[QUIZ ERROR] questionPools is not loaded properly');
      res.status(200).json(getFallbackQuiz(decodedTopicName));
      return;
    }

    // Try to find topic with various name variations
    let topicKey = decodedTopicName;
    if (!questionPools[topicKey]) {
      // Try common variations
      if (decodedTopicName === 'Node.js' && questionPools['Node']) {
        topicKey = 'Node';
      } else if (decodedTopicName === 'HTML' && questionPools['Html']) {
        topicKey = 'Html';
      } else if (decodedTopicName === 'Html' && questionPools['HTML']) {
        topicKey = 'HTML';
      }
    }

    // Check if topic exists in questionPools
    if (questionPools[topicKey] && Array.isArray(questionPools[topicKey])) {
      // Topic exists - randomly shuffle and select 10 questions
      const shuffled = questionPools[topicKey].sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, 10);
      
      // Transform questions to match expected response format (answer -> correctAnswer, remove difficulty)
      const quizData = selectedQuestions.map(({ question, options, answer }) => ({
        question,
        options,
        correctAnswer: answer
      }));

      console.log(`[QUIZ SUCCESS] Selected ${quizData.length} questions for ${decodedTopicName} (using key: ${topicKey})`);
      res.status(200).json(quizData);
    } else {
      // Topic does not exist - use fallback
      console.log(`[QUIZ FALLBACK] Topic "${decodedTopicName}" not found in question pools. Available keys: ${Object.keys(questionPools).slice(0, 5).join(', ')}...`);
      res.status(200).json(getFallbackQuiz(decodedTopicName));
    }
  } catch (error) {
    console.error("ERROR DETAILS:", error.message, error.stack);
    // Return fallback on error
    res.status(200).json(getFallbackQuiz(decodedTopicName));
  }

  /*
  ========================================
  COMMENTED OUT: Gemini API Logic (preserved for reference)
  ========================================
  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a3ae1635-2ad5-4eed-a9fd-5c91cc510654',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'aiController.js:generateQuiz',message:'Starting quiz generation',data:{topicName:decodedTopicName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    // ✅ FIXED: Get working model dynamically (will try models in sequence if one fails)
    let modelInfo = getWorkingModel();
    let modelIndex = modelInfo.index || 0;
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a3ae1635-2ad5-4eed-a9fd-5c91cc510654',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'aiController.js:generateQuiz',message:'Starting with model',data:{modelName:modelInfo.modelName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    const prompt = `
You are an expert technical interviewer and educator. Generate EXACTLY 10 high-quality multiple-choice questions for the topic: "${decodedTopicName}".

CRITICAL REQUIREMENTS:
1. Generate EXACTLY 10 questions (no more, no less)
2. Each question must have exactly 4 options (A, B, C, D)
3. Only ONE correct answer per question
4. Questions must be diverse and cover different aspects of ${decodedTopicName}
5. Make questions practical and relevant to real-world usage

DIFFICULTY DISTRIBUTION:
- 3 Beginner questions: Basic definitions, fundamental concepts, syntax basics
- 4 Intermediate questions: Common use cases, typical patterns, debugging scenarios
- 3 Advanced questions: Edge cases, performance considerations, best practices

OUTPUT FORMAT (JSON ARRAY ONLY - NO MARKDOWN, NO EXPLANATIONS, JUST THE JSON):
[
  {
    "question": "Clear, concise question text?",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correctAnswer": "The exact text of the correct option"
  }
]

IMPORTANT: Return ONLY valid JSON array. Do not include markdown code blocks, explanations, or any other text.
`;

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a3ae1635-2ad5-4eed-a9fd-5c91cc510654',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'aiController.js:generateQuiz',message:'Calling API',data:{promptLength:prompt.length,modelName:modelInfo.modelName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    // ✅ FIXED: Actually call the API and handle model failures
    let result;
    try {
      result = await modelInfo.model.generateContent(prompt);
      // Cache the working model name for future requests
      if (!cachedModelName) {
        cachedModelName = modelInfo.modelName;
        console.log(`[MODEL] Cached working model: ${cachedModelName}`);
      }
    } catch (modelError) {
      // Try next model if current one fails
      const nextModel = tryNextModel(modelIndex, modelError);
      if (nextModel) {
        modelInfo = nextModel;
        modelIndex = nextModel.index;
        result = await modelInfo.model.generateContent(prompt);
        cachedModelName = modelInfo.modelName;
        console.log(`[MODEL] Switched to working model: ${modelInfo.modelName}`);
      } else {
        throw modelError; // No more models to try
      }
    }
    
    const text = result.response.text();
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a3ae1635-2ad5-4eed-a9fd-5c91cc510654',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'aiController.js:generateQuiz',message:'Got API response',data:{responseLength:text.length,firstChars:text.substring(0,100)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    console.log(`[AI RESPONSE] Raw response length: ${text.length} characters`);
    
    // Clean the response - remove markdown code blocks if present
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Try to find JSON array
    const startIdx = cleanText.indexOf('[');
    const endIdx = cleanText.lastIndexOf(']');
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a3ae1635-2ad5-4eed-a9fd-5c91cc510654',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'aiController.js:generateQuiz',message:'Parsing JSON',data:{startIdx,endIdx,hasArray:startIdx!==-1&&endIdx!==-1},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    if (startIdx === -1 || endIdx === -1) {
      throw new Error(`Could not find JSON array in response. Start: ${startIdx}, End: ${endIdx}. Response preview: ${text.substring(0, 200)}`);
    }
    
    const jsonString = cleanText.substring(startIdx, endIdx + 1);
    console.log(`[AI RESPONSE] Extracted JSON string length: ${jsonString.length}`);
    
    const quizData = JSON.parse(jsonString);

    // Validate it's an array
    if (!Array.isArray(quizData)) {
      throw new Error(`Expected array but got: ${typeof quizData}`);
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a3ae1635-2ad5-4eed-a9fd-5c91cc510654',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'aiController.js:generateQuiz',message:'Quiz parsed successfully',data:{questionCount:quizData.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    // Double check we actually got 10
    if (quizData.length < 10) {
      console.warn(`[AI WARN] Only generated ${quizData.length} questions, expected 10.`);
    }

    console.log(`[AI SUCCESS] Generated ${quizData.length} questions for ${decodedTopicName}`);
    res.status(200).json(quizData);

  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a3ae1635-2ad5-4eed-a9fd-5c91cc510654',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'aiController.js:generateQuiz',message:'Error occurred',data:{errorMessage:error.message,errorType:error.constructor.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    
    console.error("ACTUAL ERROR DETAILS:", error.message, error.stack);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    // Only return fallback if it's a real error, not if it's a validation issue
    res.status(200).json(getFallbackQuiz(decodedTopicName));
  }
  ========================================
  */
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
    // ✅ FIXED: Get working model dynamically (will try models in sequence if one fails)
    let modelInfo = getWorkingModel();
    let modelIndex = 0;

    const prompt = `
You are an expert educational content creator. Create a custom learning path for "${decodedTopicName}".

USER CONTEXT:
${pathStrategy}

REQUIREMENTS:
1. Create exactly 4 modules tailored to the difficulty level: ${difficultyLevel}
2. Each module must have:
   - A clear, descriptive title
   - A detailed description (2-3 sentences)
   - At least 2-3 high-quality resource links
3. RESOURCE LINK REQUIREMENTS:
   - Use DIRECT documentation links (deep links, not homepages)
   - Prioritize: MDN Web Docs, W3Schools, official documentation
   - For MDN: Use format: https://developer.mozilla.org/en-US/docs/[topic-specific-path]
   - For W3Schools: Use format: https://www.w3schools.com/[topic]/[specific-page]
   - Include official docs when available (e.g., react.dev, nodejs.org)
   - All links must be valid and topic-relevant

OUTPUT FORMAT (JSON ONLY - NO MARKDOWN):
{
  "modules": [
    {
      "title": "Module Title (be specific)",
      "difficulty": "${difficultyLevel}",
      "description": "Detailed 2-3 sentence description of what this module covers and why it's important.",
      "resources": [
        { "name": "Descriptive link name (e.g., 'MDN: JavaScript Arrays')", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array" },
        { "name": "W3Schools: Array Methods", "url": "https://www.w3schools.com/js/js_array_methods.asp" }
      ]
    }
  ]
}

IMPORTANT: Return ONLY valid JSON. No markdown code blocks, no explanations.
`;

    let result;
    try {
      result = await modelInfo.model.generateContent(prompt);
      // Cache the working model name for future requests
      if (!cachedModelName) {
        cachedModelName = modelInfo.modelName;
        console.log(`[MODEL] Cached working model: ${cachedModelName}`);
      }
    } catch (modelError) {
      // Try next model if current one fails
      const nextModel = tryNextModel(modelIndex, modelError);
      if (nextModel) {
        modelInfo = nextModel;
        modelIndex = nextModel.index;
        result = await modelInfo.model.generateContent(prompt);
        cachedModelName = modelInfo.modelName;
        console.log(`[MODEL] Switched to working model: ${modelInfo.modelName}`);
      } else {
        throw modelError; // No more models to try
      }
    }
    
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