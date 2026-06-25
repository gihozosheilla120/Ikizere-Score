const ApiError = require('../../utils/ApiError');
const financialRecordsRepository = require('./financial-records.repository');
const { seedRecordCategories } = require('../../seeds/recordCategories.seed');
const { AuditAction } = require('../../constants/enums');

class FinancialRecordsService {
  normalizePayload(payload) {
    const data = { ...payload };
    if (data.receiptUrl === '') {
      data.receiptUrl = null;
    }
    if (data.transactionDate) {
      data.transactionDate = new Date(data.transactionDate);
    }
    return data;
  }

  async ensureCategoriesSeeded() {
    await seedRecordCategories();
  }

  async validateCategory(category, type) {
    const categoryDoc = await financialRecordsRepository.findCategoryBySlug(category, type);
    if (!categoryDoc) {
      throw ApiError.badRequest('Invalid category for the selected record type', [
        { field: 'category', message: 'Category does not exist or does not match type' },
      ]);
    }
    return categoryDoc;
  }

  async createRecord(userId, payload, meta = {}) {
    const data = this.normalizePayload(payload);
    await this.validateCategory(data.category, data.type);

    const record = await financialRecordsRepository.create(userId, data);

    await financialRecordsRepository.createAuditLog({
      userId,
      action: AuditAction.FINANCIAL_RECORD_CREATED,
      entityType: 'financial_record',
      entityId: record._id,
      metadata: {
        type: record.type,
        category: record.category,
        amount: record.amount,
        currency: record.currency,
      },
      ipAddress: meta.ipAddress || null,
    });

    return record;
  }

  async listRecords(userId, filters) {
    return financialRecordsRepository.findPaginated(userId, filters);
  }

  async getRecordById(userId, recordId) {
    const record = await financialRecordsRepository.findByIdForUser(recordId, userId);
    if (!record) {
      throw ApiError.notFound('Financial record not found');
    }
    return record;
  }

  async updateRecord(userId, recordId, payload, meta = {}) {
    const existing = await this.getRecordById(userId, recordId);
    const data = this.normalizePayload(payload);

    const nextType = data.type || existing.type;
    const nextCategory = data.category || existing.category;

    if (data.category || data.type) {
      await this.validateCategory(nextCategory, nextType);
    }

    const updated = await financialRecordsRepository.updateByIdForUser(recordId, userId, data);
    if (!updated) {
      throw ApiError.notFound('Financial record not found');
    }

    await financialRecordsRepository.createAuditLog({
      userId,
      action: AuditAction.FINANCIAL_RECORD_UPDATED,
      entityType: 'financial_record',
      entityId: updated._id,
      metadata: { fields: Object.keys(data) },
      ipAddress: meta.ipAddress || null,
    });

    return updated;
  }

  async deleteRecord(userId, recordId, meta = {}) {
    const deleted = await financialRecordsRepository.softDeleteByIdForUser(recordId, userId);
    if (!deleted) {
      throw ApiError.notFound('Financial record not found');
    }

    await financialRecordsRepository.createAuditLog({
      userId,
      action: AuditAction.FINANCIAL_RECORD_DELETED,
      entityType: 'financial_record',
      entityId: deleted._id,
      metadata: {
        type: deleted.type,
        amount: deleted.amount,
      },
      ipAddress: meta.ipAddress || null,
    });

    return deleted;
  }

  async getMonthlyInsights(userId, query) {
    return financialRecordsRepository.getMonthlyInsights(userId, query);
  }

  async getCategories({ type } = {}) {
    await this.ensureCategoriesSeeded();
    return financialRecordsRepository.findCategories({ type });
  }
}

module.exports = new FinancialRecordsService();
