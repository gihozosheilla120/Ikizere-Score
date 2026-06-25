const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');
const loanMarketplaceService = require('./loan-marketplace.service');

const getMarketplace = asyncHandler(async (req, res) => {
  const result = await loanMarketplaceService.getMarketplace(req.userId, req.query);

  return sendSuccess(res, {
    message: 'Loan marketplace retrieved successfully',
    data: {
      products: result.products,
      userContext: result.userContext,
    },
    meta: {
      total: result.products.length,
    },
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await loanMarketplaceService.getProductById(req.userId, req.params.id, req.query);

  return sendSuccess(res, {
    message: 'Loan product retrieved successfully',
    data: { product },
  });
});

const getEligibleProducts = asyncHandler(async (req, res) => {
  const result = await loanMarketplaceService.getEligibleProducts(req.userId, req.query);

  return sendSuccess(res, {
    message: 'Eligible loan products retrieved successfully',
    data: {
      products: result.products,
      userContext: result.userContext,
    },
    meta: {
      total: result.products.length,
    },
  });
});

module.exports = {
  getMarketplace,
  getProductById,
  getEligibleProducts,
};
