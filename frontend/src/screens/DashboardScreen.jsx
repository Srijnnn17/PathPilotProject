import React from 'react';
import { useGetMyQuizAttemptsQuery } from '../slices/topicsApiSlice.js';
import Loader from '../components/Loader.jsx';
import { Link } from 'react-router-dom';
// ADDED: LayoutDashboard to the imports below
import { 
  Trophy, Calendar, ArrowRight, Activity, 
  BarChart3, Sparkles, BookOpen, Zap, Target, LayoutDashboard 
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Stat Card Component ---
const StatCard = ({ icon: Icon, title, value, subValue, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="relative p-6 rounded-[2rem] bg-[#111116] border border-white/5 overflow-hidden group hover:border-white/10 transition-all"
  >
    <div className={`absolute top-0 right-0 p-4 opacity-20 ${color.text} group-hover:opacity-30 transition-opacity`}>
      <Icon size={100} />
    </div>
    <div className="relative z-10">
      <div className={`w-12 h-12 mb-4 rounded-xl ${color.bg} flex items-center justify-center ${color.text} shadow-lg shadow-${color.shadow}/20`}>
        <Icon size={24} />
      </div>
      <p className="text-slate-400 font-medium mb-1">{title}</p>
      <div className="flex items-end gap-2">
        <p className="text-4xl font-black text-white tracking-tight">{value}</p>
        {subValue && <p className={`text-sm font-bold mb-1 ${color.text}`}>{subValue}</p>}
      </div>
    </div>
    {/* Bottom Glow Bar */}
    <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${color.gradient} opacity-50`} />
  </motion.div>
);

const DashboardScreen = () => {
  const { data: attempts, isLoading, error } = useGetMyQuizAttemptsQuery();

  // Helper to calculate total stats
  const totalQuizzes = attempts ? attempts.length : 0;
  const averageScoreVal = attempts && attempts.length > 0
    ? Math.round(attempts.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions) * 100, 0) / attempts.length)
    : 0;

  // Helper for Score Color
  const getScoreColor = (score) => {
    if (score >= 80) return { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' };
    if (score >= 60) return { text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' };
    return { text: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' };
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-indigo-500/30 pt-32 pb-20">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none fixed">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4"
            >
              <LayoutDashboard size={14} />
              User Dashboard
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
              Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Center</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Your central hub for tracking progress, analyzing performance, and launching new learning paths.
            </p>
          </div>
          
          <Link to="/topics" className="group inline-flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all font-bold">
            <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-full group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <BookOpen size={18} />
            </div>
            <span>Browse New Topics</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader /></div>
        ) : error ? (
          <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 text-center">
            <AlertCircle size={40} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Failed to load dashboard</h3>
            <p>{error?.data?.message || error.error}</p>
          </div>
        ) : (
          <>
            {/* 1. VIBRANT STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <StatCard 
                icon={Trophy} title="Quizzes Completed" value={totalQuizzes} 
                color={{ text: 'text-cyan-400', bg: 'bg-cyan-500/10', shadow: 'cyan-500', gradient: 'from-cyan-500 to-blue-500' }} 
                delay={0}
              />
              <StatCard 
                icon={Activity} title="Average Score" value={`${averageScoreVal}%`} 
                subValue={averageScoreVal >= 80 ? '+ Excellent' : averageScoreVal >= 60 ? '+ Good' : '+ Needs Focus'}
                color={{ text: 'text-indigo-400', bg: 'bg-indigo-500/10', shadow: 'indigo-500', gradient: 'from-indigo-500 to-purple-500' }}
                delay={0.1}
              />
              <StatCard 
                icon={Zap} title="Current Status" value={totalQuizzes > 5 ? 'Explorer' : 'Novice'}
                subValue={totalQuizzes > 5 ? 'Level 2' : 'Level 1'}
                color={{ text: 'text-purple-400', bg: 'bg-purple-500/10', shadow: 'purple-500', gradient: 'from-purple-500 to-pink-500' }}
                delay={0.2}
              />
            </div>

            {/* 2. RECENT ACTIVITY SECTION */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-xl">
                  <BarChart3 className="text-indigo-400" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Recent History</h2>
              </div>
            </div>

            {/* 3. QUIZ CARDS GRID */}
            {attempts.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 px-8 bg-[#111116] border border-dashed border-white/10 rounded-[3rem] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent" />
                <div className="relative z-10">
                  <div className="inline-flex p-6 rounded-full bg-indigo-500/10 text-indigo-400 mb-6 shadow-xl shadow-indigo-500/10">
                    <Target size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">No Activity Yet</h3>
                  <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg">
                    Your command center is waiting. Take your first quiz to start generating personalized learning paths.
                  </p>
                  <Link to="/topics" className="group inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1">
                    <span>Start Your Journey</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attempts.map((attempt, index) => {
                  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                  const scoreStyle = getScoreColor(percentage);

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={attempt._id}
                      className="group relative p-1 rounded-[2rem] bg-gradient-to-b from-white/10 to-white/5 hover:from-indigo-500/20 hover:to-cyan-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10"
                    >
                      <div className="h-full p-6 bg-[#0a0a0f] rounded-[1.9rem] relative overflow-hidden">
                        {/* Topic Header */}
                        <div className="flex justify-between items-start mb-6 relative z-10">
                          <div className="flex-1 pr-4">
                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                              {attempt.topic?.name || attempt.topicName}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 font-medium">
                              <Calendar size={14} />
                              {new Date(attempt.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          {/* Circular Score Badge */}
                          <div className={`relative flex items-center justify-center w-14 h-14 rounded-full border-[3px] ${scoreStyle.border} ${scoreStyle.bg} ${scoreStyle.text} font-black text-sm shadow-sm`}>
                            {percentage}%
                          </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                          <div>
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Score</span>
                            <p className="text-lg font-bold text-white">
                              {attempt.score} <span className="text-slate-500">/ {attempt.totalQuestions}</span>
                            </p>
                          </div>

                          <Link 
                            to={`/generate-path/${attempt.topic?.name || attempt.topicName}`}
                            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider py-2.5 px-5 rounded-full transition-all ${
                              !attempt.topic 
                                ? 'opacity-50 cursor-not-allowed bg-slate-800/50 text-slate-500' 
                                : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-600 hover:text-white shadow-sm hover:shadow-indigo-500/20'
                            }`}
                          >
                            View Path <ArrowRight size={14} />
                          </Link>
                        </div>
                        
                        {/* Card Hover Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;