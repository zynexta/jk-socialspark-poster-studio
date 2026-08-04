import express from 'express';
import { getTemplates, getTemplateByToken, createOrUpdateTemplate, deleteTemplate } from '../controllers/templateController.js';

const router = express.Router();

router.get('/', getTemplates);
router.get('/share/:token', getTemplateByToken);
router.get('/token/:token', getTemplateByToken);
router.post('/', createOrUpdateTemplate);
router.put('/:id', createOrUpdateTemplate);
router.delete('/:id', deleteTemplate);

export default router;
