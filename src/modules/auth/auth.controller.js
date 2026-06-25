const authService = require('./auth.service');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Account created successfully',
    data: result,
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body, {
    location: req.headers['x-client-location'] || null,
  });

  return sendSuccess(res, {
    message: 'Login successful',
    data: result,
  });
});

const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.userId);

  return sendSuccess(res, {
    message: result.message,
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refreshToken(req.body.refreshToken);

  return sendSuccess(res, {
    message: 'Token refreshed successfully',
    data: result,
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body);

  return sendSuccess(res, {
    message: result.message,
    ...(result.resetToken && { data: { resetToken: result.resetToken } }),
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);

  return sendSuccess(res, {
    message: result.message,
    data: {
      user: result.user,
      tokens: result.tokens,
    },
  });
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
};
