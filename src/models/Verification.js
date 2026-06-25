const mongoose = require('mongoose');
const { VerificationStatus, enumValues } = require('../constants/enums');

const verificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    idFrontUrl: {
      type: String,
      default: null,
    },
    idBackUrl: {
      type: String,
      default: null,
    },
    tradeLicenseUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: enumValues(VerificationStatus),
        message: '{VALUE} is not a valid verification status',
      },
      default: VerificationStatus.NOT_STARTED,
    },
    rejectionReason: {
      type: String,
      default: null,
      trim: true,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    estimatedReviewHours: {
      type: Number,
      default: 24,
      min: [1, 'Estimated review hours must be at least 1'],
    },
  },
  {
    timestamps: true,
  }
);

verificationSchema.index({ userId: 1 }, { unique: true });
verificationSchema.index({ status: 1 });

verificationSchema.pre('save', function setSubmissionTimestamp(next) {
  if (
    this.isModified('status') &&
    [VerificationStatus.PENDING, VerificationStatus.UNDER_REVIEW].includes(this.status) &&
    !this.submittedAt
  ) {
    this.submittedAt = new Date();
  }

  if (
    this.isModified('status') &&
    [VerificationStatus.APPROVED, VerificationStatus.REJECTED].includes(this.status) &&
    !this.reviewedAt
  ) {
    this.reviewedAt = new Date();
  }

  if (this.status === VerificationStatus.REJECTED && !this.rejectionReason) {
    return next(new Error('Rejection reason is required when status is rejected'));
  }

  next();
});

const Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification;
