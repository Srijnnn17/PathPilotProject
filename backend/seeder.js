import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import { topics } from './data/topics.js';
import { quizzes } from './data/quizzes.js';
import Topic from './models/topicModel.js';
import Quiz from './models/quizModel.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Topic.deleteMany();
    await Quiz.deleteMany();

    const createdTopics = await Topic.insertMany(topics);

    const jsTopic = createdTopics.find((t) => t.name === 'JavaScript');
    const reactTopic = createdTopics.find((t) => t.name === 'React');
    const nodeTopic = createdTopics.find((t) => t.name === 'Node.js');

    const sampleQuizzes = quizzes.map((quiz, index) => {
        if (index < 2) return { ...quiz, topic: jsTopic._id };
        if (index < 4) return { ...quiz, topic: reactTopic._id };
        return { ...quiz, topic: nodeTopic._id };
    });

    await Quiz.insertMany(sampleQuizzes);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

importData();