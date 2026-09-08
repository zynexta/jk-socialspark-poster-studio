import express from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/categoryController.js';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', authenticateJWT, authorizeRole('admin', 'superadmin'), createCategory);
router.delete('/:id', authenticateJWT, authorizeRole('admin', 'superadmin'), deleteCategory);

export default router;
