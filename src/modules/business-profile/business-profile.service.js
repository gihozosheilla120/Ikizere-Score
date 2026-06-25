const businessProfileRepository = require('./business-profile.repository');
const ApiError = require('../../utils/ApiError');
const { AuditAction, BusinessProfileStatus } = require('../../constants/enums');

class BusinessProfileService {
  formatProfile(profile) {
    if (!profile) {
      return null;
    }

    const json = profile.toJSON();
    json.isCompleted = profile.isCompleted;
    return json;
  }

  async getProfile(userId) {
    const profile = await businessProfileRepository.findByUserId(userId);

    if (!profile) {
      throw ApiError.notFound('Business profile not found');
    }

    return this.formatProfile(profile);
  }

  async upsertProfile(userId, payload, meta = {}) {
    const { complete, ...fields } = payload;

    const normalizedFields = { ...fields };

    if (normalizedFields.registrationNumber === '') {
      normalizedFields.registrationNumber = null;
    }
    if (normalizedFields.businessAddress === '') {
      normalizedFields.businessAddress = null;
    }
    if (normalizedFields.description === '') {
      normalizedFields.description = null;
    }

    const existingProfile = await businessProfileRepository.findByUserId(userId);
    const wasCompleted = existingProfile?.status === BusinessProfileStatus.COMPLETED;

    if (wasCompleted && complete) {
      throw ApiError.badRequest('Business profile is already completed');
    }

    let profile = await businessProfileRepository.upsertByUserId(userId, {
      ...normalizedFields,
      status: BusinessProfileStatus.DRAFT,
    });

    const isNew = !existingProfile;
    const auditAction = isNew
      ? AuditAction.BUSINESS_PROFILE_CREATED
      : AuditAction.BUSINESS_PROFILE_UPDATED;

    await businessProfileRepository.createAuditLog({
      userId,
      action: auditAction,
      entityType: 'business_profile',
      entityId: profile._id,
      metadata: { fields: Object.keys(normalizedFields) },
      ipAddress: meta.ipAddress || null,
    });

    if (complete) {
      profile = await this.completeProfile(userId, profile, meta);
    }

    return this.formatProfile(profile);
  }

  async completeProfile(userId, profile, meta = {}) {
    const missingFields = profile.getMissingCompletionFields();

    if (missingFields.length > 0) {
      throw ApiError.badRequest(
        'Business profile is incomplete',
        missingFields.map((field) => ({
          field,
          message: `${field} is required to complete the profile`,
        }))
      );
    }

    profile.status = BusinessProfileStatus.COMPLETED;
    profile.completedAt = new Date();
    await profile.save();

    await businessProfileRepository.markUserOnboardingCompleted(userId, {
      district: profile.district,
      businessType: profile.businessType,
    });

    await businessProfileRepository.createAuditLog({
      userId,
      action: AuditAction.BUSINESS_PROFILE_COMPLETED,
      entityType: 'business_profile',
      entityId: profile._id,
      metadata: {
        businessName: profile.businessName,
        district: profile.district,
        sector: profile.sector,
        country: profile.country,
      },
      ipAddress: meta.ipAddress || null,
    });

    return profile;
  }
}

module.exports = new BusinessProfileService();
