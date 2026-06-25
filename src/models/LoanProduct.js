const mongoose = require('mongoose');
const softDeletePlugin = require('./plugins/softDelete');
const { Currency, enumValues } = require('../constants/enums');

const eligibilityRulesSchema = new mongoose.Schema(
  {
    minLoanReadinessPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    requiresVerification: {
      type: Boolean,
      default: false,
    },
    minLoanReadinessRating: {
      type: String,
      default: null,
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Eligibility notes cannot exceed 500 characters'],
    },
  },
  { _id: false }
);

const loanProductSchema = new mongoose.Schema(
  {
    lenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lender',
      required: [true, 'Lender ID is required'],
      index: true,
    },
    lenderName: {
      type: String,
      required: [true, 'Lender name is required'],
      trim: true,
      maxlength: [150, 'Lender name cannot exceed 150 characters'],
    },
    productName: {
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
    minimumScore: {
      type: Number,
      default: 400,
      min: [300, 'Minimum score cannot be below 300'],
      max: [850, 'Minimum score cannot exceed 850'],
    },
    minimumRevenue: {
      type: Number,
      default: 0,
      min: [0, 'Minimum revenue cannot be negative'],
    },
    interestRate: {
      type: Number,
      required: [true, 'Interest rate is required'],
      min: [0, 'Interest rate cannot be negative'],
      max: [100, 'Interest rate cannot exceed 100%'],
    },
    minAmount: {
      type: Number,
      default: 50000,
      min: [1, 'Minimum amount must be positive'],
    },
    maxAmount: {
      type: Number,
      required: [true, 'Maximum amount is required'],
      min: [1, 'Maximum amount must be positive'],
    },
    termMonths: {
      type: Number,
      required: [true, 'Term in months is required'],
      min: [1, 'Term must be at least 1 month'],
    },
    currency: {
      type: String,
      enum: {
        values: enumValues(Currency),
        message: '{VALUE} is not a supported currency',
      },
      default: Currency.RWF,
    },
    eligibilityRules: {
      type: eligibilityRulesSchema,
      default: () => ({}),
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
loanProductSchema.index({ lenderName: 'text', productName: 'text' });

loanProductSchema.pre('validate', function validateAmountRange(next) {
  if (this.minAmount != null && this.maxAmount != null && this.minAmount > this.maxAmount) {
    this.invalidate('minAmount', 'Minimum amount cannot exceed maximum amount');
  }
  next();
});

const LoanProduct = mongoose.model('LoanProduct', loanProductSchema);

module.exports = LoanProduct;
