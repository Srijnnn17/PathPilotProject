import asyncHandler from 'express-async-handler';
import Topic from '../models/topicModel.js'; 

// @desc    Get all topics
// @route   GET /api/topics
// @access  Private
const getAllTopics = asyncHandler(async (req, res) => {
  try {
    const topics = await Topic.find({});
    res.status(200).json(topics);
  } catch (error) {
    // If database is not connected, return empty array instead of crashing
    console.warn('Topics fetch failed (DB may not be connected):', error.message);
    res.status(200).json([]);
  }
});

// @desc    Create a topic
// @route   POST /api/topics
// @access  Private
const createTopic = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Topic name is required');
  }

  // Check if topic already exists
  const existingTopic = await Topic.findOne({ name });
  if (existingTopic) {
    res.status(400);
    throw new Error('Topic already exists');
  }

  const topic = await Topic.create({ 
    name, 
    description: description || `Learn ${name}` 
  });
  
  res.status(201).json(topic);
});

export { getAllTopics, createTopic };