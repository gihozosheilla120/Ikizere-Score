const AccountStatus = Object.freeze({
  REGISTERED: 'registered',
  PROFILE_INCOMPLETE: 'profile_incomplete',
  VERIFICATION_PENDING: 'verification_pending',
  VERIFIED: 'verified',
  ACTIVE: 'active',
});

const MembershipTier = Object.freeze({
  STANDARD: 'standard',
  PREMIUM: 'premium',
  GOLD: 'gold',
});

const Language = Object.freeze({
  EN: 'en',
  RW: 'rw',
  FR: 'fr',
  SW: 'sw',
});

const BusinessType = Object.freeze({
  RETAIL: 'retail',
  WHOLESALE: 'wholesale',
  SERVICES: 'services',
  AGRICULTURE: 'agriculture',
  MANUFACTURING: 'manufacturing',
  TECHNOLOGY: 'technology',
  HOSPITALITY: 'hospitality',
  OTHER: 'other',
});

const YearsInOperation = Object.freeze({
  LESS_THAN_1: 'less_than_1',
  ONE_TO_3: '1_to_3',
  THREE_TO_5: '3_to_5',
  FIVE_TO_10: '5_to_10',
  MORE_THAN_10: 'more_than_10',
});

const BusinessProfileStatus = Object.freeze({
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  COMPLETED: 'completed',
});

const Industry = Object.freeze({
  RETAIL_TRADE: 'retail_trade',
  WHOLESALE_TRADE: 'wholesale_trade',
  AGRICULTURE: 'agriculture',
  MANUFACTURING: 'manufacturing',
  CONSTRUCTION: 'construction',
  TRANSPORT: 'transport',
  HOSPITALITY: 'hospitality',
  HEALTHCARE: 'healthcare',
  EDUCATION: 'education',
  TECHNOLOGY: 'technology',
  FINANCIAL_SERVICES: 'financial_services',
  PROFESSIONAL_SERVICES: 'professional_services',
  OTHER: 'other',
});

const AuditAction = Object.freeze({
  BUSINESS_PROFILE_CREATED: 'business_profile_created',
  BUSINESS_PROFILE_UPDATED: 'business_profile_updated',
  BUSINESS_PROFILE_COMPLETED: 'business_profile_completed',
});

const VerificationStatus = Object.freeze({
  NOT_STARTED: 'not_started',
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
});

const TrustTier = Object.freeze({
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  EMERALD: 'emerald',
});

const RecordType = Object.freeze({
  INCOME: 'income',
  EXPENSE: 'expense',
  SAVINGS: 'savings',
});

const RecordCategory = Object.freeze({
  RETAIL_SALES: 'retail_sales',
  CLIENT_PAYMENT: 'client_payment',
  SERVICE_INCOME: 'service_income',
  OTHER_INCOME: 'other_income',
  INVENTORY: 'inventory',
  UTILITIES: 'utilities',
  RENT: 'rent',
  SALARIES: 'salaries',
  LOAN_INSTALLMENT: 'loan_installment',
  OTHER_EXPENSE: 'other_expense',
  BUSINESS_SAVINGS: 'business_savings',
  EMERGENCY_FUND: 'emergency_fund',
  OTHER_SAVINGS: 'other_savings',
});

const RECORD_CATEGORIES_BY_TYPE = Object.freeze({
  income: [
    RecordCategory.RETAIL_SALES,
    RecordCategory.CLIENT_PAYMENT,
    RecordCategory.SERVICE_INCOME,
    RecordCategory.OTHER_INCOME,
  ],
  expense: [
    RecordCategory.INVENTORY,
    RecordCategory.UTILITIES,
    RecordCategory.RENT,
    RecordCategory.SALARIES,
    RecordCategory.LOAN_INSTALLMENT,
    RecordCategory.OTHER_EXPENSE,
  ],
  savings: [
    RecordCategory.BUSINESS_SAVINGS,
    RecordCategory.EMERGENCY_FUND,
    RecordCategory.OTHER_SAVINGS,
  ],
});

const PaymentMethod = Object.freeze({
  BUSINESS_ACCOUNT: 'business_account',
  MOBILE_MONEY: 'mobile_money',
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash',
  CREDIT_LINE: 'credit_line',
});

const Currency = Object.freeze({
  RWF: 'RWF',
});

const ScoreRating = Object.freeze({
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
});

const LoanReadinessRating = Object.freeze({
  HIGHLY_ELIGIBLE: 'highly_eligible',
  ELIGIBLE: 'eligible',
  NEEDS_IMPROVEMENT: 'needs_improvement',
  NOT_ELIGIBLE: 'not_eligible',
});

const LoanPurpose = Object.freeze({
  INVENTORY_PURCHASE: 'inventory_purchase',
  EQUIPMENT: 'equipment',
  WORKING_CAPITAL: 'working_capital',
  EXPANSION: 'expansion',
  AGRICULTURE_SEASONAL: 'agriculture_seasonal',
  OTHER: 'other',
});

const InterestRateType = Object.freeze({
  FIXED: 'fixed',
  APR: 'apr',
  VARIABLE: 'variable',
});

const LoanProductTag = Object.freeze({
  FAST_APPROVAL: 'fast_approval',
  LOW_INTEREST: 'low_interest',
  BUSINESS_ONLY: 'business_only',
  NO_COLLATERAL: 'no_collateral',
  HIGH_LIMIT: 'high_limit',
});

const LoanApplicationStatus = Object.freeze({
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DISBURSED: 'disbursed',
});

const ApprovalProbability = Object.freeze({
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
});

const TimelineStepStatus = Object.freeze({
  COMPLETED: 'completed',
  CURRENT: 'current',
  PENDING: 'pending',
});

const WorkflowStepState = Object.freeze({
  DONE: 'done',
  PENDING: 'pending',
});

const NotificationType = Object.freeze({
  VERIFICATION_SUBMITTED: 'verification_submitted',
  VERIFICATION_APPROVED: 'verification_approved',
  VERIFICATION_REJECTED: 'verification_rejected',
  SCORE_UPDATED: 'score_updated',
  LOAN_SUBMITTED: 'loan_submitted',
  LOAN_STATUS_CHANGED: 'loan_status_changed',
  GENERAL: 'general',
});

const enumValues = (enumObj) => Object.values(enumObj);

module.exports = {
  AccountStatus,
  MembershipTier,
  Language,
  BusinessType,
  YearsInOperation,
  BusinessProfileStatus,
  Industry,
  AuditAction,
  VerificationStatus,
  TrustTier,
  RecordType,
  RecordCategory,
  RECORD_CATEGORIES_BY_TYPE,
  PaymentMethod,
  Currency,
  ScoreRating,
  LoanReadinessRating,
  LoanPurpose,
  InterestRateType,
  LoanProductTag,
  LoanApplicationStatus,
  ApprovalProbability,
  TimelineStepStatus,
  WorkflowStepState,
  NotificationType,
  enumValues,
};
