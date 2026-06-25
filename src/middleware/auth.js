const { verifyAccessToken } = require('../utils/tokenUtils');
const ApiError = require('../utils/ApiError');
const authRepository = require('../modules/auth/auth.repository');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token is required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await authRepository.findById(decoded.sub);

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Invalid or expired access token'));
    }
    return next(error);
  }
}

module.exports = authenticate;
