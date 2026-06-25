const Joi = require('joi');

const scoreHistoryQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(30),
});

module.exports = {
  scoreHistoryQuerySchema,
};
