import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetLearningPathQuery } from '../slices/topicsApiSlice.js';
import Loader from '../components/Loader.jsx';
import { useSelector } from 'react-redux';

const LearningPathScreen = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // We need to fetch the learning path for the logged in user
  const { data: learningPath, isLoading, error } = useGetLearningPathQuery(topicId, {
    skip: !userInfo,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 text-white">
      <div className="container mx-auto py-12 px-4">
        <button onClick={() => navigate('/dashboard')} className="mb-8 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="text-center text-red-400 font-semibold p-8 bg-white/10 rounded-lg">
            {error?.data?.message || error.error}
          </div>
        ) : (
          learningPath && (
            <>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-8 drop-shadow-lg text-center">
                Your Learning Path for <span className="text-cyan-300">{learningPath.topic.name}</span>
              </h1>
              <div className="max-w-3xl mx-auto space-y-6">
                {learningPath.modules.map((module, index) => (
                  <div key={index} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{module.title}</h2>
                    <p className="text-gray-300 font-semibold mb-4">Difficulty: {module.difficulty}</p>
                    {/* We will add resources here in a future step */}
                  </div>
                ))}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default LearningPathScreen;