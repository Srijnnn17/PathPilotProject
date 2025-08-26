import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800">
      {/* Animated background accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[32rem] h-[32rem] bg-indigo-500/40 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Fullscreen Card / Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative backdrop-blur-xl bg-white/10 shadow-2xl rounded-none px-6 md:px-12 py-20 w-full h-full flex flex-col items-center justify-center text-center border-t border-white/20"
      >
        {/* Decorative sparkle */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="absolute top-8 left-1/2 -translate-x-1/2"
        >
          <Sparkles className="w-14 h-14 text-yellow-300 drop-shadow-xl" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-6xl md:text-8xl font-extrabold text-white drop-shadow-lg leading-tight"
        >
          Welcome to{" "}
          <span className="bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent">
            PathPilot
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-medium"
        >
          Your personalized AI-driven guide to mastering new skills. <br />
          Start your journey today and let us pilot you to success 🚀
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-14"
        >
          {userInfo ? (
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold py-4 px-12 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Go to Your Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold py-4 px-12 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Get Started
            </Link>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomeScreen;
