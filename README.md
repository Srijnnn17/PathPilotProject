🚀 PathPilot - Your AI-Powered Learning Navigator
A full-stack, AI-enhanced web platform that revolutionizes online learning. PathPilot scraps the one-size-fits-all model and instead uses Google's Gemini API to generate dynamic skill assessments and craft a truly personalized learning roadmap for every user.

✨ Core Features : 
🤖 Dynamic AI Quiz Generation: Gone are the days of static questions. PathPilot uses the Google Gemini API to generate a unique, fresh set of 10 quiz questions in real-time, every time a user starts a skill assessment.

🔐 Secure User Authentication: A complete, secure authentication system built from the ground up with JWT (JSON Web Tokens) stored in secure httpOnly cookies.

📊 Personalized Progress Dashboard: A clean, intuitive dashboard where users can track their quiz history, view scores, and monitor their learning journey.

🎨 Responsive & Modern UI: A beautiful, dark-themed user interface built with Tailwind CSS, designed to be fully responsive and visually stunning on any device.

🏗️ Scalable MERN Stack Architecture: A well-organized, production-quality codebase featuring a Node.js/Express backend and a React frontend with Redux Toolkit for state management.


🛠️ Tech Stack & Architecture :

Frontend
Framework: React.js
State Management: Redux Toolkit (RTK Query)
Styling: Tailwind CSS
Routing: React Router

Backend
Runtime: Node.js
Framework: Express.js
Database: MongoDB Atlas & Mongoose
Authentication: JSON Web Tokens (JWT)

AI Engine
Core Service: Google Gemini API

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Make sure you have Node.js and npm installed on your machine.

npm
  npm install npm@latest -g

Installation
  Clone the repo
  git clone https://github.com/your_username/PathPilotProject.git

  Install backend dependencies

  cd backend
  npm install

  Install frontend dependencies
  
  cd ../frontend
  npm install

Create a .env file in the backend directory and add your secret keys:

PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_JWT_SECRET
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

Running the Application
Run the backend server (from the backend directory)

npm start

Run the frontend server (from the frontend directory)

npm run dev

Now, open http://localhost:5173 in your browser to see the application live!


🌟 Future Goals : 
Personalized Learning Path Generation: Implement the core logic to create a custom learning roadmap based on quiz scores.
Gamification System: Add XP, levels, and badges to make learning more engaging.
Admin Panel: Build a dashboard for managing users, topics, and content.
