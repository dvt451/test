import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Публичные маршруты
router.post('/register', register);
router.post('/login', login);

// Защищённый маршрут
router.get('/profile', authMiddleware, getProfile);

export default router;