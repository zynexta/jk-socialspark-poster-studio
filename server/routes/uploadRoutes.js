import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateJWT, authorizeRole('admin', 'superadmin'), uploadImage);

export default router;
