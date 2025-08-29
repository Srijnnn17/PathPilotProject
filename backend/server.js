// import express from 'express';
// import dotenv from 'dotenv';
// dotenv.config();
// import cookieParser from 'cookie-parser';
// import connectDB from './config/db.js';
// import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// import userRoutes from './routes/userRoutes.js';
// import topicRoutes from './routes/topicRoutes.js'; // 👈 Import new topic routes
// import quizRoutes from './routes/quizRoutes.js';
// import learningPathRoutes from './routes/learningPathRoutes.js'; // 👈 Import
// import aiRoutes from './routes/aiRoutes.js';

// const port = process.env.PORT || 5000;

// connectDB();

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Mount the routes
// app.use('/api/users', userRoutes);
// app.use('/api/topics', topicRoutes); // 👈 Use the new topic routes
// app.use('/api/quizzes', quizRoutes); // 👈 Mount quiz routes here
// app.use('/api/learning-paths', learningPathRoutes); // 👈 Add this line
// app.use('/api/ai', aiRoutes);

// app.get('/', (req, res) => res.send('API is running...'));

// app.use(notFound);
// app.use(errorHandler);

// app.listen(port, () => console.log(`Server started on port ${port}`));


import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Make sure cors is imported
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
// Import your routes
import userRoutes from './routes/userRoutes.js';

dotenv.config();

connectDB();

const app = express();

// --- START CORS CONFIGURATION ---
const corsOptions = {
  // This must be the exact URL of your Vercel frontend
  origin: 'https://path-pilot-rose.vercel.app/',
  // This is required to allow cookies to be sent from the frontend
  credentials: true, 
};

app.use(cors(corsOptions));
// --- END CORS CONFIGURATION ---

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware (essential for reading req.cookies.jwt)
app.use(cookieParser());


// --- YOUR API ROUTES ---
app.use('/api/users', userRoutes);
// Add other routes here


// --- ERROR HANDLING MIDDLEWARE ---
app.use(notFound);
app.use(errorHandler);


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
