const User = require('../../models/User');
const Score = require('../../models/Score');

const AUTH_FIELDS =
  '+passwordHash +refreshTokenHash +passwordResetToken +passwordResetExpires';

class AuthRepository {
  findByEmail(email) {
    return User.findByEmail(email);
  }

  findByPhone(phoneNumber) {
    return User.findByPhone(phoneNumber);
  }

  findByNationalId(nationalId) {
    return User.findOne({ nationalId: nationalId.trim() });
  }

  findById(id) {
    return User.findById(id);
  }

  findByIdWithAuthFields(id) {
    return User.findById(id).select(AUTH_FIELDS);
  }

  findByEmailWithAuthFields(email) {
    return User.findOne({ email: email.toLowerCase().trim() }).select(AUTH_FIELDS);
  }

  async createUser(userData) {
    const user = new User(userData);
    await user.save();
    return user;
  }

  async createScoreForUser(userId) {
    return Score.create({ userId });
  }

  async updateRefreshTokenHash(userId, refreshTokenHash) {
    return User.findByIdAndUpdate(
      userId,
      { refreshTokenHash },
      { new: true, runValidators: false }
    );
  }

  async clearRefreshTokenHash(userId) {
    return User.findByIdAndUpdate(
      userId,
      { refreshTokenHash: null },
      { new: true, runValidators: false }
    );
  }

  async setPasswordResetToken(userId, passwordResetToken, passwordResetExpires) {
    return User.findByIdAndUpdate(
      userId,
      { passwordResetToken, passwordResetExpires },
      { new: true, runValidators: false }
    ).select(AUTH_FIELDS);
  }

  findByPasswordResetTokenHash(tokenHash) {
    return User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    }).select(AUTH_FIELDS);
  }

  async updatePassword(userId, password) {
    const user = await User.findById(userId).select(AUTH_FIELDS);

    if (!user) {
      return null;
    }

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.refreshTokenHash = null;
    await user.save();

    return user;
  }

  async updateLastLogin(userId, location = null) {
    return User.findByIdAndUpdate(
      userId,
      {
        lastLoginAt: new Date(),
        ...(location && { lastLoginLocation: location }),
      },
      { new: true, runValidators: false }
    );
  }
}

module.exports = new AuthRepository();
