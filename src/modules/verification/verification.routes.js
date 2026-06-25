const express = require('express');
const authenticate = require('../../middleware/auth');
const authorizeAdmin = require('../../middleware/authorizeAdmin');
const validate = require('../../middleware/validate');
const verificationController = require('./verification.controller');
const { verificationUploadFields } = require('./verification.upload');
const { rejectVerificationSchema } = require('./verification.validation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Verification
 *   description: KYC/KYB verification endpoints
 */

router.use(authenticate);

router.post('/admin/:userId/approve', authorizeAdmin, verificationController.adminApprove);
router.post(
  '/admin/:userId/reject',
  authorizeAdmin,
  validate(rejectVerificationSchema),
  verificationController.adminReject
);

router.post('/upload', verificationUploadFields, verificationController.upload);
router.post('/submit', express.json(), verificationController.submit);
router.get('/status', verificationController.status);
router.get('/details', verificationController.details);

module.exports = router;

