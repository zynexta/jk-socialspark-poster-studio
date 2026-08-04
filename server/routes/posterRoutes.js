import express from 'express';
import { generatePoster, getPosterHistory } from '../controllers/posterController.js';

const router = express.Router();

router.post('/generate', generatePoster);
router.get('/history', getPosterHistory);

export default router;
