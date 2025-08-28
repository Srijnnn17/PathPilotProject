import asyncHandler from 'express-async-handler';
import LearningPath from '../models/learningPathModel.js';

// @desc    Get user's learning path for a topic
// @route   GET /api/learning-paths/:topicId
// @access  Private
const getLearningPath = asyncHandler(async (req, res) => {
  const learningPath = await LearningPath.findOne({
    user: req.user._id,
    topic: req.params.topicId,
  });

  if (learningPath) {
    res.status(200).json(learningPath);
  } else {
    res.status(404);
    throw new Error('Learning path not found. Please complete a quiz for this topic first.');
  }
});

export { getLearningPath };