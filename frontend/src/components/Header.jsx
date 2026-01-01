import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice.js";
import { Menu, X, LogOut, LayoutDashboard, BookOpen } from "lucide-react";

// --- CUSTOM "P" LOGO (Always Shining) ---
const PathPilotLogo = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Inner fill with gradient - Opacity increased for visibility */}
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" className="opacity-80" stroke="none" fill="url(#logo-gradient)" />
    {/* Outline strokes */}
    <path d="M9 7h6a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H9V7z" />
    <path d="M9 13v8" />
    <path d="M9 3v4" />
    <defs>
      <linearGradient id="logo-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#818cf8" /> {/* Indigo-400 */}
        <stop offset="1" stopColor="#22d3ee" /> {/* Cyan-400 */}
      </linearGradient>
    </defs>
  </svg>
);

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? "bg-[#0a0a0f]/95 backdrop-blur-md border-white/10 shadow-lg" 
          : "bg-[#0a0a0f] border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* LEFT: Logo (PERMANENTLY SHINING) */}
        <Link to="/" className="flex items-center gap-3 group z-50">
          {/* Updated Classes:
             1. bg-indigo-600/30 (Brighter background)
             2. border-indigo-400/50 (Brighter border)
             3. shadow-[0_0_25px...] (Permanent large glow)
             4. animate-pulse (Subtle heartbeat effect)
          */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/50 shadow-[0_0_20px_rgba(99,102,241,0.6)] animate-[pulse_3s_ease-in-out_infinite]">
            <PathPilotLogo className="w-6 h-6 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
          </div>
          
          <span className="text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
            PathPilot
          </span>
        </Link>

        {/* RIGHT: Desktop Nav & Actions */}
        <div className="hidden md:flex items-center gap-6">
          
          {/* Nav Links */}
          <div className="flex items-center gap-1 mr-4">
            <Link
              to="/topics"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2"
            >
              <BookOpen size={16} />
              Topics
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          </div>

          <div className="h-6 w-px bg-white/10 mx-2" />

          {userInfo ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-white">{userInfo.name}</span>
              <button
                onClick={logoutHandler}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-all"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="text-sm font-bold text-slate-300 hover:text-white px-3 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileOpen((s) => !s)}
            className="p-2 text-slate-300 hover:text-white bg-white/5 rounded-lg border border-white/5"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#0a0a0f] border-b border-white/10 shadow-2xl animate-in slide-in-from-top-5">
          <div className="p-4 flex flex-col gap-2">
            <Link
              to="/topics"
              onClick={() => setMobileOpen(false)}
              className="p-4 rounded-xl bg-white/5 text-slate-200 font-medium hover:bg-indigo-600/20 hover:text-indigo-300 transition-all flex items-center gap-3"
            >
              <BookOpen size={18} />
              Explore Topics
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="p-4 rounded-xl bg-white/5 text-slate-200 font-medium hover:bg-indigo-600/20 hover:text-indigo-300 transition-all flex items-center gap-3"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <div className="h-px w-full bg-white/10 my-2" />

            {userInfo ? (
              <button
                onClick={() => { setMobileOpen(false); logoutHandler(); }}
                className="p-4 rounded-xl bg-red-500/10 text-red-400 font-bold flex items-center justify-between"
              >
                <span>Logout ({userInfo.name})</span>
                <LogOut size={18} />
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 rounded-xl bg-white/5 text-center text-white font-semibold"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 rounded-xl bg-indigo-600 text-center text-white font-bold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;