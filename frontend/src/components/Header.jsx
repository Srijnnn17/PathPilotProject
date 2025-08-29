import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice.js";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800/90 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <nav className="w-full flex items-center justify-between px-4 md:px-10 py-3 md:py-4 h-20">
        {/* left: logo + main nav */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center gap-3 group">
            <span
              aria-hidden
              className="inline-flex w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 shadow-lg ring-2 ring-cyan-400 group-hover:scale-110 group-hover:ring-indigo-400 transition-all duration-300"
            />
            <span className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300">
              PathPilot
            </span>
          </Link>

          {/* desktop nav */}
          <div className="hidden md:flex items-center space-x-6 ml-8">
            <Link
              to="/topics"
              className="relative text-white font-semibold px-4 py-2 rounded-md hover:text-cyan-300 transition-colors duration-200 after:content-[''] after:block after:h-0.5 after:bg-gradient-to-r after:from-cyan-400 after:to-indigo-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
            >
              Topics
            </Link>
            <Link
              to="/dashboard"
              className="relative text-white font-semibold px-4 py-2 rounded-md hover:text-cyan-300 transition-colors duration-200 after:content-[''] after:block after:h-0.5 after:bg-gradient-to-r after:from-cyan-400 after:to-indigo-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* right: actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* 👇 This is the corrected conditional block */}
          {userInfo ? (
            <>
              <span className="text-white font-semibold">Welcome, <span className="text-cyan-300">{userInfo.name}</span></span>
              <button
                onClick={logoutHandler}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-bold shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-300"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white font-semibold hover:text-cyan-300 transition-colors duration-300">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white px-4 py-2 rounded-md font-semibold flex items-center space-x-2 transition-colors duration-300"
              >
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>

        {/* mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileOpen((s) => !s)}
            aria-label="Toggle menu"
            className="p-2 rounded-md bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            {mobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800/95 border-t border-white/10 backdrop-blur-md shadow-2xl rounded-b-2xl">
          <div className="px-6 py-6 flex flex-col gap-4">
            <Link
              to="/topics"
              onClick={() => setMobileOpen(false)}
              className="text-white font-semibold px-3 py-2 rounded-md hover:bg-white/10 hover:text-cyan-300 transition-colors duration-200"
            >
              Topics
            </Link>

            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="text-white font-semibold px-3 py-2 rounded-md hover:bg-white/10 hover:text-cyan-300 transition-colors duration-200"
            >
              Dashboard
            </Link>

            {userInfo ? (
              <>
                <div className="text-white font-semibold">Welcome, <span className="text-cyan-300">{userInfo.name}</span></div>
                <button
                  onClick={() => { setMobileOpen(false); logoutHandler(); }}
                  className="w-full text-left px-3 py-2 rounded-md bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-bold shadow transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-md bg-white/10 text-white font-semibold hover:bg-cyan-500/80 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold shadow"
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