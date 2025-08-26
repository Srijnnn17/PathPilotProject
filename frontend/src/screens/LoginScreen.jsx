import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Loader from "../components/Loader.jsx";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 px-4">
      {/* Background accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[32rem] h-[32rem] bg-indigo-500/40 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative backdrop-blur-xl bg-white/10 shadow-2xl rounded-2xl px-8 md:px-12 py-12 w-full max-w-md text-center border-t border-white/20"
      >
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg"
        >
          Welcome Back
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-3 text-gray-200 text-lg leading-relaxed"
        >
          Sign in to continue <br />
          your PathPilot journey 🚀
        </motion.p>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          onSubmit={submitHandler}
          className="mt-8 flex flex-col space-y-4"
        >
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
          />

          {isLoading && <Loader />}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 
                       text-white font-bold py-3 px-10 rounded-md shadow-lg transition-transform transform hover:scale-105 
                       focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Sign In
          </button>
        </motion.form>

        {/* Register Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-gray-300"
        >
          New to PathPilot?{" "}
          <Link
            to="/register"
            className="text-cyan-400 font-semibold hover:underline"
          >
            Create an account
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
