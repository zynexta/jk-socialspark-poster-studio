import express from 'express';
import { getTemplates, getTemplateByToken, createTemplate } from '../controllers/templateController.js';

const router = express.Router();

router.get('/', getTemplates);
router.get('/share/:token', getTemplateByToken);
router.post('/', createTemplate);

export default router;
