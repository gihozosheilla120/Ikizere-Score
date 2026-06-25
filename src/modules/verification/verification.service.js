const ApiError = require('../../utils/ApiError');
const verificationRepository = require('./verification.repository');
const localStorageService = require('../../services/storage/localStorageService');
const { AuditAction, VerificationStatus } = require('../../constants/enums');

class VerificationService {
  async uploadFiles(userId, files, meta = {}) {
    if (!files || Object.keys(files).length === 0) {
      throw ApiError.badRequest('No files uploaded');
    }

    const result = {};

    const mapOne = async (fieldName, targetKey) => {
      const file = files[fieldName]?.[0];
      if (!file) return;
      const { url } = await localStorageService.saveUploadedFile({
        file,
        userId: userId.toString(),
        purpose: 'verification',
      });
      result[targetKey] = url;
    };

    await Promise.all([
      mapOne('nationalIdFront', 'idFrontUrl'),
      mapOne('nationalIdBack', 'idBackUrl'),
      mapOne('businessRegistrationCertificate', 'businessRegistrationCertUrl'),
      mapOne('taxCertificate', 'taxCertificateUrl'),
      mapOne('profilePhoto', 'profilePhotoUrl'),
    ]);

    await verificationRepository.createAuditLog({
      userId,
      action: AuditAction.VERIFICATION_FILES_UPLOADED,
      entityType: 'verification',
      entityId: null,
      metadata: { fields: Object.keys(result) },
      ipAddress: meta.ipAddress || null,
    });

    return result;
  }

  async submitVerification(userId, payload, meta = {}) {
    const verification = await verificationRepository.upsertByUserId(userId, {
      ...payload,
      status: VerificationStatus.PENDING,
      rejectionReason: null,
    });

    await verificationRepository.createAuditLog({
      userId,
      action: AuditAction.VERIFICATION_SUBMITTED,
      entityType: 'verification',
      entityId: verification._id,
      metadata: {
        submittedAt: new Date().toISOString(),
      },
      ipAddress: meta.ipAddress || null,
    });

    return verification;
  }

  async getStatus(userId) {
    const verification = await verificationRepository.findByUserId(userId);
    if (!verification) {
      throw ApiError.notFound('Verification record not found');
    }

    return {
      status: verification.status,
      submittedAt: verification.submittedAt,
      reviewedAt: verification.reviewedAt,
      rejectionReason: verification.rejectionReason,
      estimatedReviewHours: verification.estimatedReviewHours,
    };
  }

  async getDetails(userId) {
    const verification = await verificationRepository.findByUserId(userId);
    if (!verification) {
      throw ApiError.notFound('Verification record not found');
    }
    return verification;
  }

  assertCanReview(verification) {
    const reviewable = [VerificationStatus.PENDING, VerificationStatus.UNDER_REVIEW];
    if (!reviewable.includes(verification.status)) {
      throw ApiError.badRequest(
        `Verification cannot be reviewed while status is '${verification.status}'`
      );
    }
  }

  async approve(userId, meta = {}) {
    const verification = await verificationRepository.findByUserId(userId);
    if (!verification) {
      throw ApiError.notFound('Verification record not found');
    }

    this.assertCanReview(verification);

    verification.status = VerificationStatus.APPROVED;
    verification.rejectionReason = null;
    await verification.save();

    await verificationRepository.setUserVerified(userId);

    await verificationRepository.createAuditLog({
      userId,
      action: AuditAction.VERIFICATION_APPROVED,
      entityType: 'verification',
      entityId: verification._id,
      metadata: {
        adminUserId: meta.adminUserId || null,
      },
      ipAddress: meta.ipAddress || null,
    });

    return verification;
  }

  async reject(userId, reason, meta = {}) {
    const verification = await verificationRepository.findByUserId(userId);
    if (!verification) {
      throw ApiError.notFound('Verification record not found');
    }

    this.assertCanReview(verification);

    verification.status = VerificationStatus.REJECTED;
    verification.rejectionReason = reason;
    await verification.save();

    await verificationRepository.setUserRejected(userId);

    await verificationRepository.createAuditLog({
      userId,
      action: AuditAction.VERIFICATION_REJECTED,
      entityType: 'verification',
      entityId: verification._id,
      metadata: {
        reason,
        adminUserId: meta.adminUserId || null,
      },
      ipAddress: meta.ipAddress || null,
    });

    return verification;
  }
}

module.exports = new VerificationService();

