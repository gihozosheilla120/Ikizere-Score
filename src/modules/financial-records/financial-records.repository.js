const mongoose = require('mongoose');
const FinancialRecord = require('../../models/FinancialRecord');
const RecordCategory = require('../../models/RecordCategory');
const AuditLog = require('../../models/AuditLog');
const { RecordType } = require('../../constants/enums');

class FinancialRecordsRepository {
  async findCategoryBySlug(slug, type = null) {
    const query = { slug, isActive: true };
    if (type) {
      query.type = type;
    }
    return RecordCategory.findOne(query);
  }

  findCategories({ type } = {}) {
    const query = { isActive: true };
    if (type) {
      query.type = type;
    }
    return RecordCategory.find(query).sort({ type: 1, sortOrder: 1 });
  }

  create(userId, data) {
    return FinancialRecord.create({ userId, ...data });
  }

  findByIdForUser(recordId, userId) {
    if (!mongoose.Types.ObjectId.isValid(recordId)) {
      return null;
    }
    return FinancialRecord.findOne({ _id: recordId, userId });
  }

  updateByIdForUser(recordId, userId, data) {
    return FinancialRecord.findOneAndUpdate(
      { _id: recordId, userId },
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  async softDeleteByIdForUser(recordId, userId) {
    const record = await this.findByIdForUser(recordId, userId);
    if (!record) {
      return null;
    }
    await record.softDelete();
    return record;
  }

  buildListQuery(userId, filters) {
    const query = { userId };

    if (filters.type) {
      query.type = filters.type;
    }
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.currency) {
      query.currency = filters.currency;
    }

    if (filters.fromDate || filters.toDate) {
      query.transactionDate = {};
      if (filters.fromDate) {
        query.transactionDate.$gte = new Date(filters.fromDate);
      }
      if (filters.toDate) {
        query.transactionDate.$lte = new Date(filters.toDate);
      }
    }

    if (filters.minAmount != null || filters.maxAmount != null) {
      query.amount = {};
      if (filters.minAmount != null) {
        query.amount.$gte = filters.minAmount;
      }
      if (filters.maxAmount != null) {
        query.amount.$lte = filters.maxAmount;
      }
    }

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    return query;
  }

  async findPaginated(userId, filters) {
    const query = this.buildListQuery(userId, filters);
    const skip = (filters.page - 1) * filters.limit;
    const sort = { [filters.sortBy]: filters.sortOrder === 'asc' ? 1 : -1 };

    const [records, total] = await Promise.all([
      FinancialRecord.find(query).sort(sort).skip(skip).limit(filters.limit),
      FinancialRecord.countDocuments(query),
    ]);

    return {
      records,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit) || 1,
    };
  }

  async getMonthlyInsights(userId, { year, month, currency } = {}) {
    const now = new Date();
    const targetYear = year || now.getFullYear();
    const targetMonth = month || now.getMonth() + 1;

    const start = new Date(Date.UTC(targetYear, targetMonth - 1, 1));
    const end = new Date(Date.UTC(targetYear, targetMonth, 1));

    const match = {
      userId: new mongoose.Types.ObjectId(userId),
      transactionDate: { $gte: start, $lt: end },
      isDeleted: { $ne: true },
    };

    if (currency) {
      match.currency = currency;
    }

    const results = await FinancialRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const totals = {
      totalIncome: 0,
      totalExpenses: 0,
      totalSavings: 0,
    };

    results.forEach((row) => {
      if (row._id === RecordType.INCOME) {
        totals.totalIncome = row.total;
      } else if (row._id === RecordType.EXPENSE) {
        totals.totalExpenses = row.total;
      } else if (row._id === RecordType.SAVINGS) {
        totals.totalSavings = row.total;
      }
    });

    totals.netCashFlow = totals.totalIncome - totals.totalExpenses;

    return {
      year: targetYear,
      month: targetMonth,
      currency: currency || null,
      ...totals,
    };
  }

  createAuditLog({ userId, action, entityType, entityId, metadata, ipAddress }) {
    return AuditLog.create({
      userId,
      action,
      entityType,
      entityId,
      metadata,
      ipAddress,
    });
  }
}

module.exports = new FinancialRecordsRepository();
