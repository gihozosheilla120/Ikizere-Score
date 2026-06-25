/**
 * @swagger
 * components:
 *   schemas:
 *     BusinessProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         businessName:
 *           type: string
 *           example: Habimana Retail Ltd
 *         businessType:
 *           type: string
 *           enum: [retail, wholesale, services, agriculture, manufacturing, technology, hospitality, other]
 *         industry:
 *           type: string
 *           enum: [retail_trade, wholesale_trade, agriculture, manufacturing, construction, transport, hospitality, healthcare, education, technology, financial_services, professional_services, other]
 *         registrationNumber:
 *           type: string
 *           example: RDB-2024-00123
 *         yearsInOperation:
 *           type: string
 *           enum: [less_than_1, 1_to_3, 3_to_5, 5_to_10, more_than_10]
 *         employeeCount:
 *           type: integer
 *           example: 5
 *         monthlyRevenue:
 *           type: number
 *           example: 1500000
 *         district:
 *           type: string
 *           example: Kigali
 *         sector:
 *           type: string
 *           example: Gasabo
 *         country:
 *           type: string
 *           example: Rwanda
 *         businessAddress:
 *           type: string
 *           example: KG 123 St, Kigali
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [draft, submitted, completed]
 *         isCompleted:
 *           type: boolean
 *         completedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UpdateBusinessProfileRequest:
 *       type: object
 *       properties:
 *         businessName:
 *           type: string
 *         businessType:
 *           type: string
 *         industry:
 *           type: string
 *         registrationNumber:
 *           type: string
 *         yearsInOperation:
 *           type: string
 *         employeeCount:
 *           type: integer
 *         monthlyRevenue:
 *           type: number
 *         district:
 *           type: string
 *         sector:
 *           type: string
 *         country:
 *           type: string
 *         businessAddress:
 *           type: string
 *         description:
 *           type: string
 *         complete:
 *           type: boolean
 *           description: Set to true to mark the profile as completed
 *           default: false
 *     BusinessProfileResponse:
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
 *             profile:
 *               $ref: '#/components/schemas/BusinessProfile'
 */

/**
 * @swagger
 * /users/me/business-profile:
 *   get:
 *     summary: Get the authenticated user's business profile
 *     tags: [Business Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Business profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BusinessProfileResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Business profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Create or update the authenticated user's business profile
 *     tags: [Business Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBusinessProfileRequest'
 *           example:
 *             businessName: Habimana Retail Ltd
 *             businessType: retail
 *             industry: retail_trade
 *             registrationNumber: RDB-2024-00123
 *             yearsInOperation: 3_to_5
 *             employeeCount: 5
 *             monthlyRevenue: 1500000
 *             district: Kigali
 *             sector: Gasabo
 *             country: Rwanda
 *             businessAddress: KG 123 St, Kigali
 *             description: Small retail business specializing in household goods
 *             complete: true
 *     responses:
 *       200:
 *         description: Business profile saved or completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BusinessProfileResponse'
 *       400:
 *         description: Validation error or incomplete profile when complete=true
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

module.exports = {};
