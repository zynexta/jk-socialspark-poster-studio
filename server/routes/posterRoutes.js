import express from 'express';
import { generatePoster, getPosterHistory } from '../controllers/posterController.js';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', generatePoster);
router.post('/', generatePoster);
router.get('/history', authenticateJWT, authorizeRole('admin', 'superadmin'), getPosterHistory);
router.get('/', authenticateJWT, authorizeRole('admin', 'superadmin'), getPosterHistory);

export default router;
