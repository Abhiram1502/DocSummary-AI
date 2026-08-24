import express from 'express';
import { handleGenerateSummary } from '../controllers/summaryController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// POST /api/summary
router.post('/', upload.single('file'), handleGenerateSummary);

export default router;
