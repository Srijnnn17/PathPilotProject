import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent tracking-wide"
        >
          PathPilot
        </Link>

        {/* Navigation / Auth */}
        <div className="flex items-center space-x-6">
          {userInfo ? (
            <>
              <span className="text-gray-200 font-medium hidden sm:inline">
                Welcome, {userInfo.name}
              </span>
              <button
                onClick={logoutHandler}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-200 hover:text-cyan-300 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
