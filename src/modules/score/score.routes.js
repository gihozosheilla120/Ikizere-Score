const express = require('express');
const authenticate = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const scoreController = require('./score.controller');
const { scoreHistoryQuerySchema } = require('./score.validation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Score
 *   description: Ikizere Score engine endpoints
 */

router.use(authenticate);

router.get('/summary', scoreController.getSummary);
router.get('/breakdown', scoreController.getBreakdown);
router.get('/history', validate(scoreHistoryQuerySchema, 'query'), scoreController.getHistory);

module.exports = router;
