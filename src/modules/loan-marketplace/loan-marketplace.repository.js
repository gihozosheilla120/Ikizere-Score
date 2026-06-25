const mongoose = require('mongoose');
const LoanProduct = require('../../models/LoanProduct');
const Lender = require('../../models/Lender');
const UserLoanMatch = require('../../models/UserLoanMatch');
const Score = require('../../models/Score');
const Verification = require('../../models/Verification');
const FinancialRecord = require('../../models/FinancialRecord');
const { RecordType, VerificationStatus } = require('../../constants/enums');

class LoanMarketplaceRepository {
  findActiveProducts() {
    return LoanProduct.find({ isActive: true }).sort({ maxAmount: -1 });
  }

  findProductById(productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return null;
    }
    return LoanProduct.findOne({ _id: productId, isActive: true });
  }

  findLenderById(lenderId) {
    if (!mongoose.Types.ObjectId.isValid(lenderId)) {
      return null;
    }
    return Lender.findOne({ _id: lenderId, isActive: true });
  }

  findScoreByUserId(userId) {
    return Score.findOne({ userId });
  }

  findVerificationByUserId(userId) {
    return Verification.findOne({ userId });
  }

  async getMonthlyRevenue(userId, currency = null) {
    const since = new Date();
    since.setMonth(since.getMonth() - 1);

    const match = {
      userId,
      type: RecordType.INCOME,
      transactionDate: { $gte: since },
    };

    if (currency) {
      match.currency = currency;
    }

    const result = await FinancialRecord.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return result[0]?.total ?? 0;
  }

  async upsertUserMatches(userId, matches) {
    if (!matches.length) {
      return [];
    }

    const operations = matches.map((match) => ({
      updateOne: {
        filter: { userId, productId: match.productId },
        update: {
          $set: {
            matchPercent: match.matchPercent,
            isEligible: match.isEligible,
            eligibilityReasons: match.eligibilityReasons,
            matchedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    await UserLoanMatch.bulkWrite(operations);
    return matches;
  }

  findEligibleMatchesForUser(userId) {
    return UserLoanMatch.find({ userId, isEligible: true }).sort({ matchPercent: -1 });
  }

  isVerificationApproved(verification) {
    return verification?.status === VerificationStatus.APPROVED;
  }
}

module.exports = new LoanMarketplaceRepository();
