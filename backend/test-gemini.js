import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

// A quick check to make sure the key is being read from .env
if (!apiKey) {
  console.error('Error: GEMINI_API_KEY not found in .env file.');
  process.exit(1);
}

console.log('API Key loaded successfully. Attempting to connect to Google AI...');

const genAI = new GoogleGenerativeAI(apiKey);

async function runTest() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = 'Tell me a short, one-sentence joke.';

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('\n✅ SUCCESS! The API key is working.');
    console.log('Response from Gemini:', text);
  } catch (error) {
    console.error('\n❌ FAILURE! The API key or project is not configured correctly.');
    console.error('Detailed Error:', error);
  }
}

runTest();