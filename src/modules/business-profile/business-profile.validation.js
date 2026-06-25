const Joi = require('joi');
const { BusinessType, Industry, YearsInOperation, enumValues } = require('../../constants/enums');

const businessProfileFields = {
  businessName: Joi.string().trim().min(2).max(150),
  businessType: Joi.string().valid(...enumValues(BusinessType)),
  industry: Joi.string().valid(...enumValues(Industry)),
  registrationNumber: Joi.string().trim().max(50).allow('', null),
  yearsInOperation: Joi.string().valid(...enumValues(YearsInOperation)),
  employeeCount: Joi.number().integer().min(0).max(100000),
  monthlyRevenue: Joi.number().min(0),
  district: Joi.string().trim().max(100),
  sector: Joi.string().trim().max(100),
  country: Joi.string().trim().max(100),
  businessAddress: Joi.string().trim().max(300).allow('', null),
  description: Joi.string().trim().max(1000).allow('', null),
};

const updateBusinessProfileSchema = Joi.object({
  ...businessProfileFields,
  complete: Joi.boolean().default(false),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required to update the business profile',
  });

module.exports = {
  updateBusinessProfileSchema,
};
