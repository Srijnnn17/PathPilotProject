import React from 'react';

const FormContainer = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white font-sans selection:bg-indigo-500/30 relative overflow-hidden pt-20 pb-12 px-4">
      
      {/* 1. BACKGROUND EFFECTS (Consistent with the app theme) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-indigo-900/10 blur-[120px]" />
      </div>

      {/* 2. MAIN CARD CONTAINER */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#111116] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;