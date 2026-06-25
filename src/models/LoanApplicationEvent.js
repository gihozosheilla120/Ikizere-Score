const mongoose = require('mongoose');
const { LoanApplicationEventType, enumValues } = require('../constants/enums');

const loanApplicationEventSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoanApplication',
      required: [true, 'Application ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: {
        values: enumValues(LoanApplicationEventType),
        message: '{VALUE} is not a valid application event type',
      },
    },
    message: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Event message cannot exceed 500 characters'],
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    occurredAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

loanApplicationEventSchema.index({ applicationId: 1, occurredAt: 1 });

const LoanApplicationEvent = mongoose.model('LoanApplicationEvent', loanApplicationEventSchema);

module.exports = LoanApplicationEvent;
