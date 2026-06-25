const express = require('express');
const authenticate = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const loanMarketplaceController = require('./loan-marketplace.controller');
const { marketplaceQuerySchema } = require('./loan-marketplace.validation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: Loan marketplace and eligibility matching
 */

router.use(authenticate);

router.get(
  '/marketplace',
  validate(marketplaceQuerySchema, 'query'),
  loanMarketplaceController.getMarketplace
);

router.get(
  '/eligible-products',
  validate(marketplaceQuerySchema, 'query'),
  loanMarketplaceController.getEligibleProducts
);

router.get(
  '/marketplace/:id',
  validate(marketplaceQuerySchema, 'query'),
  loanMarketplaceController.getProductById
);

module.exports = router;
