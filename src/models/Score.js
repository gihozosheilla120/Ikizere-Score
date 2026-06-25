const mongoose = require('mongoose');
const {
  ScoreRating,
  LoanReadinessRating,
  enumValues,
} = require('../constants/enums');

const breakdownSchema = new mongoose.Schema(
  {
    savingsBehaviour: {
      type: Number,
      default: 0,
      min: [0, 'Factor score cannot be negative'],
      max: [100, 'Factor score cannot exceed 100'],
    },
    incomeStability: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    paymentConsistency: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    businessActivity: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    creditHistory: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { _id: false }
);

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    currentScore: {
      type: Number,
      default: 300,
      min: [300, 'Score cannot be below 300'],
      max: [850, 'Score cannot exceed 850'],
    },
    previousScore: {
      type: Number,
      default: 300,
      min: 300,
      max: 850,
    },
    rating: {
      type: String,
      enum: {
        values: enumValues(ScoreRating),
        message: '{VALUE} is not a valid score rating',
      },
      default: ScoreRating.FAIR,
    },
    monthlyChange: {
      type: Number,
      default: 0,
    },
    changeReason: {
      type: String,
      default: '',
      trim: true,
      maxlength: [200, 'Change reason cannot exceed 200 characters'],
    },
    loanReadinessPercent: {
      type: Number,
      default: 0,
      min: [0, 'Loan readiness cannot be negative'],
      max: [100, 'Loan readiness cannot exceed 100'],
    },
    loanReadinessRating: {
      type: String,
      enum: {
        values: enumValues(LoanReadinessRating),
        message: '{VALUE} is not a valid loan readiness rating',
      },
      default: LoanReadinessRating.NOT_ELIGIBLE,
    },
    percentileRank: {
      type: Number,
      default: null,
      min: [0, 'Percentile rank cannot be negative'],
      max: [100, 'Percentile rank cannot exceed 100'],
    },
    breakdown: {
      type: breakdownSchema,
      default: () => ({}),
    },
    lastCalculatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

scoreSchema.index({ userId: 1 }, { unique: true });
scoreSchema.index({ currentScore: -1 });

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
