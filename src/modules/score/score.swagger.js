/**
 * @swagger
 * components:
 *   schemas:
 *     ScoreSummary:
 *       type: object
 *       properties:
 *         currentScore:
 *           type: number
 *           example: 742
 *         previousScore:
 *           type: number
 *         rating:
 *           type: string
 *           enum: [excellent, good, fair, poor]
 *         monthlyChange:
 *           type: number
 *           example: 12
 *         changeReason:
 *           type: string
 *         loanReadinessPercent:
 *           type: number
 *         loanReadinessRating:
 *           type: string
 *         percentileRank:
 *           type: number
 *           nullable: true
 *         lastCalculatedAt:
 *           type: string
 *           format: date-time
 *     ScoreBreakdown:
 *       type: object
 *       properties:
 *         currentScore:
 *           type: number
 *         rating:
 *           type: string
 *         factors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               factor:
 *                 type: string
 *               weight:
 *                 type: number
 *               score:
 *                 type: number
 *               weightedContribution:
 *                 type: number
 *         breakdown:
 *           type: object
 *           properties:
 *             savingsBehaviour:
 *               type: number
 *             incomeStability:
 *               type: number
 *             paymentConsistency:
 *               type: number
 *             businessActivity:
 *               type: number
 *             creditHistory:
 *               type: number
 *     ScoreHistoryEntry:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         score:
 *           type: number
 *         rating:
 *           type: string
 *         breakdown:
 *           type: object
 *         calculatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /score/summary:
 *   get:
 *     summary: Get Ikizere Score summary for the authenticated user
 *     tags: [Score]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Score summary retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ScoreSummary'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Score not found
 */

/**
 * @swagger
 * /score/breakdown:
 *   get:
 *     summary: Get Ikizere Score factor breakdown
 *     tags: [Score]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Score breakdown retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ScoreBreakdown'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Score not found
 */

/**
 * @swagger
 * /score/history:
 *   get:
 *     summary: Get Ikizere Score history
 *     tags: [Score]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 30
 *     responses:
 *       200:
 *         description: Score history retrieved
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
 *                     history:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ScoreHistoryEntry'
 *       401:
 *         description: Unauthorized
 */

module.exports = {};
