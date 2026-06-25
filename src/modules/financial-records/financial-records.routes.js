const express = require('express');
const authenticate = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const financialRecordsController = require('./financial-records.controller');
const {
  createRecordSchema,
  updateRecordSchema,
  listRecordsQuerySchema,
  monthlyInsightsQuerySchema,
  categoriesQuerySchema,
} = require('./financial-records.validation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Financial Records
 *   description: Income, expense, and savings transaction management
 */

router.use(authenticate);

router.get(
  '/insights/monthly',
  validate(monthlyInsightsQuerySchema, 'query'),
  financialRecordsController.getMonthlyInsights
);

router.get(
  '/categories',
  validate(categoriesQuerySchema, 'query'),
  financialRecordsController.getCategories
);

router.post('/', validate(createRecordSchema), financialRecordsController.createRecord);

router.get('/', validate(listRecordsQuerySchema, 'query'), financialRecordsController.listRecords);

router.get('/:id', financialRecordsController.getRecordById);

router.patch('/:id', validate(updateRecordSchema), financialRecordsController.updateRecord);

router.delete('/:id', financialRecordsController.deleteRecord);

module.exports = router;
