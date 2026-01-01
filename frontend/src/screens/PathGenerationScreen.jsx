import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useGenerateAiPathMutation } from '../slices/topicsApiSlice.js';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, ArrowRight, Zap } from 'lucide-react';
import Loader from '../components/Loader.jsx';

const PathGenerationScreen = () => {
  // 1. EXACT LOGIC FROM YOUR FILE
  const { topicName } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ FIXED: Added useLocation hook to access location.state

  const [generateAiPath, { isLoading }] = useGenerateAiPathMutation();

  const handleAiPath = async () => {
    try {
      // 1. Get Score from previous screen (default to 0 if missing)
      const currentScore = location.state?.score || 0;
      const totalQuestions = location.state?.total || 10;

      // 2. Send as an OBJECT (The Slice will now handle this correctly)
      // ✅ FIXED: topicName is already URL-decoded from useParams, pass as-is to mutation (it will encode for API)
      const pathData = await generateAiPath({ 
        topicName, 
        score: currentScore, 
        total: totalQuestions 
      }).unwrap();

      toast.success('AI Learning Path Generated!');
      navigate(`/ai-path/${topicName}`, { state: { pathData } });
    } catch (err) {
      console.error("AI Generation Error:", err); // Log error for easier debugging
      toast.error(err?.data?.message || err.error || "Failed to generate path");
    }
  };

  const handleResourcePath = () => {
    toast.info('Resource-based path generation is coming soon!');
  };

  // 2. PREMIUM STYLING & ANIMATION
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans pt-24 px-6 relative overflow-hidden flex flex-col items-center">
      
      {/* Background Ambient Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-medium mb-4"
          >
            <Zap size={14} className="fill-indigo-300" />
            <span>Ready to start learning?</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-sm"
          >
            Choose Your Path
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Select how you'd like to master <span className="text-indigo-400 font-semibold underline decoration-indigo-500/30 underline-offset-4">{decodeURIComponent(topicName)}</span>.
          </motion.p>
        </div>

        {/* Cards Container */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* CARD 1: AI Tutor Path */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="group relative bg-[#111116] border border-white/10 rounded-3xl p-8 md:p-10 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-8 group-hover:scale-110 transition-transform duration-300 border border-indigo-500/20">
                <Sparkles size={32} />
              </div>
              
              <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-indigo-300 transition-colors">AI Tutor Path</h3>
              <p className="text-slate-400 mb-10 flex-grow leading-relaxed text-lg">
                Let our advanced AI generate a completely custom, step-by-step curriculum for you. 
                This path is tailored to your specific skill level.
              </p>

              <button 
                onClick={handleAiPath}
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-500/25 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group-hover:shadow-indigo-500/40"
              >
                {isLoading ? <Loader /> : (
                  <>
                    <span>Generate with AI</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* CARD 2: Resource-Based Path */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="group relative bg-[#111116] border border-white/10 rounded-3xl p-8 md:p-10 hover:border-fuchsia-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-fuchsia-500/10 flex flex-col"
          >
             <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

             <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 mb-8 group-hover:scale-110 transition-transform duration-300 border border-fuchsia-500/20">
                <BookOpen size={32} />
              </div>
              
              <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-fuchsia-300 transition-colors">Resource Path</h3>
              <p className="text-slate-400 mb-10 flex-grow leading-relaxed text-lg">
                Explore a curated path built from top-rated YouTube tutorials and articles. 
                Perfect for visual learners who prefer real-world examples.
              </p>

              <button 
                onClick={handleResourcePath}
                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 shadow-lg shadow-fuchsia-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group-hover:shadow-fuchsia-500/40"
              >
                <span>Generate with Resources</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default PathGenerationScreen;