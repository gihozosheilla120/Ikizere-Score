/**
 * @swagger
 * components:
 *   schemas:
 *     FinancialRecord:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         type:
 *           type: string
 *           enum: [income, expense, savings]
 *         category:
 *           type: string
 *         amount:
 *           type: number
 *         currency:
 *           type: string
 *           enum: [RWF, USD, TZS]
 *         transactionDate:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 *         source:
 *           type: string
 *         receiptUrl:
 *           type: string
 *           nullable: true
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     RecordCategory:
 *       type: object
 *       properties:
 *         slug:
 *           type: string
 *         name:
 *           type: string
 *         type:
 *           type: string
 *           enum: [income, expense, savings]
 *         description:
 *           type: string
 *         sortOrder:
 *           type: number
 *     CreateFinancialRecordRequest:
 *       type: object
 *       required:
 *         - type
 *         - category
 *         - amount
 *         - transactionDate
 *       properties:
 *         type:
 *           type: string
 *           enum: [income, expense, savings]
 *         category:
 *           type: string
 *           example: retail_sales
 *         amount:
 *           type: number
 *           example: 50000
 *         currency:
 *           type: string
 *           enum: [RWF, USD, TZS]
 *           default: RWF
 *         transactionDate:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 *         source:
 *           type: string
 *           enum: [manual, mobile_money, bank_transfer, business_account, cash, credit_line]
 *         receiptUrl:
 *           type: string
 *           format: uri
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *     MonthlyInsights:
 *       type: object
 *       properties:
 *         year:
 *           type: integer
 *         month:
 *           type: integer
 *         currency:
 *           type: string
 *           nullable: true
 *         totalIncome:
 *           type: number
 *         totalExpenses:
 *           type: number
 *         totalSavings:
 *           type: number
 *         netCashFlow:
 *           type: number
 */

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Create a financial record
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFinancialRecordRequest'
 *     responses:
 *       201:
 *         description: Record created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: List financial records with pagination, search, and filters
 *     tags: [Financial Records]
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
 *           default: 20
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense, savings]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *           enum: [RWF, USD, TZS]
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: minAmount
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxAmount
 *         schema:
 *           type: number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [transactionDate, amount, createdAt]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Records retrieved
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: Get a financial record by ID
 *     tags: [Financial Records]
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
 *         description: Record retrieved
 *       404:
 *         description: Not found
 *   patch:
 *     summary: Update a financial record
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFinancialRecordRequest'
 *     responses:
 *       200:
 *         description: Record updated
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a financial record (soft delete)
 *     tags: [Financial Records]
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
 *         description: Record deleted
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /records/insights/monthly:
 *   get:
 *     summary: Get monthly financial insights
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *           enum: [RWF, USD, TZS]
 *     responses:
 *       200:
 *         description: Monthly insights retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/MonthlyInsights'
 */

/**
 * @swagger
 * /records/categories:
 *   get:
 *     summary: Get record categories
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense, savings]
 *     responses:
 *       200:
 *         description: Categories retrieved
 */

module.exports = {};
