import { API_ENDPOINTS } from '../constants/api';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './apiClient';
import type {
  CreateLoanApplicationPayload,
  CreateRecordPayload,
  FinancialRecord,
  LoanApplication,
  LoanApplicationEvent,
  LoanMarketplaceFilters,
  LoanMarketplaceResponse,
  LoanProductDetail,
  MonthlyInsights,
  RecordCategory,
  RecordType,
  RecordsListFilters,
  ScoreBreakdown,
  ScoreHistoryEntry,
  ScoreSummary,
  UpdateRecordPayload,
} from '@/types/models';
import type { PaginationMeta } from '@/types/api';

export const recordsService = {
  list(params?: RecordsListFilters) {
    return apiGet<{ records: FinancialRecord[] } & PaginationMeta>(
      API_ENDPOINTS.records.list,
      params
    );
  },

  getById(id: string) {
    return apiGet<{ record: FinancialRecord }>(API_ENDPOINTS.records.byId(id));
  },

  create(payload: CreateRecordPayload) {
    return apiPost<{ record: FinancialRecord }>(API_ENDPOINTS.records.list, payload);
  },

  update(id: string, payload: UpdateRecordPayload) {
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
    return apiGet<MonthlyInsights>(API_ENDPOINTS.records.monthlyInsights, params);
  },
};

export const scoreService = {
  getSummary() {
    return apiGet<ScoreSummary>(API_ENDPOINTS.score.summary);
  },

  getBreakdown() {
    return apiGet<ScoreBreakdown>(API_ENDPOINTS.score.breakdown);
  },

  getHistory(params?: { page?: number; limit?: number }) {
    return apiGet<{ history: ScoreHistoryEntry[] } & PaginationMeta>(
      API_ENDPOINTS.score.history,
      params
    );
  },
};

export const loansService = {
  getMarketplace(params?: LoanMarketplaceFilters) {
    return apiGet<LoanMarketplaceResponse>(API_ENDPOINTS.loans.marketplace, params);
  },

  getProductById(id: string, params?: LoanMarketplaceFilters) {
    return apiGet<{ product: LoanProductDetail }>(
      API_ENDPOINTS.loans.marketplaceById(id),
      params
    );
  },

  getEligibleProducts(params?: LoanMarketplaceFilters) {
    return apiGet<LoanMarketplaceResponse>(API_ENDPOINTS.loans.eligibleProducts, params);
  },

  createApplication(payload: CreateLoanApplicationPayload) {
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
