

// import express from 'express';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import cors from 'cors'; // Make sure cors is imported
// import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// import connectDB from './config/db.js';
// // Import your routes
// import userRoutes from './routes/userRoutes.js';

// dotenv.config();

// connectDB();

// const app = express();

// // --- START CORS CONFIGURATION ---
// const corsOptions = {
//   // This must be the exact URL of your Vercel frontend
//   origin: 'https://path-pilot-rose.vercel.app/',
//   // This is required to allow cookies to be sent from the frontend
//   credentials: true, 
// };

// app.use(cors(corsOptions));
// // --- END CORS CONFIGURATION ---

// // Body parser middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Cookie parser middleware (essential for reading req.cookies.jwt)
// app.use(cookieParser());


// // --- YOUR API ROUTES ---
// app.use('/api/users', userRoutes);
// // Add other routes here


// // --- ERROR HANDLING MIDDLEWARE ---
// app.use(notFound);
// app.use(errorHandler);


// const port = process.env.PORT || 5000;
// app.listen(port, () => console.log(`Server started on port ${port}`));



import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';

// Import all of your route files
import userRoutes from './routes/userRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import learningPathRoutes from './routes/learningPathRoutes.js';


dotenv.config();

// Validate critical environment variables
if (!process.env.GEMINI_API_KEY) {
  console.error('⚠️  WARNING: GEMINI_API_KEY is not set in environment variables');
  console.error('   Quiz generation and AI features will not work without this key.');
  console.error('   Please set GEMINI_API_KEY in your .env file.');
} else {
  console.log('✅ GEMINI_API_KEY is configured');
}

connectDB();
const app = express();

// --- CORS CONFIGURATION ---
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://path-pilot-rose.vercel.app' 
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
};
app.use(cors(corsOptions));


// --- MIDDLEWARE (No changes needed here) ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// --- REGISTER ALL YOUR API ROUTES ---
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/learning-paths', learningPathRoutes);


// --- ROOT ROUTE (No changes needed here) ---
app.get('/', (req, res) => {
  res.send('API is running...');
});


// --- ERROR HANDLING (No changes needed here) ---
app.use(notFound);
app.use(errorHandler);


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
