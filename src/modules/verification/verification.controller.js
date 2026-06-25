const mongoose = require('mongoose');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');
const verificationService = require('./verification.service');
const ApiError = require('../../utils/ApiError');
const { submitVerificationSchema } = require('./verification.validation');

function parseTargetUserId(paramUserId) {
  if (!mongoose.Types.ObjectId.isValid(paramUserId)) {
    throw ApiError.badRequest('Invalid user ID');
  }
  return paramUserId;
}

const upload = asyncHandler(async (req, res) => {
  const uploaded = await verificationService.uploadFiles(req.userId, req.files, {
    ipAddress: req.ip,
  });

  return sendSuccess(res, {
    message: 'Files uploaded successfully',
    data: uploaded,
  });
});

const submit = asyncHandler(async (req, res, next) => {
  const schema = submitVerificationSchema(req.userId.toString());
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    return next(ApiError.badRequest('Validation failed', errors));
  }

  const verification = await verificationService.submitVerification(req.userId, value, {
    ipAddress: req.ip,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Verification submitted successfully',
    data: { verification },
  });
});

const status = asyncHandler(async (req, res) => {
  const data = await verificationService.getStatus(req.userId);

  return sendSuccess(res, {
    message: 'Verification status retrieved successfully',
    data,
  });
});

const details = asyncHandler(async (req, res) => {
  const verification = await verificationService.getDetails(req.userId);

  return sendSuccess(res, {
    message: 'Verification details retrieved successfully',
    data: { verification },
  });
});

const adminApprove = asyncHandler(async (req, res) => {
  const targetUserId = parseTargetUserId(req.params.userId);

  const verification = await verificationService.approve(targetUserId, {
    ipAddress: req.ip,
    adminUserId: req.userId,
  });

  return sendSuccess(res, {
    message: 'Verification approved successfully',
    data: { verification },
  });
});

const adminReject = asyncHandler(async (req, res) => {
  const targetUserId = parseTargetUserId(req.params.userId);

  const verification = await verificationService.reject(targetUserId, req.body.reason, {
    ipAddress: req.ip,
    adminUserId: req.userId,
  });

  return sendSuccess(res, {
    message: 'Verification rejected successfully',
    data: { verification },
  });
});

module.exports = {
  upload,
  submit,
  status,
  details,
  adminApprove,
  adminReject,
};

