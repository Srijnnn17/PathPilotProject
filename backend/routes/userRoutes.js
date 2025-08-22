// backend/routes/userRoutes.js
import express from 'express';
const router = express.Router();
import {
  loginUser,
  registerUser,
} from '../controllers/userController.js';

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;