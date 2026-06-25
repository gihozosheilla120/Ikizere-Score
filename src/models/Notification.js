const mongoose = require('mongoose');
const softDeletePlugin = require('./plugins/softDelete');
const { NotificationType, enumValues } = require('../constants/enums');

const notificationMetadataSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoanApplication',
      default: null,
    },
    referenceId: {
      type: String,
      default: null,
      trim: true,
    },
    scoreDelta: {
      type: Number,
      default: null,
    },
  },
  { _id: false }
);

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Notification type is required'],
      enum: {
        values: enumValues(NotificationType),
        message: '{VALUE} is not a valid notification type',
      },
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: {
      type: notificationMetadataSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.plugin(softDeletePlugin);

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
