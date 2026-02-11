import express from 'express';
import { submitRegistration, getApplications, updateApplicationStatus, exportApplicationsCSV, checkRegistrationStatus } from '../controllers/clubRegistration.controller.js';
import { uploadProfilePhoto } from '../middleware/upload.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Submit registration (with photo upload)
// Submit registration (with photo upload)
router.post('/:clubId/register', authenticate, uploadProfilePhoto.single('profile_photo'), submitRegistration);

// Get applications for a club (club head only)
router.get('/:clubId', authenticate, getApplications);

// Update application status
router.put('/:applicationId/status', authenticate, updateApplicationStatus);

// Export applications as CSV
router.get('/:clubId/export', authenticate, exportApplicationsCSV);

// Check registration status
router.get('/:clubId/status', authenticate, checkRegistrationStatus);

export default router;
