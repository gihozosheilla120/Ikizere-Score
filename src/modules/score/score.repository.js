const mongoose = require('mongoose');
const FinancialRecord = require('../../models/FinancialRecord');
const BusinessProfile = require('../../models/BusinessProfile');
const Verification = require('../../models/Verification');
const Score = require('../../models/Score');
const ScoreHistory = require('../../models/ScoreHistory');
const { RecordType, BusinessProfileStatus, VerificationStatus } = require('../../constants/enums');

class ScoreRepository {
  findScoreByUserId(userId) {
    return Score.findOne({ userId });
  }

  ensureScoreDocument(userId) {
    return Score.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId } },
      { upsert: true, new: true }
    );
  }

  async getFinancialRecordsSince(userId, since) {
    return FinancialRecord.find({
      userId,
      transactionDate: { $gte: since },
    }).sort({ transactionDate: 1 });
  }

  getBusinessProfile(userId) {
    return BusinessProfile.findOne({ userId });
  }

  getVerification(userId) {
    return Verification.findOne({ userId });
  }

  async saveScoreUpdate(userId, scoreData, historyEntry) {
    const existing = await this.findScoreByUserId(userId);
    const previousScore = existing?.currentScore ?? scoreData.currentScore;

    const updated = await Score.findOneAndUpdate(
      { userId },
      {
        $set: {
          ...scoreData,
          previousScore,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    await ScoreHistory.create(historyEntry);

    return updated;
  }

  async getScoreHistory(userId, { limit = 30, page = 1 }) {
    const skip = (page - 1) * limit;
    const query = { userId };

    const [history, total] = await Promise.all([
      ScoreHistory.find(query).sort({ calculatedAt: -1 }).skip(skip).limit(limit),
      ScoreHistory.countDocuments(query),
    ]);

    return {
      history,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getScoreFromHistoryDaysAgo(userId, days) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return ScoreHistory.findOne({
      userId,
      calculatedAt: { $lte: since },
    }).sort({ calculatedAt: -1 });
  }

  async getPercentileRank(userId, currentScore) {
    const lowerCount = await Score.countDocuments({
      currentScore: { $lt: currentScore },
      userId: { $ne: new mongoose.Types.ObjectId(userId) },
    });
    const totalCount = await Score.countDocuments({
      userId: { $ne: new mongoose.Types.ObjectId(userId) },
    });

    if (totalCount === 0) {
      return null;
    }

    return Math.round((lowerCount / totalCount) * 100);
  }

  async aggregateMonthlyTotals(userId, records) {
    const months = new Map();

    records
      .filter((r) => r.type === RecordType.INCOME)
      .forEach((record) => {
        const key = `${record.transactionDate.getUTCFullYear()}-${record.transactionDate.getUTCMonth()}`;
        months.set(key, (months.get(key) || 0) + record.amount);
      });

    return Array.from(months.values());
  }

  isProfileComplete(profile) {
    return profile?.status === BusinessProfileStatus.COMPLETED;
  }

  isVerificationApproved(verification) {
    return verification?.status === VerificationStatus.APPROVED;
  }
}

module.exports = new ScoreRepository();
