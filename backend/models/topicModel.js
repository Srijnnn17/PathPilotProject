import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  // We can add more fields later, like an icon or image URL
}, {
  timestamps: true,
});

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;