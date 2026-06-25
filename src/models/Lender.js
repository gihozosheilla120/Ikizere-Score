const mongoose = require('mongoose');
const softDeletePlugin = require('./plugins/softDelete');

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
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    verified: {
      type: Boolean,
      default: true,
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

lenderSchema.plugin(softDeletePlugin);

lenderSchema.index({ name: 'text' });

const Lender = mongoose.model('Lender', lenderSchema);

module.exports = Lender;
