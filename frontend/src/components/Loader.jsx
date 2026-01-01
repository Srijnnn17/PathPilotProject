import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="relative w-12 h-12">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        
        {/* Inner Ring (Reverse Spin) */}
        <div className="absolute inset-2 border-4 border-cyan-400/30 border-b-cyan-400 rounded-full animate-spin [animation-direction:reverse]"></div>
        
        {/* Center Glow */}
        <div className="absolute inset-0 m-auto w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff] animate-pulse"></div>
      </div>
    </div>
  );
};

export default Loader;