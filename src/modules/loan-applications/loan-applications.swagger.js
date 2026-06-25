/**
 * @swagger
 * components:
 *   schemas:
 *     ReadinessSnapshot:
 *       type: object
 *       properties:
 *         percent:
 *           type: number
 *           example: 75
 *         rating:
 *           type: string
 *           enum: [not_eligible, needs_improvement, eligible, highly_eligible]
 *     LoanApplication:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         loanProductId:
 *           type: string
 *         requestedAmount:
 *           type: number
 *           example: 500000
 *         requestedTermMonths:
 *           type: integer
 *           example: 12
 *         purpose:
 *           type: string
 *           enum: [inventory_purchase, equipment, working_capital, expansion, agriculture_seasonal, other]
 *         monthlyRevenueSnapshot:
 *           type: number
 *         ikizereScoreSnapshot:
 *           type: number
 *           example: 620
 *         readinessSnapshot:
 *           $ref: '#/components/schemas/ReadinessSnapshot'
 *         status:
 *           type: string
 *           enum: [draft, submitted, under_review, approved, rejected, funded]
 *         rejectionReason:
 *           type: string
 *           nullable: true
 *         submittedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     LoanApplicationEvent:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         eventType:
 *           type: string
 *           enum: [application_created, submitted, under_review, approved, rejected, funded, cancelled]
 *         message:
 *           type: string
 *         metadata:
 *           type: object
 *         occurredAt:
 *           type: string
 *           format: date-time
 *     CreateLoanApplicationRequest:
 *       type: object
 *       required: [loanProductId, requestedAmount, requestedTermMonths, purpose]
 *       properties:
 *         loanProductId:
 *           type: string
 *         requestedAmount:
 *           type: number
 *         requestedTermMonths:
 *           type: integer
 *         purpose:
 *           type: string
 *           enum: [inventory_purchase, equipment, working_capital, expansion, agriculture_seasonal, other]
 */

/**
 * @swagger
 * /loans/applications:
 *   post:
 *     summary: Submit a loan application
 *     description: Creates and submits a loan application. Requires eligibility based on Ikizere score, loan readiness, and revenue. Snapshots score and readiness at submission time.
 *     tags: [Loan Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLoanApplicationRequest'
 *           example:
 *             loanProductId: "65f1a2b3c4d5e6f7a8b9c0d1"
 *             requestedAmount: 500000
 *             requestedTermMonths: 6
 *             purpose: working_capital
 *     responses:
 *       201:
 *         description: Application submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     application:
 *                       $ref: '#/components/schemas/LoanApplication'
 *       400:
 *         description: Validation error
 *       403:
 *         description: User not eligible for product
 *       409:
 *         description: Active application already exists
 *   get:
 *     summary: List loan applications
 *     description: Returns the authenticated user's loan applications with optional status filter.
 *     tags: [Loan Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, submitted, under_review, approved, rejected, funded]
 *     responses:
 *       200:
 *         description: Applications retrieved
 */

/**
 * @swagger
 * /loans/applications/{id}:
 *   get:
 *     summary: Get loan application by ID
 *     tags: [Loan Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application retrieved
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /loans/applications/{id}/timeline:
 *   get:
 *     summary: Get loan application timeline
 *     description: Returns chronological timeline events for the application.
 *     tags: [Loan Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Timeline retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     timeline:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/LoanApplicationEvent'
 */

/**
 * @swagger
 * /loans/applications/{id}/cancel:
 *   patch:
 *     summary: Cancel a loan application
 *     description: Cancels a submitted or under-review application. Creates a cancelled timeline event and audit log.
 *     tags: [Loan Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application cancelled
 *       400:
 *         description: Application cannot be cancelled in current status
 *       404:
 *         description: Not found
 */
