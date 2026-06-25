const ApiError = require('../../utils/ApiError');
const loanApplicationsRepository = require('./loan-applications.repository');
const matchingService = require('../loan-marketplace/loan-marketplace.matching.service');
const { LoanApplicationStatus, LoanApplicationEventType, AuditAction } = require('../../constants/enums');

const CANCELLABLE_STATUSES = [
  LoanApplicationStatus.SUBMITTED,
  LoanApplicationStatus.UNDER_REVIEW,
];

class LoanApplicationsService {
  async buildUserContext(userId, currency = null) {
    const [score, verification, monthlyRevenue] = await Promise.all([
      loanApplicationsRepository.findScoreByUserId(userId),
      loanApplicationsRepository.findVerificationByUserId(userId),
      loanApplicationsRepository.getMonthlyRevenue(userId, currency),
    ]);

    return {
      currentScore: score?.currentScore ?? 300,
      loanReadinessPercent: score?.loanReadinessPercent ?? 0,
      loanReadinessRating: score?.loanReadinessRating ?? 'not_eligible',
      monthlyRevenue,
      verificationApproved: loanApplicationsRepository.isVerificationApproved(verification),
    };
  }

  async assertEligibility(userId, product, { requestedAmount, requestedTermMonths }) {
    const userContext = await this.buildUserContext(userId, product.currency);
    const filters = {
      amount: requestedAmount,
      term: requestedTermMonths,
    };

    const isEligible = matchingService.isEligible(userContext, product, filters);
    if (!isEligible) {
      const reasons = matchingService.buildEligibilityReasons(userContext, product, filters);
      throw ApiError.forbidden('You are not eligible for this loan product', {
        reasons,
      });
    }

    return userContext;
  }

  formatApplication(application) {
    return {
      id: application._id,
      userId: application.userId,
      loanProductId: application.loanProductId,
      requestedAmount: application.requestedAmount,
      requestedTermMonths: application.requestedTermMonths,
      purpose: application.purpose,
      monthlyRevenueSnapshot: application.monthlyRevenueSnapshot,
      ikizereScoreSnapshot: application.ikizereScoreSnapshot,
      readinessSnapshot: application.readinessSnapshot,
      status: application.status,
      rejectionReason: application.rejectionReason,
      submittedAt: application.submittedAt,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    };
  }

  async createApplication(userId, payload, meta = {}) {
    const product = await loanApplicationsRepository.findProductById(payload.loanProductId);
    if (!product) {
      throw ApiError.notFound('Loan product not found');
    }

    if (payload.requestedAmount < product.minAmount || payload.requestedAmount > product.maxAmount) {
      throw ApiError.badRequest(
        `Requested amount must be between ${product.minAmount} and ${product.maxAmount} ${product.currency}`
      );
    }

    if (payload.requestedTermMonths !== product.termMonths) {
      throw ApiError.badRequest(
        `This product requires a ${product.termMonths}-month repayment term`
      );
    }

    const existing = await loanApplicationsRepository.findActiveApplicationForProduct(
      userId,
      payload.loanProductId
    );
    if (existing) {
      throw ApiError.conflict('You already have an active application for this loan product');
    }

    const userContext = await this.assertEligibility(userId, product, payload);

    const now = new Date();
    const application = await loanApplicationsRepository.createApplication({
      userId,
      loanProductId: product._id,
      requestedAmount: payload.requestedAmount,
      requestedTermMonths: payload.requestedTermMonths,
      purpose: payload.purpose,
      monthlyRevenueSnapshot: userContext.monthlyRevenue,
      ikizereScoreSnapshot: userContext.currentScore,
      readinessSnapshot: {
        percent: userContext.loanReadinessPercent,
        rating: userContext.loanReadinessRating,
      },
      status: LoanApplicationStatus.SUBMITTED,
      submittedAt: now,
    });

    await loanApplicationsRepository.createEvents([
      {
        applicationId: application._id,
        userId,
        eventType: LoanApplicationEventType.APPLICATION_CREATED,
        message: 'Loan application created',
        occurredAt: now,
      },
      {
        applicationId: application._id,
        userId,
        eventType: LoanApplicationEventType.SUBMITTED,
        message: 'Application submitted for review',
        metadata: {
          loanProductId: product._id,
          productName: product.productName,
          lenderName: product.lenderName,
        },
        occurredAt: now,
      },
    ]);

    await loanApplicationsRepository.createAuditLog({
      userId,
      action: AuditAction.LOAN_APPLICATION_CREATED,
      entityType: 'loan_application',
      entityId: application._id,
      metadata: {
        loanProductId: product._id,
        requestedAmount: payload.requestedAmount,
        requestedTermMonths: payload.requestedTermMonths,
        purpose: payload.purpose,
        ikizereScoreSnapshot: userContext.currentScore,
      },
      ipAddress: meta.ipAddress || null,
    });

    return this.formatApplication(application);
  }

  async listApplications(userId, query) {
    const result = await loanApplicationsRepository.listByUser(userId, query);
    return {
      applications: result.applications.map((app) => this.formatApplication(app)),
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    };
  }

  async getApplicationById(userId, applicationId) {
    const application = await loanApplicationsRepository.findByIdForUser(applicationId, userId);
    if (!application) {
      throw ApiError.notFound('Loan application not found');
    }
    return this.formatApplication(application);
  }

  async getTimeline(userId, applicationId) {
    const application = await loanApplicationsRepository.findByIdForUser(applicationId, userId);
    if (!application) {
      throw ApiError.notFound('Loan application not found');
    }

    const events = await loanApplicationsRepository.findEventsByApplicationId(applicationId);
    return events.map((event) => ({
      id: event._id,
      eventType: event.eventType,
      message: event.message,
      metadata: event.metadata,
      occurredAt: event.occurredAt,
    }));
  }

  async cancelApplication(userId, applicationId, meta = {}) {
    const application = await loanApplicationsRepository.findByIdForUser(applicationId, userId);
    if (!application) {
      throw ApiError.notFound('Loan application not found');
    }

    if (!CANCELLABLE_STATUSES.includes(application.status)) {
      throw ApiError.badRequest(`Cannot cancel application with status "${application.status}"`);
    }

    const now = new Date();
    const updated = await loanApplicationsRepository.updateApplication(applicationId, userId, {
      status: LoanApplicationStatus.REJECTED,
      rejectionReason: 'Cancelled by user',
    });

    await loanApplicationsRepository.createEvents([
      {
        applicationId: application._id,
        userId,
        eventType: LoanApplicationEventType.CANCELLED,
        message: 'Application cancelled by user',
        occurredAt: now,
      },
    ]);

    await loanApplicationsRepository.createAuditLog({
      userId,
      action: AuditAction.LOAN_APPLICATION_CANCELLED,
      entityType: 'loan_application',
      entityId: application._id,
      metadata: {
        previousStatus: application.status,
      },
      ipAddress: meta.ipAddress || null,
    });

    return this.formatApplication(updated);
  }
}

module.exports = new LoanApplicationsService();
