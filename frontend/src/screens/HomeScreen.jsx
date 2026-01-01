import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { 
  ArrowRight, BrainCircuit, 
  Code, BookOpen, Layers, Zap 
} from "lucide-react";

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const floatingIcons = [
    { icon: Code, x: -200, y: -150, color: "text-blue-400" },
    { icon: BrainCircuit, x: 250, y: -100, color: "text-purple-400" },
    { icon: BookOpen, x: -250, y: 150, color: "text-green-400" },
    { icon: Layers, x: 200, y: 200, color: "text-pink-400" },
  ];

  return (
    // UPDATED: Changed pt-20 to 'pt-32 md:pt-40' for more spacing
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f] text-white font-sans selection:bg-indigo-500/30 pt-32 md:pt-40">
      
      {/* 1. BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      {/* 2. FLOATING ICONS */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
        {floatingIcons.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3], 
              x: [item.x, item.x + 20, item.x], 
              y: [item.y, item.y - 20, item.y] 
            }}
            transition={{ 
              duration: 5 + i, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${item.color}`}
          >
            <item.icon size={48} strokeWidth={1.5} className="opacity-50" />
          </motion.div>
        ))}
      </div>

      {/* 3. MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative text-center"
        >
          
          {/* Huge Hero Text */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 leading-[1.1]">
            Master Any Skill with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 animate-gradient">
              PathPilot AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing what to learn next. Get a{" "}
            <span className="text-white font-semibold">personalized roadmap</span>, 
            adaptive quizzes, and real-time progress tracking.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {userInfo ? (
              <Link
                to="/dashboard"
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-indigo-600 px-8 font-medium text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:bg-indigo-700 hover:scale-105 hover:shadow-indigo-500/50"
              >
                <span className="mr-2">Go to Dashboard</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white text-black px-10 font-bold shadow-lg shadow-white/10 transition-all duration-300 hover:bg-gray-100 hover:scale-105"
                >
                  <span className="mr-2">Get Started Free</span>
                  <Zap size={20} className="fill-black" />
                </Link>
                
                <Link
                  to="/explore"
                  className="inline-flex h-14 items-center justify-center rounded-full px-8 font-medium text-slate-300 transition-colors hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
                >
                  Explore Paths
                </Link>
              </>
            )}
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-8 md:gap-16 text-slate-500 text-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg">150+</span> Learners
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg">1k+</span> Quizzes Generated
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg">24/7</span> AI Mentor
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default HomeScreen;