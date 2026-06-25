const mongoose = require('mongoose');
const { RecordType, enumValues } = require('../constants/enums');

const recordCategorySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
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
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    icon: {
      type: String,
      default: null,
      trim: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
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

recordCategorySchema.index({ type: 1, sortOrder: 1 });
recordCategorySchema.index({ slug: 1 }, { unique: true });

const RecordCategoryModel = mongoose.model('RecordCategory', recordCategorySchema);

module.exports = RecordCategoryModel;
