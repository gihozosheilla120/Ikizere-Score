const authRoutes = require('../modules/auth/auth.routes');
const businessProfileRoutes = require('../modules/business-profile/business-profile.routes');

module.exports = {
  auth: authRoutes,
  users: businessProfileRoutes,
};
