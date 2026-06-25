const mongoose = require('mongoose');
const softDeletePlugin = require('./plugins/softDelete');
const {
  RecordType,
  RecordCategory,
  RECORD_CATEGORIES_BY_TYPE,
  PaymentMethod,
  Currency,
  enumValues,
} = require('../constants/enums');

const CATEGORY_LABELS = Object.freeze({
  [RecordCategory.RETAIL_SALES]: 'Retail Sales',
  [RecordCategory.CLIENT_PAYMENT]: 'Client Payment',
  [RecordCategory.SERVICE_INCOME]: 'Service Income',
  [RecordCategory.OTHER_INCOME]: 'Other Income',
  [RecordCategory.INVENTORY]: 'Inventory Restock',
  [RecordCategory.UTILITIES]: 'Electricity Bill',
  [RecordCategory.RENT]: 'Rent',
  [RecordCategory.SALARIES]: 'Salaries',
  [RecordCategory.LOAN_INSTALLMENT]: 'Loan Installment',
  [RecordCategory.OTHER_EXPENSE]: 'Other Expense',
  [RecordCategory.BUSINESS_SAVINGS]: 'Business Savings',
  [RecordCategory.EMERGENCY_FUND]: 'Emergency Fund',
  [RecordCategory.OTHER_SAVINGS]: 'Other Savings',
});

const financialRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Record type is required'],
      enum: {
        values: enumValues(RecordType),
        message: '{VALUE} is not a valid record type',
      },
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
      max: [999999999, 'Amount exceeds maximum allowed value'],
    },
    currency: {
      type: String,
      enum: {
        values: enumValues(Currency),
        message: '{VALUE} is not a supported currency',
      },
      default: Currency.RWF,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: enumValues(RecordCategory),
        message: '{VALUE} is not a valid record category',
      },
    },
    title: {
      type: String,
      default: null,
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Transaction date is required'],
    },
    paymentMethod: {
      type: String,
      enum: {
        values: enumValues(PaymentMethod),
        message: '{VALUE} is not a valid payment method',
      },
      default: PaymentMethod.MOBILE_MONEY,
    },
  },
  {
    timestamps: true,
  }
);

financialRecordSchema.plugin(softDeletePlugin);

financialRecordSchema.index({ userId: 1, date: -1 });
financialRecordSchema.index({ userId: 1, type: 1, date: -1 });
financialRecordSchema.index({ userId: 1, createdAt: -1 });

financialRecordSchema.path('category').validate(function validateCategoryForType(value) {
  const allowed = RECORD_CATEGORIES_BY_TYPE[this.type];
  if (!allowed) {
    return false;
  }
  return allowed.includes(value);
}, 'Category does not match the selected record type');

financialRecordSchema.pre('validate', function setTitleFromCategory(next) {
  if (!this.title && this.category) {
    this.title = CATEGORY_LABELS[this.category] || this.category;
  }
  next();
});

const FinancialRecord = mongoose.model('FinancialRecord', financialRecordSchema);

module.exports = FinancialRecord;
