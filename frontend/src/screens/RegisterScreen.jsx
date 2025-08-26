import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-start justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 px-4 pt-24">
      {/* Background accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[32rem] h-[32rem] bg-indigo-500/40 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative backdrop-blur-xl bg-white/10 shadow-2xl rounded-2xl px-8 md:px-12 py-12 w-full max-w-md text-center border-t border-white/20 max-h-[calc(100vh-6rem)] overflow-hidden"
      >
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg"
        >
          Create{" "}
          <span className="bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent">
            Account
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-3 text-gray-200 text-lg"
        >
          Join PathPilot today 🚀
        </motion.p>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 
                       text-white font-bold py-3 px-10 rounded-md shadow-lg transition-transform transform hover:scale-105 
                       focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Register
          </button>
        </motion.form>

        {/* Login Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-gray-300"
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-cyan-400 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default RegisterScreen;
