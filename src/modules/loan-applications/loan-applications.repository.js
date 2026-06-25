const mongoose = require('mongoose');
const LoanApplication = require('../../models/LoanApplication');
const LoanApplicationEvent = require('../../models/LoanApplicationEvent');
const LoanProduct = require('../../models/LoanProduct');
const Score = require('../../models/Score');
const Verification = require('../../models/Verification');
const FinancialRecord = require('../../models/FinancialRecord');
const AuditLog = require('../../models/AuditLog');
const { RecordType, VerificationStatus } = require('../../constants/enums');

class LoanApplicationsRepository {
  findProductById(productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return null;
    }
    return LoanProduct.findOne({ _id: productId, isActive: true });
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

  isVerificationApproved(verification) {
    return verification?.status === VerificationStatus.APPROVED;
  }

  createApplication(data) {
    return LoanApplication.create(data);
  }

  findByIdForUser(applicationId, userId) {
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return null;
    }
    return LoanApplication.findOne({ _id: applicationId, userId });
  }

  async listByUser(userId, { page = 1, limit = 20, status = null }) {
    const query = { userId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const [applications, total] = await Promise.all([
      LoanApplication.find(query).sort({ submittedAt: -1, createdAt: -1 }).skip(skip).limit(limit),
      LoanApplication.countDocuments(query),
    ]);

    return {
      applications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  updateApplication(applicationId, userId, data) {
    return LoanApplication.findOneAndUpdate({ _id: applicationId, userId }, { $set: data }, {
      new: true,
      runValidators: true,
    });
  }

  createEvents(events) {
    return LoanApplicationEvent.insertMany(events);
  }

  findEventsByApplicationId(applicationId) {
    return LoanApplicationEvent.find({ applicationId }).sort({ occurredAt: 1 });
  }

  createAuditLog(data) {
    return AuditLog.create(data);
  }

  findActiveApplicationForProduct(userId, loanProductId) {
    return LoanApplication.findOne({
      userId,
      loanProductId,
      status: { $in: ['submitted', 'under_review', 'approved'] },
    });
  }
}

module.exports = new LoanApplicationsRepository();
