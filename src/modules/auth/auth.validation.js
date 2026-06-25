const Joi = require('joi');
const { BusinessType, enumValues } = require('../../constants/enums');

const e164Phone = Joi.string()
  .pattern(/^\+[1-9]\d{7,14}$/)
  .messages({ 'string.pattern.base': 'Phone number must be in E.164 format (e.g. +250788000000)' });

const password = Joi.string().min(8).max(128).messages({
  'string.min': 'Password must be at least 8 characters',
});

const registerSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  fullName: Joi.string().trim().min(2).max(100).required(),
  phoneNumber: e164Phone.required(),
  nationalId: Joi.string().trim().min(5).max(30).required(),
  businessType: Joi.string()
    .valid(...enumValues(BusinessType))
    .required(),
  password: password.required(),
  confirmPassword: Joi.valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
  }),
  acceptTerms: Joi.boolean().valid(true).required().messages({
    'any.only': 'You must accept the terms and conditions',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: password.required(),
  confirmPassword: Joi.valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
