const Joi = require('joi');
const { Currency } = require('../../constants/enums');

const marketplaceQuerySchema = Joi.object({
  amount: Joi.number().positive().optional(),
  term: Joi.number().integer().min(1).max(120).optional(),
  currency: Joi.string()
    .valid(...Object.values(Currency))
    .optional(),
  search: Joi.string().trim().max(100).optional(),
});

module.exports = {
  marketplaceQuerySchema,
};
