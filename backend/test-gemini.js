import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

console.log("--- Testing Gemini Connection ---");
console.log("API Key Status:", process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ MISSING");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function run() {
  // Try gemini-1.5-flash (free tier) first
  const modelName = 'gemini-1.5-flash';
  console.log(`\n--- Testing with ${modelName} ---`);
  const model = genAI.getGenerativeModel({ model: modelName });
  
  try {
    console.log("Sending test request...");
    const result = await model.generateContent("Hello! Are you working?");
    const response = await result.response;
    const text = await response.text();
    console.log("✅ SUCCESS! AI Responded:");
    console.log(text);
    console.log(`\n✅ Model "${modelName}" is working correctly!`);
  } catch (error) {
    console.error("❌ FAILED:");
    console.error(error);
    if (error.message && error.message.includes('quota')) {
      console.log("\n💡 Quota exceeded. Your free tier quota has been reached.");
      console.log("   Please wait a few minutes or upgrade to a paid plan.");
    } else if (error.message && error.message.includes('404')) {
      console.log("\n💡 Model not found. Available models: gemini-2.0-flash, gemini-2.5-flash, gemini-2.5-pro");
    }
  }
}

run();