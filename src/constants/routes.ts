export const ROUTES = {
  // Root
  AUTH: 'Auth',
  MAIN: 'Main',

  // Auth stack
  ONBOARDING: 'Onboarding',
  SIGN_IN: 'SignIn',
  SIGN_UP_STEP_1: 'SignUpStep1',
  SIGN_UP_STEP_2: 'SignUpStep2',
  ACCOUNT_CREATED: 'AccountCreated',
  FORGOT_PASSWORD: 'ForgotPassword',
  RESET_PASSWORD: 'ResetPassword',

  // Main tabs
  HOME_TAB: 'HomeTab',
  RECORDS_TAB: 'RecordsTab',
  SCORE_TAB: 'ScoreTab',
  LOANS_TAB: 'LoansTab',
  PROFILE_TAB: 'ProfileTab',

  // Home stack
  HOME_DASHBOARD: 'HomeDashboard',
  VERIFICATION_IN_PROGRESS: 'VerificationInProgress',

  // Records stack
  RECORDS_LIST: 'RecordsList',
  ADD_RECORD: 'AddRecord',
  RECORD_SAVED: 'RecordSaved',
  RECORD_DETAIL: 'RecordDetail',

  // Score stack
  SCORE_READINESS: 'ScoreReadiness',
  SCORE_INSIGHTS: 'ScoreInsights',

  // Loans stack
  LOAN_MARKETPLACE: 'LoanMarketplace',
  LOAN_PRODUCT_DETAIL: 'LoanProductDetail',
  LOAN_APPLY: 'LoanApply',
  APPLICATION_RECEIVED: 'ApplicationReceived',
  LOAN_STATUS: 'LoanStatus',
  LOAN_APPLICATIONS_LIST: 'LoanApplicationsList',

  // Profile stack
  PROFILE_HUB: 'ProfileHub',
  BUSINESS_PROFILE: 'BusinessProfile',
  VERIFICATION: 'Verification',
  PERSONAL_INFO: 'PersonalInfo',
  SECURITY: 'Security',
  LANGUAGE: 'Language',
  HELP_CENTER: 'HelpCenter',
} as const;

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];
