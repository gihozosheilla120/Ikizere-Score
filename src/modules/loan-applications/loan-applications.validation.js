const Joi = require('joi');
const { LoanPurpose, LoanApplicationStatus } = require('../../constants/enums');

const createApplicationSchema = Joi.object({
  loanProductId: Joi.string().hex().length(24).required(),
  requestedAmount: Joi.number().positive().required(),
  requestedTermMonths: Joi.number().integer().min(1).max(120).required(),
  purpose: Joi.string()
    .valid(...Object.values(LoanPurpose))
    .required(),
});

const listApplicationsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string()
    .valid(...Object.values(LoanApplicationStatus))
    .optional(),
});

module.exports = {
  createApplicationSchema,
  listApplicationsQuerySchema,
};
