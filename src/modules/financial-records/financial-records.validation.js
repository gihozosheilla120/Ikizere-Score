const Joi = require('joi');
const {
  RecordType,
  Currency,
  RecordSource,
  enumValues,
} = require('../../constants/enums');

const tagsSchema = Joi.array().items(Joi.string().trim().max(30)).max(10);

const createRecordSchema = Joi.object({
  type: Joi.string()
    .valid(...enumValues(RecordType))
    .required(),
  category: Joi.string().trim().lowercase().required(),
  amount: Joi.number().positive().max(999999999).required(),
  currency: Joi.string()
    .valid(...enumValues(Currency))
    .default('RWF'),
  transactionDate: Joi.date().iso().required(),
  description: Joi.string().trim().max(500).allow('').default(''),
  source: Joi.string()
    .valid(...enumValues(RecordSource))
    .default('manual'),
  receiptUrl: Joi.string().uri().allow(null, '').optional(),
  tags: tagsSchema.default([]),
});

const updateRecordSchema = Joi.object({
  type: Joi.string().valid(...enumValues(RecordType)),
  category: Joi.string().trim().lowercase(),
  amount: Joi.number().positive().max(999999999),
  currency: Joi.string().valid(...enumValues(Currency)),
  transactionDate: Joi.date().iso(),
  description: Joi.string().trim().max(500).allow(''),
  source: Joi.string().valid(...enumValues(RecordSource)),
  receiptUrl: Joi.string().uri().allow(null, ''),
  tags: tagsSchema,
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required to update the record',
  });

const listRecordsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  type: Joi.string().valid(...enumValues(RecordType)),
  category: Joi.string().trim().lowercase(),
  currency: Joi.string().valid(...enumValues(Currency)),
  fromDate: Joi.date().iso(),
  toDate: Joi.date().iso().min(Joi.ref('fromDate')),
  minAmount: Joi.number().min(0),
  maxAmount: Joi.number().min(Joi.ref('minAmount')),
  search: Joi.string().trim().max(100),
  sortBy: Joi.string()
    .valid('transactionDate', 'amount', 'createdAt')
    .default('transactionDate'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

const monthlyInsightsQuerySchema = Joi.object({
  year: Joi.number().integer().min(2000).max(2100),
  month: Joi.number().integer().min(1).max(12),
  currency: Joi.string().valid(...enumValues(Currency)),
});

const categoriesQuerySchema = Joi.object({
  type: Joi.string().valid(...enumValues(RecordType)),
});

module.exports = {
  createRecordSchema,
  updateRecordSchema,
  listRecordsQuerySchema,
  monthlyInsightsQuerySchema,
  categoriesQuerySchema,
};
