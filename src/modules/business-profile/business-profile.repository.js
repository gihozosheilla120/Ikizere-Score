const BusinessProfile = require('../../models/BusinessProfile');
const AuditLog = require('../../models/AuditLog');
const User = require('../../models/User');

class BusinessProfileRepository {
  findByUserId(userId) {
    return BusinessProfile.findOne({ userId });
  }

  async upsertByUserId(userId, data) {
    return BusinessProfile.findOneAndUpdate(
      { userId },
      { $set: { userId, ...data } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
  }

  async markUserOnboardingCompleted(userId, { district, businessType }) {
    return User.findByIdAndUpdate(
      userId,
      {
        onboardingCompleted: true,
        district,
        businessType,
      },
      { new: true, runValidators: true }
    );
  }

  createAuditLog({ userId, action, entityType, entityId, metadata, ipAddress }) {
    return AuditLog.create({
      userId,
      action,
      entityType,
      entityId,
      metadata,
      ipAddress,
    });
  }
}

module.exports = new BusinessProfileRepository();
