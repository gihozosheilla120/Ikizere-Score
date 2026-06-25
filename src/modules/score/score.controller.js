const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');
const scoreService = require('./score.service');

const getSummary = asyncHandler(async (req, res) => {
  const summary = await scoreService.getSummary(req.userId);

  return sendSuccess(res, {
    message: 'Score summary retrieved successfully',
    data: summary,
  });
});

const getBreakdown = asyncHandler(async (req, res) => {
  const breakdown = await scoreService.getBreakdown(req.userId);

  return sendSuccess(res, {
    message: 'Score breakdown retrieved successfully',
    data: breakdown,
  });
});

const getHistory = asyncHandler(async (req, res) => {
  const result = await scoreService.getHistory(req.userId, req.query);

  return sendSuccess(res, {
    message: 'Score history retrieved successfully',
    data: { history: result.history },
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
});

module.exports = {
  getSummary,
  getBreakdown,
  getHistory,
};
