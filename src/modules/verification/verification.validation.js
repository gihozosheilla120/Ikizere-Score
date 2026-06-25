const Joi = require('joi');

const localUploadUrl = (userId) =>
  Joi.string()
    .pattern(new RegExp(`^/uploads/verification/${userId}/[\\w\\-\\.]+$`))
    .messages({ 'string.pattern.base': 'File URL must be a local upload path' });

const submitVerificationSchema = (userId) =>
  Joi.object({
    idFrontUrl: localUploadUrl(userId).required(),
    idBackUrl: localUploadUrl(userId).required(),
    businessRegistrationCertUrl: localUploadUrl(userId).required(),
    taxCertificateUrl: localUploadUrl(userId).required(),
    profilePhotoUrl: localUploadUrl(userId).optional().allow(null),
  });

const rejectVerificationSchema = Joi.object({
  reason: Joi.string().trim().min(3).max(500).required().messages({
    'string.min': 'Rejection reason must be at least 3 characters',
    'any.required': 'Rejection reason is required',
  }),
});

module.exports = {
  submitVerificationSchema,
  rejectVerificationSchema,
};

