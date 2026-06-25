const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');
const financialRecordsService = require('./financial-records.service');

const createRecord = asyncHandler(async (req, res) => {
  const record = await financialRecordsService.createRecord(req.userId, req.body, {
    ipAddress: req.ip,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Financial record created successfully',
    data: { record },
  });
});

const listRecords = asyncHandler(async (req, res) => {
  const result = await financialRecordsService.listRecords(req.userId, req.query);

  return sendSuccess(res, {
    message: 'Financial records retrieved successfully',
    data: { records: result.records },
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
});

const getRecordById = asyncHandler(async (req, res) => {
  const record = await financialRecordsService.getRecordById(req.userId, req.params.id);

  return sendSuccess(res, {
    message: 'Financial record retrieved successfully',
    data: { record },
  });
});

const updateRecord = asyncHandler(async (req, res) => {
  const record = await financialRecordsService.updateRecord(
    req.userId,
    req.params.id,
    req.body,
    { ipAddress: req.ip }
  );

  return sendSuccess(res, {
    message: 'Financial record updated successfully',
    data: { record },
  });
});

const deleteRecord = asyncHandler(async (req, res) => {
  await financialRecordsService.deleteRecord(req.userId, req.params.id, {
    ipAddress: req.ip,
  });

  return sendSuccess(res, {
    message: 'Financial record deleted successfully',
  });
});

const getMonthlyInsights = asyncHandler(async (req, res) => {
  const insights = await financialRecordsService.getMonthlyInsights(req.userId, req.query);

  return sendSuccess(res, {
    message: 'Monthly insights retrieved successfully',
    data: insights,
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await financialRecordsService.getCategories(req.query);

  return sendSuccess(res, {
    message: 'Record categories retrieved successfully',
    data: { categories },
  });
});

module.exports = {
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  getMonthlyInsights,
  getCategories,
};
