import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  topic: { // 👈 This is the field we are fixing
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Topic',
  },
  topicName: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  responses: [{
    question: String,
    options: [String],
    correctAnswer: String,
    userAnswer: String,
  }],
}, {
  timestamps: true,
});

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

export default QuizAttempt;