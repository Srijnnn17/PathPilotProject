// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend API is running!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});