import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto py-24 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
          Welcome to PathPilot
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Your personalized AI-driven guide to mastering new skills. Start your
          learning journey today and let us pilot you to success.
        </p>
        <div className="mt-8">
          {userInfo ? (
            <Link
              to="/dashboard"
              className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition duration-300"
            >
              Go to Your Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition duration-300"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;