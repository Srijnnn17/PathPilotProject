// This file centralizes constants used throughout the application.

// BASE_URL is the root URL for your backend API.
// It switches between your deployed Render URL in production and an empty string for development.
// Vite uses import.meta.env.PROD instead of process.env.NODE_ENV
// You can also set VITE_API_URL in Vercel environment variables to override this
export const BASE_URL =
  import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD
    ? "https://pathpilot-ghts.onrender.com"
    : ""); // In development, the Vite proxy handles the full URL.

// API Route constants
export const USERS_URL = "/api/users";
export const TOPICS_URL = "/api/topics";
// Add other API routes here as your app grows.