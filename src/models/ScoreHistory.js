const mongoose = require('mongoose');
const { ScoreRating, enumValues } = require('../constants/enums');

const breakdownSchema = new mongoose.Schema(
  {
    savingsBehaviour: { type: Number, default: 0, min: 0, max: 100 },
    incomeStability: { type: Number, default: 0, min: 0, max: 100 },
    paymentConsistency: { type: Number, default: 0, min: 0, max: 100 },
    businessActivity: { type: Number, default: 0, min: 0, max: 100 },
    creditHistory: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: false }
);

const scoreHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: 300,
      max: 850,
    },
    rating: {
      type: String,
      enum: {
        values: enumValues(ScoreRating),
        message: '{VALUE} is not a valid score rating',
      },
      required: true,
    },
    breakdown: {
      type: breakdownSchema,
      default: () => ({}),
    },
    calculatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

scoreHistorySchema.index({ userId: 1, calculatedAt: -1 });

const ScoreHistory = mongoose.model('ScoreHistory', scoreHistorySchema);

module.exports = ScoreHistory;
