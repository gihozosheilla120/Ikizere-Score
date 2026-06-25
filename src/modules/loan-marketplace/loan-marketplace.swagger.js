/**
 * @swagger
 * components:
 *   schemas:
 *     LoanEligibilityRules:
 *       type: object
 *       properties:
 *         minLoanReadinessPercent:
 *           type: number
 *           example: 75
 *         requiresVerification:
 *           type: boolean
 *         minLoanReadinessRating:
 *           type: string
 *           enum: [not_eligible, needs_improvement, eligible, highly_eligible]
 *         notes:
 *           type: string
 *     LoanProductCard:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         lenderId:
 *           type: string
 *         lenderName:
 *           type: string
 *           example: Equity Apex Bank
 *         productName:
 *           type: string
 *           example: SME Working Capital
 *         description:
 *           type: string
 *         minimumScore:
 *           type: number
 *           example: 550
 *         minimumRevenue:
 *           type: number
 *           example: 500000
 *         interestRate:
 *           type: number
 *           example: 14.5
 *         minAmount:
 *           type: number
 *         maxAmount:
 *           type: number
 *         termMonths:
 *           type: number
 *           example: 12
 *         currency:
 *           type: string
 *           enum: [RWF, USD, TZS]
 *         eligibilityRules:
 *           $ref: '#/components/schemas/LoanEligibilityRules'
 *         matchPercent:
 *           type: number
 *           example: 82
 *         isEligible:
 *           type: boolean
 *         eligibilityReasons:
 *           type: array
 *           items:
 *             type: string
 *     LoanUserContext:
 *       type: object
 *       properties:
 *         currentScore:
 *           type: number
 *         loanReadinessPercent:
 *           type: number
 *         loanReadinessRating:
 *           type: string
 *         monthlyRevenue:
 *           type: number
 *     LoanProductDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/LoanProductCard'
 *         - type: object
 *           properties:
 *             lender:
 *               type: object
 *               nullable: true
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 logoUrl:
 *                   type: string
 *                   nullable: true
 *                 verified:
 *                   type: boolean
 *                 description:
 *                   type: string
 */

/**
 * @swagger
 * /loans/marketplace:
 *   get:
 *     summary: Browse loan marketplace
 *     description: Lists active loan products with match scores based on the user's Ikizere score, loan readiness, and revenue. Results are filtered by optional amount, term, currency, and search query.
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: amount
 *         schema:
 *           type: number
 *         description: Filter products that support this loan amount
 *       - in: query
 *         name: term
 *         schema:
 *           type: integer
 *         description: Filter products by repayment term in months
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *           enum: [RWF, USD, TZS]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search lender or product name
 *     responses:
 *       200:
 *         description: Marketplace products retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/LoanProductCard'
 *                     userContext:
 *                       $ref: '#/components/schemas/LoanUserContext'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /loans/marketplace/{id}:
 *   get:
 *     summary: Get loan product details
 *     description: Returns a single loan product with eligibility match, lender details, and optional amount/term filters applied.
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: amount
 *         schema:
 *           type: number
 *       - in: query
 *         name: term
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Loan product retrieved
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
 *                     product:
 *                       $ref: '#/components/schemas/LoanProductDetail'
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /loans/eligible-products:
 *   get:
 *     summary: Get eligible loan products
 *     description: Returns only loan products the user qualifies for based on Ikizere score, loan readiness, revenue, and verification requirements. Supports amount and term filters.
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: amount
 *         schema:
 *           type: number
 *       - in: query
 *         name: term
 *         schema:
 *           type: integer
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *           enum: [RWF, USD, TZS]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Eligible products retrieved
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
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/LoanProductCard'
 *                     userContext:
 *                       $ref: '#/components/schemas/LoanUserContext'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *       401:
 *         description: Unauthorized
 */
