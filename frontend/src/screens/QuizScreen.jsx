import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// 👇 CHANGED: Imported useGenerateQuizMutation instead of Query
import { useGenerateQuizMutation, useSubmitQuizMutation, useGetTopicsQuery } from '../slices/topicsApiSlice.js';
import Loader from '../components/Loader.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, ArrowRight,
  AlertCircle, Shield, Cpu, Cloud, Lock, 
  Globe, Database, Smartphone, Terminal,
  Wifi, Gamepad2, Activity, PenTool, Server, 
  Box, Glasses, Layers
} from 'lucide-react';

// --- DEMO DATA MATCHING TOPICS SCREEN ---
const DEMO_TOPICS = [
  { _id: 'demo-1', name: 'Cyber Security', icon: Shield },
  { _id: 'demo-2', name: 'Artificial Intelligence', icon: Cpu },
  { _id: 'demo-3', name: 'Cloud Computing', icon: Cloud },
  { _id: 'demo-4', name: 'Blockchain & Web3', icon: Lock },
  { _id: 'demo-5', name: 'Full Stack Dev', icon: Globe },
  { _id: 'demo-6', name: 'Data Structures', icon: Database },
  { _id: 'demo-7', name: 'Mobile Dev', icon: Smartphone },
  { _id: 'demo-8', name: 'DevOps Engineering', icon: Terminal },
  { _id: 'demo-9', name: 'Internet of Things', icon: Wifi },
  { _id: 'demo-10', name: 'Game Development', icon: Gamepad2 },
  { _id: 'demo-11', name: 'Data Science', icon: Activity },
  { _id: 'demo-12', name: 'UI/UX Design', icon: PenTool },
  { _id: 'demo-13', name: 'System Design', icon: Server },
  { _id: 'demo-14', name: 'Kubernetes', icon: Box },
  { _id: 'demo-15', name: 'AR / VR', icon: Glasses },
  { _id: 'demo-16', name: 'Microservices', icon: Layers },
];

const QuizScreen = () => {
  const { topicId } = useParams(); 
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // 1. Get Topics
  const { data: dbTopics, isLoading: isLoadingTopics } = useGetTopicsQuery();

  // 2. Resolve the specific topic
  const topic = dbTopics?.find((t) => t._id === topicId) || 
                DEMO_TOPICS.find((t) => t._id === topicId);

  // 3. 👇 CHANGED: Generate Quiz using Mutation (Manual Trigger)
  const [generateQuiz, { 
    data: questions, 
    isLoading: isLoadingQuiz, 
    error: quizError 
  }] = useGenerateQuizMutation();

  // 4. 👇 NEW: Automatically trigger the quiz generation when topic is found
  useEffect(() => {
    if (topic && topic.name) {
      // We trigger the mutation manually now
      generateQuiz(topic.name);
    }
  }, [topic, generateQuiz]);

  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    if (!userInfo) navigate('/login');
  }, [userInfo, navigate]);

  // Reset state if topic changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setFinalScore(0);
  }, [topicId]);

  const handleAnswerSelect = (option) => {
    if (showResults) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questions[currentQuestionIndex].question]: option,
    });
  };

  const handleSubmit = async () => {
    if (!questions || !topic) return;

    let localScore = 0;
    questions.forEach(q => {
       if (selectedAnswers[q.question] === q.correctAnswer) localScore++;
    });

    try {
      const responses = Object.keys(selectedAnswers).map(questionText => ({
        question: questionText,
        userAnswer: selectedAnswers[questionText],
      }));

      // Only submit to backend if it's a real topic (not demo)
      if (!topicId.startsWith('demo-') && topic && topic.name) {
        try {
          await submitQuiz({ topicName: topic.name, responses, questions }).unwrap();
          console.log('Quiz submitted successfully');
        } catch (submitError) {
          console.error('Quiz submission error:', submitError);
          // Still show results even if submission fails
        }
      }
      
      setFinalScore(localScore);
      setShowResults(true);

    } catch (err) {
      console.error("Quiz submission error:", err);
      setFinalScore(localScore);
      setShowResults(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (questions?.length - 1)) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleGeneratePath = () => {
    navigate(`/generate-path/${encodeURIComponent(topic.name)}`, { 
      state: { score: finalScore, total: questions.length } 
    });
  };

  // --- LOADING STATES ---
  if (isLoadingTopics || (isLoadingQuiz && !questions)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white pt-20">
        <Loader />
        <p className="mt-4 text-slate-400 animate-pulse">Initializing Neural Link...</p>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (!topic || quizError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white">
        <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-md">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Simulation Failed</h2>
          <p className="text-slate-300 mb-6">
            {quizError?.data?.message || "Could not load topic data."}
          </p>
          <button 
            onClick={() => navigate('/topics')}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Return to Topics
          </button>
        </div>
      </div>
    );
  }

  // --- RESULTS SCREEN ---
  if (showResults) {
    const percentage = Math.round((finalScore / questions.length) * 100);
    const isSuccess = percentage >= 60; 

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white pt-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-lg bg-[#111116] border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl overflow-hidden"
        >
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full blur-[100px] -translate-y-1/2 ${isSuccess ? 'bg-green-500/20' : 'bg-orange-500/10'}`} />

          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2">Mission Report</h1>
            <p className="text-slate-400 mb-8 font-medium">Topic: {topic.name}</p>

            <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#334155" strokeWidth="12" fill="none" />
                <circle 
                  cx="80" cy="80" r="70" 
                  stroke={isSuccess ? '#10b981' : '#f97316'} 
                  strokeWidth="12" fill="none" 
                  strokeDasharray="440" 
                  strokeDashoffset={440 - (440 * percentage) / 100} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black">{percentage}%</span>
                <span className="text-xs uppercase tracking-widest text-slate-500">Score</span>
              </div>
            </div>

            <p className="text-lg text-slate-300 mb-8">
              You answered <span className="font-bold text-white">{finalScore}</span> / <span className="font-bold text-white">{questions.length}</span> correctly.
            </p>
            
            <button 
              onClick={handleGeneratePath}
              className="w-full group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 overflow-hidden"
            >
              <span className="relative">Generate Mastery Path</span>
              <ArrowRight className="relative transition-transform group-hover:translate-x-1" size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!questions || questions.length === 0) return <Loader />;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // --- QUIZ INTERFACE ---
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans pt-32 pb-20 px-4 flex flex-col items-center">
      
      <div className="w-full max-w-3xl mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">{topic.name}</span> Quiz
          </h2>
          <p className="text-sm text-slate-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
        <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 font-mono text-sm">
          {Math.round(progress)}% Complete
        </div>
      </div>

      <div className="w-full max-w-3xl h-1 bg-white/10 rounded-full mb-10 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
        />
      </div>

      <AnimatePresence mode='wait'>
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full max-w-3xl"
        >
          <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-8">
            {currentQuestion.question}
          </h3>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion.question] === option;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full group relative p-5 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-4 ${
                    isSelected 
                      ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                      : 'bg-[#111116] border-white/5 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm transition-colors ${
                    isSelected 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  
                  <span className={`text-lg font-medium ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {option}
                  </span>

                  {isSelected && (
                    <div className="absolute right-5 text-indigo-400 animate-in fade-in zoom-in">
                      <CheckCircle size={24} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="w-full max-w-3xl mt-12 flex justify-end">
        <button
          onClick={handleNextQuestion}
          disabled={!selectedAnswers[currentQuestion.question] || isSubmitting}
          className={`
            group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all
            ${!selectedAnswers[currentQuestion.question] || isSubmitting
              ? 'bg-white/5 text-slate-500 cursor-not-allowed'
              : 'bg-white text-black hover:bg-slate-200 shadow-lg shadow-white/10'
            }
          `}
        >
          <span>
            {isSubmitting ? 'Analyzing...' : (currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz')}
          </span>
          {!isSubmitting && <ArrowRight size={20} className={!selectedAnswers[currentQuestion.question] ? '' : 'group-hover:translate-x-1 transition-transform'} />}
        </button>
      </div>

    </div>
  );
};

export default QuizScreen;