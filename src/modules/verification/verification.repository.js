const Verification = require('../../models/Verification');
const User = require('../../models/User');
const AuditLog = require('../../models/AuditLog');
const { TrustTier, AccountStatus } = require('../../constants/enums');

class VerificationRepository {
  findByUserId(userId) {
    return Verification.findOne({ userId });
  }

  upsertByUserId(userId, update) {
    return Verification.findOneAndUpdate(
      { userId },
      { $set: { userId, ...update } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
  }

  updateStatusByUserId(userId, { status, rejectionReason = null }) {
    return Verification.findOneAndUpdate(
      { userId },
      { $set: { status, rejectionReason } },
      { new: true, runValidators: true }
    );
  }

  setUserVerified(userId) {
    return User.findByIdAndUpdate(
      userId,
      {
        nationalIdVerified: true,
        accountStatus: AccountStatus.VERIFIED,
        trustTier: TrustTier.SILVER,
      },
      { new: true, runValidators: true }
    );
  }

  setUserRejected(userId) {
    return User.findByIdAndUpdate(
      userId,
      {
        accountStatus: AccountStatus.VERIFICATION_REJECTED,
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

module.exports = new VerificationRepository();

