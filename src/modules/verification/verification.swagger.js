/**
 * @swagger
 * components:
 *   schemas:
 *     Verification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         idFrontUrl:
 *           type: string
 *         idBackUrl:
 *           type: string
 *         businessRegistrationCertUrl:
 *           type: string
 *         taxCertificateUrl:
 *           type: string
 *         profilePhotoUrl:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [pending, under_review, approved, rejected]
 *         rejectionReason:
 *           type: string
 *           nullable: true
 *         submittedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         reviewedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     VerificationUploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             idFrontUrl:
 *               type: string
 *             idBackUrl:
 *               type: string
 *             businessRegistrationCertUrl:
 *               type: string
 *             taxCertificateUrl:
 *               type: string
 *             profilePhotoUrl:
 *               type: string
 *     VerificationSubmitRequest:
 *       type: object
 *       required:
 *         - idFrontUrl
 *         - idBackUrl
 *         - businessRegistrationCertUrl
 *         - taxCertificateUrl
 *       properties:
 *         idFrontUrl:
 *           type: string
 *         idBackUrl:
 *           type: string
 *         businessRegistrationCertUrl:
 *           type: string
 *         taxCertificateUrl:
 *           type: string
 *         profilePhotoUrl:
 *           type: string
 *           nullable: true
 */

/**
 * @swagger
 * /verification/upload:
 *   post:
 *     summary: Upload verification documents (KYC/KYB)
 *     tags: [Verification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nationalIdFront:
 *                 type: string
 *                 format: binary
 *               nationalIdBack:
 *                 type: string
 *                 format: binary
 *               businessRegistrationCertificate:
 *                 type: string
 *                 format: binary
 *               taxCertificate:
 *                 type: string
 *                 format: binary
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationUploadResponse'
 *       400:
 *         description: Invalid file or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /verification/submit:
 *   post:
 *     summary: Submit verification for review
 *     tags: [Verification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerificationSubmitRequest'
 *     responses:
 *       201:
 *         description: Verification submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     verification:
 *                       $ref: '#/components/schemas/Verification'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /verification/status:
 *   get:
 *     summary: Get verification status summary
 *     tags: [Verification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status retrieved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Verification record not found
 */

/**
 * @swagger
 * /verification/details:
 *   get:
 *     summary: Get verification details (full record)
 *     tags: [Verification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details retrieved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Verification record not found
 */

/**
 * @swagger
 * /verification/admin/{userId}/approve:
 *   post:
 *     summary: Approve a user's verification (admin only)
 *     tags: [Verification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Target user ID
 *     responses:
 *       200:
 *         description: Verification approved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     verification:
 *                       $ref: '#/components/schemas/Verification'
 *       400:
 *         description: Verification not in reviewable state
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Verification record not found
 */

/**
 * @swagger
 * /verification/admin/{userId}/reject:
 *   post:
 *     summary: Reject a user's verification (admin only)
 *     tags: [Verification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Target user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Document unreadable
 *     responses:
 *       200:
 *         description: Verification rejected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     verification:
 *                       $ref: '#/components/schemas/Verification'
 *       400:
 *         description: Validation error or verification not reviewable
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Verification record not found
 */

module.exports = {};

