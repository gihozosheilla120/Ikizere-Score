import { API_ENDPOINTS } from '../constants/api';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './apiClient';
import type {
  FinancialRecord,
  LoanApplication,
  LoanApplicationEvent,
  LoanProductCard,
  RecordCategory,
  RecordType,
  ScoreBreakdownFactor,
  ScoreSummary,
} from '../types/models';
import type { PaginationMeta } from '../types/api';

export const recordsService = {
  list(params?: Record<string, unknown>) {
    return apiGet<{ records: FinancialRecord[] } & PaginationMeta>(
      API_ENDPOINTS.records.list,
      params
    );
  },

  getById(id: string) {
    return apiGet<{ record: FinancialRecord }>(API_ENDPOINTS.records.byId(id));
  },

  create(payload: Record<string, unknown>) {
    return apiPost<{ record: FinancialRecord }>(API_ENDPOINTS.records.list, payload);
  },

  update(id: string, payload: Record<string, unknown>) {
    return apiPatch<{ record: FinancialRecord }>(API_ENDPOINTS.records.byId(id), payload);
  },

  remove(id: string) {
    return apiDelete<{ record: FinancialRecord }>(API_ENDPOINTS.records.byId(id));
  },

  getCategories(type?: RecordType) {
    return apiGet<{ categories: RecordCategory[] }>(API_ENDPOINTS.records.categories, {
      type,
    });
  },

  getMonthlyInsights(params: { year: number; month: number; currency?: string }) {
    return apiGet<{
      year: number;
      month: number;
      currency: string | null;
      totalIncome: number;
      totalExpenses: number;
      totalSavings: number;
      netCashFlow: number;
    }>(API_ENDPOINTS.records.monthlyInsights, params);
  },
};

export const scoreService = {
  getSummary() {
    return apiGet<ScoreSummary>(API_ENDPOINTS.score.summary);
  },

  getBreakdown() {
    return apiGet<{
      currentScore: number;
      rating: string;
      factors: ScoreBreakdownFactor[];
      breakdown: Record<string, number>;
      lastCalculatedAt: string | null;
    }>(API_ENDPOINTS.score.breakdown);
  },

  getHistory(params?: { page?: number; limit?: number }) {
    return apiGet<{ history: Array<{ score: number; rating: string; calculatedAt: string }> }>(
      API_ENDPOINTS.score.history,
      params
    );
  },
};

export const loansService = {
  getMarketplace(params?: Record<string, unknown>) {
    return apiGet<{
      products: LoanProductCard[];
      userContext: Record<string, unknown>;
    }>(API_ENDPOINTS.loans.marketplace, params);
  },

  getProductById(id: string, params?: Record<string, unknown>) {
    return apiGet<{ product: LoanProductCard }>(
      API_ENDPOINTS.loans.marketplaceById(id),
      params
    );
  },

  getEligibleProducts(params?: Record<string, unknown>) {
    return apiGet<{
      products: LoanProductCard[];
      userContext: Record<string, unknown>;
    }>(API_ENDPOINTS.loans.eligibleProducts, params);
  },

  createApplication(payload: {
    loanProductId: string;
    requestedAmount: number;
    requestedTermMonths: number;
    purpose: string;
  }) {
    return apiPost<{ application: LoanApplication }>(
      API_ENDPOINTS.loans.applications,
      payload
    );
  },

  listApplications(params?: { page?: number; limit?: number; status?: string }) {
    return apiGet<{ applications: LoanApplication[] } & PaginationMeta>(
      API_ENDPOINTS.loans.applications,
      params
    );
  },

  getApplicationById(id: string) {
    return apiGet<{ application: LoanApplication }>(
      API_ENDPOINTS.loans.applicationById(id)
    );
  },

  getApplicationTimeline(id: string) {
    return apiGet<{ timeline: LoanApplicationEvent[] }>(
      API_ENDPOINTS.loans.applicationTimeline(id)
    );
  },

  cancelApplication(id: string) {
    return apiPatch<{ application: LoanApplication }>(
      API_ENDPOINTS.loans.cancelApplication(id)
    );
  },
};

export const businessProfileService = {
  get() {
    return apiGet<{ profile: Record<string, unknown> }>(API_ENDPOINTS.users.businessProfile);
  },

  update(payload: Record<string, unknown>) {
    return apiPut<{ profile: Record<string, unknown> }>(
      API_ENDPOINTS.users.businessProfile,
      payload
    );
  },
};

export const verificationService = {
  getStatus() {
    return apiGet<Record<string, unknown>>(API_ENDPOINTS.verification.status);
  },

  getDetails() {
    return apiGet<Record<string, unknown>>(API_ENDPOINTS.verification.details);
  },

  submit() {
    return apiPost(API_ENDPOINTS.verification.submit);
  },
};
