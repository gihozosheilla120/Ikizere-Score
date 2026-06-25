const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');
const loanApplicationsService = require('./loan-applications.service');

const createApplication = asyncHandler(async (req, res) => {
  const application = await loanApplicationsService.createApplication(req.userId, req.body, {
    ipAddress: req.ip,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Loan application submitted successfully',
    data: { application },
  });
});

const listApplications = asyncHandler(async (req, res) => {
  const result = await loanApplicationsService.listApplications(req.userId, req.query);

  return sendSuccess(res, {
    message: 'Loan applications retrieved successfully',
    data: { applications: result.applications },
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
});

const getApplicationById = asyncHandler(async (req, res) => {
  const application = await loanApplicationsService.getApplicationById(
    req.userId,
    req.params.id
  );

  return sendSuccess(res, {
    message: 'Loan application retrieved successfully',
    data: { application },
  });
});

const getTimeline = asyncHandler(async (req, res) => {
  const timeline = await loanApplicationsService.getTimeline(req.userId, req.params.id);

  return sendSuccess(res, {
    message: 'Loan application timeline retrieved successfully',
    data: { timeline },
  });
});

const cancelApplication = asyncHandler(async (req, res) => {
  const application = await loanApplicationsService.cancelApplication(
    req.userId,
    req.params.id,
    { ipAddress: req.ip }
  );

  return sendSuccess(res, {
    message: 'Loan application cancelled successfully',
    data: { application },
  });
});

module.exports = {
  createApplication,
  listApplications,
  getApplicationById,
  getTimeline,
  cancelApplication,
};
