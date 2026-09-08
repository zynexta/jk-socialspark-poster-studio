import express from 'express';
import { generatePoster, getPosterHistory } from '../controllers/posterController.js';

const router = express.Router();

router.post('/generate', generatePoster);
router.post('/', generatePoster);
router.get('/history', getPosterHistory);
router.get('/', getPosterHistory);

export default router;
