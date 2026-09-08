import express from 'express';
import { getTemplates, getTemplateByToken, createOrUpdateTemplate, deleteTemplate } from '../controllers/templateController.js';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTemplates);
router.get('/share/:token', getTemplateByToken);
router.get('/token/:token', getTemplateByToken);
router.post('/', authenticateJWT, authorizeRole('admin', 'superadmin'), createOrUpdateTemplate);
router.put('/:id', authenticateJWT, authorizeRole('admin', 'superadmin'), createOrUpdateTemplate);
router.delete('/:id', authenticateJWT, authorizeRole('admin', 'superadmin'), deleteTemplate);

export default router;
