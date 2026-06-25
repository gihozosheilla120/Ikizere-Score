const express = require('express');
const authenticate = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const loanApplicationsController = require('./loan-applications.controller');
const {
  createApplicationSchema,
  listApplicationsQuerySchema,
} = require('./loan-applications.validation');

const router = express.Router();

router.use(authenticate);

router.post(
  '/applications',
  validate(createApplicationSchema),
  loanApplicationsController.createApplication
);

router.get(
  '/applications',
  validate(listApplicationsQuerySchema, 'query'),
  loanApplicationsController.listApplications
);

router.get('/applications/:id/timeline', loanApplicationsController.getTimeline);

router.patch('/applications/:id/cancel', loanApplicationsController.cancelApplication);

router.get('/applications/:id', loanApplicationsController.getApplicationById);

module.exports = router;
