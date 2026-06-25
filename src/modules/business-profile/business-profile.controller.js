const businessProfileService = require('./business-profile.service');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');

const getMyBusinessProfile = asyncHandler(async (req, res) => {
  const profile = await businessProfileService.getProfile(req.userId);

  return sendSuccess(res, {
    message: 'Business profile retrieved successfully',
    data: { profile },
  });
});

const updateMyBusinessProfile = asyncHandler(async (req, res) => {
  const profile = await businessProfileService.upsertProfile(req.userId, req.body, {
    ipAddress: req.ip,
  });

  return sendSuccess(res, {
    message: req.body.complete
      ? 'Business profile completed successfully'
      : 'Business profile saved successfully',
    data: { profile },
  });
});

module.exports = {
  getMyBusinessProfile,
  updateMyBusinessProfile,
};
