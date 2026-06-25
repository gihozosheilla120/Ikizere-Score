const ApiError = require('../utils/ApiError');
const { UserRole } = require('../constants/enums');

function authorizeAdmin(req, res, next) {
  if (!req.user || req.user.role !== UserRole.ADMIN) {
    return next(ApiError.forbidden('Admin access required'));
  }
  return next();
}

module.exports = authorizeAdmin;
