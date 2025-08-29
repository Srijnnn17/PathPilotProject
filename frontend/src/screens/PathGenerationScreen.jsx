import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGenerateAiPathMutation } from '../slices/topicsApiSlice.js';
import { toast } from 'react-toastify';
import Loader from '../components/Loader.jsx';

const PathGenerationScreen = () => {
  const { topicName } = useParams();
  const navigate = useNavigate();

  const [generateAiPath, { isLoading }] = useGenerateAiPathMutation();

  const handleAiPath = async () => {
    try {
      const pathData = await generateAiPath(topicName).unwrap();
      toast.success('AI Learning Path Generated!');
      // 👇 This will navigate to the new screen and pass the AI data
      navigate(`/ai-path/${topicName}`, { state: { pathData } });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleResourcePath = () => {
    toast.info('Resource-based path generation is coming soon!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 text-white p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
          Choose Your Learning Path
        </h1>
        <p className="text-lg text-gray-300">
          Select how you'd like to master{' '}
          <span className="font-bold text-cyan-300">
            {decodeURIComponent(topicName)}
          </span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
        {/* Card 1: AI Generated Path */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-cyan-500/20">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent mb-4">
            AI Tutor Path
          </h2>
          <p className="text-gray-200 mb-6 flex-grow">
            Let our advanced AI generate a completely custom, step-by-step
            curriculum for you. This path is tailored to your skill level and
            provides a structured learning experience.
          </p>
          <button
            onClick={handleAiPath}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-transform transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader /> : 'Generate with AI'}
          </button>
        </div>

        {/* Card 2: Resource-Based Path */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-purple-500/20">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Resource-Based Path
          </h2>
          <p className="text-gray-200 mb-6 flex-grow">
            Explore a curated path built from top-rated YouTube tutorials and
            articles. This path is perfect for visual learners who prefer
            real-world examples and diverse content.
          </p>
          <button
            onClick={handleResourcePath}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-transform transform hover:scale-110"
          >
            Generate with Resources
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathGenerationScreen;
