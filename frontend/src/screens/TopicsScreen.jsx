import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetTopicsQuery } from '../slices/topicsApiSlice.js';
import Loader from '../components/Loader.jsx';

const TopicsScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: topics, isLoading, error } = useGetTopicsQuery();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 pt-6 pb-12 px-4">
      <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-white text-center mb-10 drop-shadow-lg">
        Select a Topic
      </h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="text-center text-red-400 font-semibold">
          {error?.data?.message || error.error}
        </div>
      ) : (
        // 👇 This check prevents the error
        topics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
            {topics.map((topic) => (
              <div
                key={topic._id}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 flex flex-col transition-transform hover:scale-105 hover:shadow-3xl"
              >
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow">
                  {topic.name}
                </h2>
                <p className="text-gray-200 mb-6 flex-grow">{topic.description}</p>
                <Link
                  to={`/quiz/${topic.name}`}
                  className="inline-block self-start bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                >
                  Start Quiz
                </Link>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default TopicsScreen;