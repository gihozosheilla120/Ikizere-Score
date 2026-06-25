const authRoutes = require('../modules/auth/auth.routes');
const businessProfileRoutes = require('../modules/business-profile/business-profile.routes');
const verificationRoutes = require('../modules/verification/verification.routes');
const financialRecordsRoutes = require('../modules/financial-records/financial-records.routes');
const scoreRoutes = require('../modules/score/score.routes');
const loanMarketplaceRoutes = require('../modules/loan-marketplace/loan-marketplace.routes');

module.exports = {
  auth: authRoutes,
  users: businessProfileRoutes,
  verification: verificationRoutes,
  records: financialRecordsRoutes,
  score: scoreRoutes,
  loans: loanMarketplaceRoutes,
};
