const express = require('express');
const loanMarketplaceRoutes = require('../modules/loan-marketplace/loan-marketplace.routes');
const loanApplicationsRoutes = require('../modules/loan-applications/loan-applications.routes');

const router = express.Router();

router.use(loanMarketplaceRoutes);
router.use(loanApplicationsRoutes);

module.exports = router;
