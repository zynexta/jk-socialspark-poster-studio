import express from 'express';
import { createShareLink, getShareLinks, getShareLinkByToken } from '../controllers/shareLinkController.js';

const router = express.Router();

router.post('/', createShareLink);
router.get('/', getShareLinks);
router.get('/token/:token', getShareLinkByToken);

export default router;
