import { PlaceholderScreen } from '../components/ui';

export { SplashScreen } from './auth/SplashScreen';
export { OnboardingScreen } from './auth/OnboardingScreen';
export { SignInScreen } from './auth/SignInScreen';
export { SignUpStep1Screen } from './auth/SignUpStep1Screen';
export { SignUpStep2Screen } from './auth/SignUpStep2Screen';
export { AccountCreatedScreen } from './auth/AccountCreatedScreen';
export { ForgotPasswordScreen, ResetPasswordScreen } from './auth/ForgotPasswordScreens';

export { HomeDashboardScreen } from './home/HomeDashboardScreen';

export function VerificationInProgressScreen() {
  return <PlaceholderScreen title="Verification In Progress" />;
}

export { RecordsListScreen } from './records/RecordsListScreen';
export { AddRecordScreen } from './records/AddRecordScreen';
export { RecordDetailScreen } from './records/RecordDetailScreen';
export { RecordSavedScreen } from './records/RecordSavedScreen';
export { MonthlyInsightsScreen } from './records/MonthlyInsightsScreen';

export { ScoreReadinessScreen } from './score/ScoreReadinessScreen';
export { ScoreInsightsScreen } from './score/ScoreInsightsScreen';

export { LoanMarketplaceScreen } from './loans/LoanMarketplaceScreen';
export { LoanProductDetailScreen } from './loans/LoanProductDetailScreen';

export function LoanApplyScreen() {
  return <PlaceholderScreen title="Loan Application" />;
}

export function ApplicationReceivedScreen() {
  return <PlaceholderScreen title="Application Received" />;
}

export function LoanStatusScreen() {
  return <PlaceholderScreen title="Loan Status" />;
}

export function LoanApplicationsListScreen() {
  return <PlaceholderScreen title="My Applications" />;
}

export function ProfileHubScreen() {
  return <PlaceholderScreen title="Profile" />;
}

export function BusinessProfileScreen() {
  return <PlaceholderScreen title="Business Profile" />;
}

export function VerificationScreen() {
  return <PlaceholderScreen title="Verification" />;
}

export function PersonalInfoScreen() {
  return <PlaceholderScreen title="Personal Information" />;
}

export function SecurityScreen() {
  return <PlaceholderScreen title="Security Settings" />;
}

export function LanguageScreen() {
  return <PlaceholderScreen title="Select Language" />;
}

export function HelpCenterScreen() {
  return <PlaceholderScreen title="Help Center" />;
}
