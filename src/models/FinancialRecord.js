const mongoose = require('mongoose');
const softDeletePlugin = require('./plugins/softDelete');
const { RecordType, Currency, RecordSource, enumValues } = require('../constants/enums');

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
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      lowercase: true,
      index: true,
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
      index: true,
    },
    transactionDate: {
      type: Date,
      required: [true, 'Transaction date is required'],
      index: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    source: {
      type: String,
      enum: {
        values: enumValues(RecordSource),
        message: '{VALUE} is not a valid source',
      },
      default: RecordSource.MANUAL,
    },
    receiptUrl: {
      type: String,
      default: null,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator(tags) {
          return tags.length <= 10;
        },
        message: 'A record cannot have more than 10 tags',
      },
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

financialRecordSchema.plugin(softDeletePlugin);

financialRecordSchema.index({ userId: 1, transactionDate: -1 });
financialRecordSchema.index({ userId: 1, type: 1, transactionDate: -1 });
financialRecordSchema.index({ userId: 1, category: 1, transactionDate: -1 });
financialRecordSchema.index({ userId: 1, currency: 1 });
financialRecordSchema.index({ userId: 1, createdAt: -1 });
financialRecordSchema.index({
  description: 'text',
  category: 'text',
  source: 'text',
  tags: 'text',
});

const FinancialRecord = mongoose.model('FinancialRecord', financialRecordSchema);

module.exports = FinancialRecord;
