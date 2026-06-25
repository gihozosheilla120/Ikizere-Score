const mongoose = require('mongoose');
const softDeletePlugin = require('./plugins/softDelete');
const {
  InterestRateType,
  LoanProductTag,
  enumValues,
} = require('../constants/enums');

const lenderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lender name is required'],
      trim: true,
      maxlength: [150, 'Lender name cannot exceed 150 characters'],
    },
    logoUrl: {
      type: String,
      default: null,
    },
    verified: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const loanProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    lender: {
      type: lenderSchema,
      required: [true, 'Lender information is required'],
    },
    maxAmount: {
      type: Number,
      required: [true, 'Maximum amount is required'],
      min: [1, 'Maximum amount must be positive'],
    },
    minAmount: {
      type: Number,
      default: 50000,
      min: [1, 'Minimum amount must be positive'],
    },
    interestRate: {
      type: Number,
      required: [true, 'Interest rate is required'],
      min: [0, 'Interest rate cannot be negative'],
      max: [100, 'Interest rate cannot exceed 100%'],
    },
    interestRateType: {
      type: String,
      enum: {
        values: enumValues(InterestRateType),
        message: '{VALUE} is not a valid interest rate type',
      },
      default: InterestRateType.FIXED,
    },
    maxTermMonths: {
      type: Number,
      required: [true, 'Maximum term is required'],
      min: [1, 'Maximum term must be at least 1 month'],
    },
    minTermMonths: {
      type: Number,
      default: 3,
      min: [1, 'Minimum term must be at least 1 month'],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator(tags) {
          const allowed = enumValues(LoanProductTag);
          return tags.every((tag) => allowed.includes(tag));
        },
        message: 'One or more tags are invalid',
      },
    },
    minScore: {
      type: Number,
      default: 400,
      min: [300, 'Minimum score cannot be below 300'],
      max: [850, 'Minimum score cannot exceed 850'],
    },
    processingFee: {
      type: Number,
      default: 5000,
      min: [0, 'Processing fee cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

loanProductSchema.plugin(softDeletePlugin);

loanProductSchema.index({ isActive: 1, maxAmount: -1 });
loanProductSchema.index({ name: 'text', 'lender.name': 'text' });

loanProductSchema.pre('validate', function validateAmountRange(next) {
  if (this.minAmount != null && this.maxAmount != null && this.minAmount > this.maxAmount) {
    this.invalidate('minAmount', 'Minimum amount cannot exceed maximum amount');
  }

  if (
    this.minTermMonths != null &&
    this.maxTermMonths != null &&
    this.minTermMonths > this.maxTermMonths
  ) {
    this.invalidate('minTermMonths', 'Minimum term cannot exceed maximum term');
  }

  next();
});

const LoanProduct = mongoose.model('LoanProduct', loanProductSchema);

module.exports = LoanProduct;
