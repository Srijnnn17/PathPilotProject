import React from 'react';
import { useGetMyQuizAttemptsQuery } from '../slices/topicsApiSlice.js';
import Loader from '../components/Loader.jsx';
import { Link } from 'react-router-dom';

const DashboardScreen = () => {
  const { data: attempts, isLoading, error } = useGetMyQuizAttemptsQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 text-white">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 drop-shadow-lg">
          My Dashboard
        </h1>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="text-center text-red-400 font-semibold p-8 bg-white/10 rounded-lg">
            {error?.data?.message || error.error}
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Quiz History & Learning Paths</h2>
            {attempts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-300 mb-4">You haven't attempted any quizzes yet.</p>
                <Link to="/topics" className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold px-6 py-2 rounded-full shadow-lg transition-transform transform hover:scale-105">
                  Explore Topics
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {attempts.map((attempt) => (
                  <div key={attempt._id} className="bg-white/10 p-4 rounded-lg flex justify-between items-center transition-all hover:bg-white/20">
                    <div>
                      <h3 className="text-lg font-bold text-cyan-300">{attempt.topic?.name || attempt.topicName}</h3>
                      <p className="text-sm text-gray-300">
                        Completed on: {new Date(attempt.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          {attempt.score} / {attempt.totalQuestions}
                        </p>
                        <p className="text-sm font-semibold text-emerald-400">
                          {((attempt.score / attempt.totalQuestions) * 100).toFixed(0)}%
                        </p>
                      </div>
                       {/* 👇 This is the corrected line */}
                      <Link 
                        to={`/path/${attempt.topic?._id}`}
                        className={`bg-cyan-500/80 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors duration-300 ${!attempt.topic ? 'pointer-events-none opacity-50' : ''}`}
                      >
                        View Path
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;