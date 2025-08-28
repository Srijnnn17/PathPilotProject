import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  resources: [{
    title: String,
    url: String,
    type: { type: String, enum: ['video', 'article'] }
  }],
  isCompleted: { type: Boolean, default: false }
});

const learningPathSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Topic',
  },
  modules: [moduleSchema],
}, {
  timestamps: true,
});

const LearningPath = mongoose.model('LearningPath', learningPathSchema);

export default LearningPath;