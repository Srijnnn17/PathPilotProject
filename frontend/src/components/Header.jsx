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
    <header className="sticky top-0 z-50 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <nav className="container mx-auto flex items-center justify-between px-6 py-3 md:py-4 h-20">
        {/* left: logo + main nav */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center gap-3">
            <span
              aria-hidden
              className="inline-flex w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-400 shadow-md transform -translate-y-0.5"
            />
            <span className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-indigo-400">
              PathPilot
            </span>
          </Link>

          {/* desktop nav */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/topics"
              className="text-white font-medium px-3 py-2 rounded-md hover:bg-white/10 hover:text-cyan-300 transition-colors duration-200"
            >
              Topics
            </Link>
            {/* add more links here if needed */}
          </div>
        </div>

        {/* right: actions */}
        <div className="hidden md:flex items-center space-x-3">
          {userInfo ? (
            <>
              <span className="text-white font-medium mr-2">Welcome, {userInfo.name}</span>
              <button
                onClick={logoutHandler}
                className="px-3 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold shadow-sm transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 rounded-md bg-white/10 text-white font-medium hover:bg-cyan-500/80 hover:text-white transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-semibold shadow-md transform hover:scale-105 transition focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                Sign Up
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800/95 border-t border-white/10 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-3">
            <Link
              to="/topics"
              onClick={() => setMobileOpen(false)}
              className="text-white font-medium px-3 py-2 rounded-md hover:bg-white/10 hover:text-cyan-300 transition-colors duration-200"
            >
              Topics
            </Link>

            {userInfo ? (
              <>
                <div className="text-white font-medium">Welcome, {userInfo.name}</div>
                <button
                  onClick={() => { setMobileOpen(false); logoutHandler(); }}
                  className="w-full text-left px-3 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-md bg-white/10 text-white font-medium hover:bg-cyan-500/80 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-semibold"
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
