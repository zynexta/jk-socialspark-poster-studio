import express from 'express';
import { createShareLink, getShareLinks, getShareLinkByToken } from '../controllers/shareLinkController.js';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateJWT, authorizeRole('admin', 'superadmin'), createShareLink);
router.get('/', authenticateJWT, authorizeRole('admin', 'superadmin'), getShareLinks);
router.get('/token/:token', getShareLinkByToken);

export default router;
