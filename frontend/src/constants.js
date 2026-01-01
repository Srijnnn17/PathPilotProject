// This file centralizes constants used throughout the application.

// BASE_URL is the root URL for your backend API.
// It switches between your deployed Render URL in production and an empty string for development.
// Vite uses import.meta.env.PROD instead of process.env.NODE_ENV
// You can also set VITE_API_URL in Vercel environment variables to override this

// Check if we're in production (Vercel sets NODE_ENV=production during build)
const isProduction = 
  import.meta.env.PROD || 
  import.meta.env.MODE === 'production' ||
  import.meta.env.VITE_API_URL; // If VITE_API_URL is set, we're likely in production

// Backend API URL - defaults to Render deployment
const BACKEND_URL = "https://pathpilot-ghts.onrender.com";

export const BASE_URL =
  import.meta.env.VITE_API_URL || 
  (isProduction ? BACKEND_URL : ""); // In development, the Vite proxy handles the full URL.

// Debug log to help troubleshoot
console.log('Environment:', {
  PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  BASE_URL: BASE_URL,
  isProduction: isProduction
});

// API Route constants
export const USERS_URL = "/api/users";
export const TOPICS_URL = "/api/topics";
// Add other API routes here as your app grows.