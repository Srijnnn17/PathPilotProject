// import React from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';

// const AiPathScreen = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { topicName } = useParams();

//   const pathData = location.state?.pathData;

//   if (!pathData) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 text-white p-4">
//         <h1 className="text-3xl font-bold mb-4">No Learning Path Data</h1>
//         <p className="mb-8">Please go back and generate a path first.</p>
//         <button 
//           onClick={() => navigate('/topics')}
//           className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold px-8 py-3 rounded-full shadow-lg"
//         >
//           Back to Topics
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 text-white">
//       <div className="container mx-auto py-12 px-4">
//         <button onClick={() => navigate(`/generate-path/${topicName}`)} className="mb-8 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//         </button>
//         <h1 className="text-4xl md:text-5xl font-extrabold mb-10 drop-shadow-lg text-center">
//           Your AI-Generated Path for <span className="text-cyan-300">{decodeURIComponent(topicName)}</span>
//         </h1>
//         <div className="max-w-3xl mx-auto space-y-6">
//           {pathData.modules.map((module, index) => (
//             <div key={index} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 transition-all duration-300 hover:border-cyan-300">
//               <h2 className="text-2xl font-bold text-white mb-2">{module.title}</h2>
//               <p className="text-gray-300 font-semibold">Difficulty: {module.difficulty}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AiPathScreen;

import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const AiPathScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topicName } = useParams();

  const pathData = location.state?.pathData;

  if (!pathData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 text-white p-4">
        <h1 className="text-3xl font-bold mb-4">No Learning Path Data</h1>
        <p className="mb-8">Please go back and generate a path first.</p>
        <button 
          onClick={() => navigate('/topics')}
          className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold px-8 py-3 rounded-full shadow-lg"
        >
          Back to Topics
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 text-white">
      <div className="container mx-auto py-12 px-4">
        <button onClick={() => navigate(`/generate-path/${topicName}`)} className="mb-8 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 drop-shadow-lg text-center">
          Your AI-Generated Path for <span className="text-cyan-300">{decodeURIComponent(topicName)}</span>
        </h1>
        <div className="max-w-3xl mx-auto space-y-6">
          {pathData.modules.map((module, index) => (
            <div key={index} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 transition-all duration-300 hover:border-cyan-300">
              <h2 className="text-2xl font-bold text-white mb-2">{module.title}</h2>
              <p className="text-gray-300 font-semibold mb-2">Difficulty: {module.difficulty}</p>
              
              {/* ✅ Show description if available */}
              {module.description && (
                <p className="text-gray-200 mb-3">{module.description}</p>
              )}

              {/* ✅ Show resources if available */}
              {module.resources && module.resources.length > 0 && (
                <div className="mt-3">
                  <h3 className="text-lg font-semibold text-cyan-300 mb-2">Resources:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {module.resources.map((res, i) => (
                      <li key={i}>
                        <a 
                          href={res.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-300 hover:underline"
                        >
                          {res.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiPathScreen;
