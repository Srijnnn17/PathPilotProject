import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Map, CheckCircle, ArrowRight, 
  BookOpen, Clock, Trophy, AlertTriangle, ExternalLink
} from 'lucide-react';

const AiPathScreen = () => {
  const { topicName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Get the Data
  const { pathData } = location.state || {};

  // DEBUG: Log the data so you can see it in Console (F12)
  useEffect(() => {
    console.log("Raw AI Data Received:", pathData);
  }, [pathData]);

  if (!pathData) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-400">No Path Data Found</h2>
        <button 
          onClick={() => navigate(`/generate-path/${topicName}`)}
          className="px-6 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500"
        >
          Go to Generator
        </button>
      </div>
    );
  }

  // --- SMART PARSING LOGIC (FIXED) ---
  let steps = [];
  try {
    let parsed = pathData;
    
    // 1. Clean String if needed
    if (typeof pathData === 'string') {
       const cleanJson = pathData.replace(/```json/g, '').replace(/```/g, '').trim();
       parsed = JSON.parse(cleanJson);
    }

    // 2. Find the Array (Prioritizing 'modules' based on your old code)
    if (parsed.modules && Array.isArray(parsed.modules)) {
      steps = parsed.modules;
    } else if (Array.isArray(parsed)) {
      steps = parsed;
    } else if (parsed.steps && Array.isArray(parsed.steps)) {
      steps = parsed.steps;
    } else if (parsed.roadmap && Array.isArray(parsed.roadmap)) {
      steps = parsed.roadmap;
    } 
  } catch (err) {
    console.error("JSON Parsing Error:", err);
  }

  // --- ERROR STATE ---
  if (steps.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 px-4 text-center flex flex-col items-center">
        <AlertTriangle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Structure Mismatch</h2>
        <p className="text-slate-400 mb-6">The AI generated a path, but the format wasn't recognized.</p>
        <div className="bg-black/50 p-4 rounded-lg mb-6 max-w-lg w-full text-left overflow-auto max-h-40 border border-white/10">
          <p className="text-xs font-mono text-green-400">Data Received:</p>
          <pre className="text-xs text-slate-300 whitespace-pre-wrap">
            {typeof pathData === 'object' ? JSON.stringify(pathData, null, 2) : pathData}
          </pre>
        </div>
        <button 
          onClick={() => navigate(`/generate-path/${topicName}`)}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans pt-24 px-4 pb-20">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-bold mb-6 border border-indigo-500/20"
        >
          <Trophy size={14} />
          <span>Personalized Curriculum</span>
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          Your Mastery Path: {decodeURIComponent(topicName)}
        </h1>
      </div>

      {/* Roadmap Container */}
      <div className="max-w-3xl mx-auto relative">
        <div className="absolute left-[27px] md:left-[35px] top-4 bottom-4 w-1 bg-white/10 rounded-full" />

        <div className="space-y-12">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-6 md:gap-8 group"
            >
              {/* Number Bubble */}
              <div className="relative z-10 flex-shrink-0 w-14 h-14 md:w-18 md:h-18 rounded-2xl bg-[#111116] border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10 group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl font-bold text-indigo-400">{index + 1}</span>
                {index !== steps.length - 1 && (
                   <div className="absolute -bottom-12 left-1/2 w-1 h-full bg-indigo-500/20 -z-10" />
                )}
              </div>

              {/* Card */}
              <div className="flex-grow bg-[#111116] border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {step.title || step.topic || `Module ${index + 1}`}
                  </h3>
                  {step.difficulty && (
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      step.difficulty.toLowerCase() === 'beginner' ? 'bg-green-500/10 text-green-400' :
                      step.difficulty.toLowerCase() === 'intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {step.difficulty}
                    </span>
                  )}
                </div>
                
                <p className="text-slate-400 mb-4 leading-relaxed">
                  {step.description || "Master the core concepts defined in this module."}
                </p>

                {/* Resources (From your old code) */}
                {step.resources && step.resources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <BookOpen size={14} /> Recommended Resources:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {step.resources.map((res, i) => (
                        <a 
                          key={i} 
                          href={res.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 bg-white/5 hover:bg-indigo-500/20 text-indigo-300 rounded-lg transition-colors flex items-center gap-1 border border-white/5 hover:border-indigo-500/30"
                        >
                          {res.name} <ExternalLink size={10} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Success */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="mt-16 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-2xl shadow-green-500/30 mb-6">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Goal Achieved!</h2>
        </motion.div>

      </div>
    </div>
  );
};

export default AiPathScreen;