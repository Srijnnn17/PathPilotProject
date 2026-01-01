import asyncHandler from 'express-async-handler';
// If you do not have a Topic model yet, this ensures the server still starts.
// If you DO have '../models/topicModel.js', uncomment the import below:
// import Topic from '../models/topicModel.js'; 

// @desc    Get all topics
// @route   GET /api/topics
// @access  Private
const getAllTopics = asyncHandler(async (req, res) => {
  // mocked response to prevent crashes if DB isn't set up yet
  res.status(200).json([
    { _id: '1', name: 'JavaScript' }, 
    { _id: '2', name: 'React' },
    { _id: '3', name: 'Node.js' }
  ]);
  
  // REAL CODE (Uncomment if you have the model):
  // const topics = await Topic.find({});
  // res.json(topics);
});

// @desc    Create a topic
// @route   POST /api/topics
// @access  Private
const createTopic = asyncHandler(async (req, res) => {
  res.status(201).json({ message: "Topic Created (Mock)" });

  // REAL CODE (Uncomment if you have the model):
  // const { name } = req.body;
  // const topic = await Topic.create({ name });
  // res.status(201).json(topic);
});

export { getAllTopics, createTopic };