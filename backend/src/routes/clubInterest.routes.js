import express from 'express';
import { markInterested } from '../controllers/clubInterest.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Mark user as interested in a club
router.post('/:clubId/interested', authenticate, markInterested);

export default router;
