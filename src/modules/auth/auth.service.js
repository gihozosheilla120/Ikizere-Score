const authRepository = require('./auth.repository');
const ApiError = require('../../utils/ApiError');
const env = require('../../config/env');
const {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  generateRandomToken,
  verifyRefreshToken,
} = require('../../utils/tokenUtils');
const { AccountStatus } = require('../../constants/enums');

class AuthService {
  buildTokenPayload(user) {
    return {
      sub: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    };
  }

  async issueTokenPair(user) {
    const payload = this.buildTokenPayload(user);
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await authRepository.updateRefreshTokenHash(user._id, hashToken(refreshToken));

    return { accessToken, refreshToken };
  }

  formatUserResponse(user) {
    return user.toPublicJSON ? user.toPublicJSON() : user.toJSON();
  }

  async register(data) {
    const email = data.email.toLowerCase().trim();

    const [existingEmail, existingPhone, existingNationalId] = await Promise.all([
      authRepository.findByEmail(email),
      authRepository.findByPhone(data.phoneNumber),
      authRepository.findByNationalId(data.nationalId),
    ]);

    if (existingEmail) {
      throw ApiError.conflict('Email is already registered');
    }
    if (existingPhone) {
      throw ApiError.conflict('Phone number is already registered');
    }
    if (existingNationalId) {
      throw ApiError.conflict('National ID is already registered');
    }

    const user = await authRepository.createUser({
      email,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      nationalId: data.nationalId,
      businessType: data.businessType,
      password: data.password,
      termsAcceptedAt: new Date(),
      accountStatus: AccountStatus.REGISTERED,
    });

    await authRepository.createScoreForUser(user._id);

    const tokens = await this.issueTokenPair(user);

    return {
      user: this.formatUserResponse(user),
      tokens,
    };
  }

  async login({ email, password }, meta = {}) {
    const user = await authRepository.findByEmailWithAuthFields(email);

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    await authRepository.updateLastLogin(user._id, meta.location || null);

    const tokens = await this.issueTokenPair(user);

    const publicUser = await authRepository.findById(user._id);

    return {
      user: this.formatUserResponse(publicUser),
      tokens,
    };
  }

  async logout(userId) {
    await authRepository.clearRefreshTokenHash(userId);
    return { message: 'Logged out successfully' };
  }

  async refreshToken(refreshToken) {
    let decoded;

    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await authRepository.findByIdWithAuthFields(decoded.sub);

    if (!user || !user.refreshTokenHash) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    const tokenHash = hashToken(refreshToken);

    if (user.refreshTokenHash !== tokenHash) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    const tokens = await this.issueTokenPair(user);
    const publicUser = await authRepository.findById(user._id);

    return {
      user: this.formatUserResponse(publicUser),
      tokens,
    };
  }

  async forgotPassword({ email }) {
    const user = await authRepository.findByEmail(email);

    const response = {
      message: 'If an account exists with this email, a password reset link has been sent',
    };

    if (!user) {
      return response;
    }

    const resetToken = generateRandomToken(32);
    const tokenHash = hashToken(resetToken);
    const expiresAt = new Date(Date.now() + env.passwordResetExpiresIn);

    await authRepository.setPasswordResetToken(user._id, tokenHash, expiresAt);

    if (env.isDevelopment) {
      response.resetToken = resetToken;
      console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);
    }

    return response;
  }

  async resetPassword({ token, password }) {
    const tokenHash = hashToken(token);
    const user = await authRepository.findByPasswordResetTokenHash(tokenHash);

    if (!user) {
      throw ApiError.badRequest('Invalid or expired password reset token');
    }

    await authRepository.updatePassword(user._id, password);

    const publicUser = await authRepository.findById(user._id);
    const tokens = await this.issueTokenPair(publicUser);

    return {
      message: 'Password reset successfully',
      user: this.formatUserResponse(publicUser),
      tokens,
    };
  }
}

module.exports = new AuthService();
