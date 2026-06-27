export type AccountStatus =
  | 'registered'
  | 'profile_incomplete'
  | 'verification_pending'
  | 'verified'
  | 'active'
  | 'verification_rejected';

export type BusinessType =
  | 'retail'
  | 'wholesale'
  | 'services'
  | 'agriculture'
  | 'manufacturing'
  | 'technology'
  | 'hospitality'
  | 'other';

export type RecordType = 'income' | 'expense' | 'savings';

export type Currency = 'RWF' | 'USD' | 'TZS';

export type ScoreRating = 'excellent' | 'good' | 'fair' | 'poor';

export type LoanReadinessRating =
  | 'highly_eligible'
  | 'eligible'
  | 'needs_improvement'
  | 'not_eligible';

export type LoanPurpose =
  | 'inventory_purchase'
  | 'equipment'
  | 'working_capital'
  | 'expansion'
  | 'agriculture_seasonal'
  | 'other';

export type LoanApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'funded';

export type VerificationStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  _id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  nationalId: string;
  nationalIdVerified: boolean;
  profilePictureUrl: string | null;
  businessType: BusinessType | null;
  membershipTier: string;
  memberSince: string;
  accountStatus: AccountStatus;
  onboardingCompleted: boolean;
  role: string;
  preferredLanguage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  email: string;
  fullName: string;
  phoneNumber: string;
  nationalId: string;
  businessType: BusinessType;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}

export interface ScoreSummary {
  currentScore: number;
  previousScore: number;
  rating: ScoreRating;
  monthlyChange: number;
  changeReason: string;
  loanReadinessPercent: number;
  loanReadinessRating: LoanReadinessRating;
  percentileRank: number | null;
  lastCalculatedAt: string | null;
}

export interface ScoreBreakdownFactor {
  factor: string;
  weight: number;
  score: number;
  weightedContribution: number;
}

export interface ScoreBreakdownMap {
  savingsBehaviour: number;
  incomeStability: number;
  paymentConsistency: number;
  businessActivity: number;
  creditHistory: number;
}

export interface ScoreBreakdown {
  currentScore: number;
  rating: ScoreRating;
  factors: ScoreBreakdownFactor[];
  breakdown: Partial<ScoreBreakdownMap>;
  lastCalculatedAt: string | null;
}

export interface ScoreHistoryEntry {
  score: number;
  rating: ScoreRating;
  calculatedAt: string;
}

export interface LoanEligibilityRules {
  minLoanReadinessPercent?: number;
  requiresVerification?: boolean;
  minLoanReadinessRating?: LoanReadinessRating;
  notes?: string;
}

export interface LoanLender {
  id: string;
  name: string;
  logoUrl: string | null;
  verified: boolean;
  description?: string;
}

export interface LoanProductCard {
  id: string;
  lenderId: string;
  lenderName: string;
  productName: string;
  description?: string;
  minimumScore: number;
  minimumRevenue: number;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  termMonths: number;
  currency: Currency;
  matchPercent: number;
  isEligible: boolean;
  eligibilityReasons: string[];
  eligibilityRules?: LoanEligibilityRules;
}

export interface LoanProductDetail extends LoanProductCard {
  lender: LoanLender | null;
}

export interface LoanUserContext {
  currentScore: number;
  loanReadinessPercent: number;
  loanReadinessRating: LoanReadinessRating;
  monthlyRevenue: number;
}

export interface LoanMarketplaceResponse {
  products: LoanProductCard[];
  userContext: LoanUserContext;
}

export interface LoanMarketplaceFilters {
  amount?: number;
  term?: number;
  currency?: Currency;
  search?: string;
}

export interface CreateLoanApplicationPayload {
  loanProductId: string;
  requestedAmount: number;
  requestedTermMonths: number;
  purpose: LoanPurpose;
}

export interface ReadinessSnapshot {
  percent: number;
  rating: LoanReadinessRating;
}

export interface LoanApplication {
  id: string;
  userId: string;
  loanProductId: string;
  requestedAmount: number;
  requestedTermMonths: number;
  purpose: LoanPurpose;
  monthlyRevenueSnapshot: number;
  ikizereScoreSnapshot: number;
  readinessSnapshot: ReadinessSnapshot;
  status: LoanApplicationStatus;
  rejectionReason: string | null;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoanApplicationEvent {
  id: string;
  eventType: string;
  message: string;
  metadata?: Record<string, unknown>;
  occurredAt: string;
}

export interface FinancialRecord {
  _id: string;
  userId: string;
  type: RecordType;
  category: string;
  amount: number;
  currency: Currency;
  transactionDate: string;
  description?: string;
  source?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RecordCategory {
  _id: string;
  slug: string;
  name: string;
  type: RecordType;
}

export interface CreateRecordPayload {
  type: RecordType;
  category: string;
  amount: number;
  currency: Currency;
  transactionDate: string;
  description?: string;
  source?: string;
  tags?: string[];
}

export interface UpdateRecordPayload {
  type?: RecordType;
  category?: string;
  amount?: number;
  currency?: Currency;
  transactionDate?: string;
  description?: string;
  tags?: string[];
}

export interface RecordsListFilters {
  page?: number;
  limit?: number;
  type?: RecordType;
  search?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: 'transactionDate' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface MonthlyInsights {
  year: number;
  month: number;
  currency: Currency | null;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  netCashFlow: number;
}
