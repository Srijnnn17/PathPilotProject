import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGenerateQuizQuery, useSubmitQuizMutation, useGetTopicsQuery } from '../slices/topicsApiSlice.js';
import { toast } from 'react-toastify';
import Loader from '../components/Loader.jsx';

const QuizScreen = () => {
  // FIX #1: Directly get `topicId` from the URL params.
  // The parameter name in your route is `topicId`, not `topicName`.
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // Fetch all topics to get the name from the ID
  const { data: topics } = useGetTopicsQuery();
  const topic = topics?.find((t) => t._id === topicId);

  // This part is now correct because `topicId` will have the right value
  const { data: questions, isLoading: isLoadingQuiz, error: quizError } = useGenerateQuizQuery(topicId, {
    skip: !userInfo || !topicId, // Also skip if topicId is not yet available
    refetchOnMountOrArgChange: true,
  });

  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setFinalScore(0);
  }, [topicId]);

  const handleAnswerSelect = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questions[currentQuestionIndex].question]: option,
    });
  };

  const handleSubmit = async () => {
    if (!questions || !topic) { // Check for topic as well
      toast.error('Quiz data is not available. Please try again.');
      return;
    }
    try {
      const responses = Object.keys(selectedAnswers).map(questionText => ({
        question: questionText,
        userAnswer: selectedAnswers[questionText],
      }));

      // FIX #2: Your backend `submitQuiz` controller expects `topicName`.
      // You were sending `topicId`. We already have the full topic object, so we can send its name.
      const res = await submitQuiz({ topicName: topic.name, responses, questions }).unwrap();
      
      setFinalScore(res.score);
      setShowResults(true);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (questions?.length - 1)) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  if (isLoadingQuiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 py-12 px-4">
        <h1 className="text-3xl font-bold text-white mb-4">Generating Your Quiz...</h1>
        <p className="text-lg text-gray-200 mb-8">Our AI is crafting a unique set of questions for you. Please wait a moment.</p>
        <Loader />
      </div>
    );
  }

  if (quizError) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800">
      <div className="text-center text-red-400 font-semibold">
        Error: {quizError.data?.message || quizError.error}
      </div>
    </div>
  );

  if (showResults) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 py-12 px-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-10 max-w-xl w-full text-center">
          <h1 className="text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
            Quiz Results for <span className="bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent">{topic ? topic.name : ''}</span>
          </h1>
          <p className="text-2xl text-gray-200 mb-8">You scored <span className="font-bold text-cyan-300">{finalScore}</span> out of <span className="font-bold text-indigo-300">{questions.length}</span>!</p>
          <button 
            onClick={() => navigate('/topics')}
            className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return <Loader />;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 py-12 px-4">
      <style>
        {`
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease-in-out infinite;
          }
          @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-2 drop-shadow flex flex-wrap justify-center gap-x-4">
          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 bg-clip-text text-transparent animate-gradient-x uppercase">
            {topic ? topic.name : ''}
          </span>
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent animate-gradient-x uppercase">
            Quiz
          </span>
        </h2>
        <p className="text-md text-gray-200">Question {currentQuestionIndex + 1} of {questions.length}</p>
      </div>
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-10 max-w-2xl w-full">
        <p className="text-xl text-white mb-8 text-center font-semibold drop-shadow">{currentQuestion.question}</p>
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 border-2 flex items-center space-x-4 font-medium text-lg
                ${
                  selectedAnswers[currentQuestion.question] === option
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 border-cyan-400 text-white shadow-lg scale-105'
                    : 'bg-white/20 border-white/20 text-white hover:bg-white/30 hover:border-cyan-300'
                }`}
            >
              <span className={`font-bold text-base rounded-md px-3 py-1 mr-2
                ${
                  selectedAnswers[currentQuestion.question] === option 
                    ? 'bg-white text-cyan-600'
                    : 'bg-cyan-200 text-cyan-700'
                }`}>
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
            </button>
          ))}
        </div>
        <div className="mt-10 flex justify-end">
          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswers[currentQuestion.question] || isSubmitting}
            className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : (currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
