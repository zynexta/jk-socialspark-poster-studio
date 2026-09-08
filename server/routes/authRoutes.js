import express from 'express';
import { login, getMe, updateProfile, updatePassword } from '../controllers/authController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticateJWT, getMe);
router.put('/update-profile', authenticateJWT, updateProfile);
router.put('/update-password', authenticateJWT, updatePassword);

export default router;
