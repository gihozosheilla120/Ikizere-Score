const mongoose = require('mongoose');
const softDeletePlugin = require('./plugins/softDelete');
const { LoanPurpose, LoanApplicationStatus, enumValues } = require('../constants/enums');

const readinessSnapshotSchema = new mongoose.Schema(
  {
    percent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    rating: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const loanApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    loanProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoanProduct',
      required: [true, 'Loan product ID is required'],
      index: true,
    },
    requestedAmount: {
      type: Number,
      required: [true, 'Requested amount is required'],
      min: [1, 'Requested amount must be positive'],
    },
    requestedTermMonths: {
      type: Number,
      required: [true, 'Requested term is required'],
      min: [1, 'Requested term must be at least 1 month'],
    },
    purpose: {
      type: String,
      required: [true, 'Loan purpose is required'],
      enum: {
        values: enumValues(LoanPurpose),
        message: '{VALUE} is not a valid loan purpose',
      },
    },
    monthlyRevenueSnapshot: {
      type: Number,
      required: [true, 'Monthly revenue snapshot is required'],
      min: [0, 'Monthly revenue cannot be negative'],
    },
    ikizereScoreSnapshot: {
      type: Number,
      required: [true, 'Ikizere score snapshot is required'],
      min: [300, 'Score snapshot cannot be below 300'],
      max: [850, 'Score snapshot cannot exceed 850'],
    },
    readinessSnapshot: {
      type: readinessSnapshotSchema,
      required: [true, 'Readiness snapshot is required'],
    },
    status: {
      type: String,
      enum: {
        values: enumValues(LoanApplicationStatus),
        message: '{VALUE} is not a valid application status',
      },
      default: LoanApplicationStatus.SUBMITTED,
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
  },
  {
    timestamps: true,
  }
);

loanApplicationSchema.plugin(softDeletePlugin);

loanApplicationSchema.index({ userId: 1, submittedAt: -1 });
loanApplicationSchema.index({ userId: 1, status: 1 });
loanApplicationSchema.index({ status: 1 });

const LoanApplication = mongoose.model('LoanApplication', loanApplicationSchema);

module.exports = LoanApplication;
