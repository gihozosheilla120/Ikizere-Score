const mongoose = require('mongoose');
const softDeletePlugin = require('./plugins/softDelete');
const {
  BusinessType,
  Industry,
  YearsInOperation,
  BusinessProfileStatus,
  enumValues,
} = require('../constants/enums');

const businessProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    businessName: {
      type: String,
      default: null,
      trim: true,
      maxlength: [150, 'Business name cannot exceed 150 characters'],
    },
    businessType: {
      type: String,
      enum: {
        values: enumValues(BusinessType),
        message: '{VALUE} is not a valid business type',
      },
      default: null,
    },
    industry: {
      type: String,
      enum: {
        values: enumValues(Industry),
        message: '{VALUE} is not a valid industry',
      },
      default: null,
    },
    registrationNumber: {
      type: String,
      default: null,
      trim: true,
      maxlength: [50, 'Registration number cannot exceed 50 characters'],
    },
    yearsInOperation: {
      type: String,
      enum: {
        values: enumValues(YearsInOperation),
        message: '{VALUE} is not a valid years-in-operation value',
      },
      default: null,
    },
    employeeCount: {
      type: Number,
      default: null,
      min: [0, 'Employee count cannot be negative'],
      max: [100000, 'Employee count cannot exceed 100,000'],
    },
    monthlyRevenue: {
      type: Number,
      default: null,
      min: [0, 'Monthly revenue cannot be negative'],
    },
    district: {
      type: String,
      default: null,
      trim: true,
      maxlength: [100, 'District cannot exceed 100 characters'],
    },
    sector: {
      type: String,
      default: null,
      trim: true,
      maxlength: [100, 'Sector cannot exceed 100 characters'],
    },
    country: {
      type: String,
      default: 'Rwanda',
      trim: true,
      maxlength: [100, 'Country cannot exceed 100 characters'],
    },
    businessAddress: {
      type: String,
      default: null,
      trim: true,
      maxlength: [300, 'Business address cannot exceed 300 characters'],
    },
    description: {
      type: String,
      default: null,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: enumValues(BusinessProfileStatus),
        message: '{VALUE} is not a valid business profile status',
      },
      default: BusinessProfileStatus.DRAFT,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

businessProfileSchema.virtual('isCompleted').get(function isCompleted() {
  return this.status === BusinessProfileStatus.COMPLETED;
});

businessProfileSchema.plugin(softDeletePlugin);

businessProfileSchema.index(
  { userId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: { $ne: true } } }
);
businessProfileSchema.index({ district: 1, sector: 1 });
businessProfileSchema.index({ businessType: 1, industry: 1 });
businessProfileSchema.index({ status: 1 });

businessProfileSchema.statics.getCompletionRequiredFields = function getCompletionRequiredFields() {
  return [
    'businessName',
    'businessType',
    'industry',
    'yearsInOperation',
    'employeeCount',
    'monthlyRevenue',
    'district',
    'sector',
    'country',
  ];
};

businessProfileSchema.methods.getMissingCompletionFields = function getMissingCompletionFields() {
  const required = this.constructor.getCompletionRequiredFields();
  return required.filter((field) => {
    const value = this[field];
    return value === null || value === undefined || value === '';
  });
};

const BusinessProfile = mongoose.model('BusinessProfile', businessProfileSchema);

module.exports = BusinessProfile;
