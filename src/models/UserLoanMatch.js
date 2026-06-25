const mongoose = require('mongoose');

const userLoanMatchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoanProduct',
      required: [true, 'Product ID is required'],
      index: true,
    },
    matchPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    isEligible: {
      type: Boolean,
      default: false,
    },
    eligibilityReasons: {
      type: [String],
      default: [],
    },
    matchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userLoanMatchSchema.index({ userId: 1, productId: 1 }, { unique: true });
userLoanMatchSchema.index({ userId: 1, isEligible: 1, matchPercent: -1 });

const UserLoanMatch = mongoose.model('UserLoanMatch', userLoanMatchSchema);

module.exports = UserLoanMatch;
