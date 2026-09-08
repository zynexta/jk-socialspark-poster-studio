import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateJWT, authorizeRole('admin', 'superadmin'), getAnalytics);

export default router;
