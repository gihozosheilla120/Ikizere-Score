import type { NavigatorScreenParams, CompositeNavigationProp, NavigationAction } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ROUTES } from '@/constants/routes';
import type { RecordType } from '@/types/models';

// ---------------------------------------------------------------------------
// Route param payloads
// ---------------------------------------------------------------------------

export type SignUpStep2Params = {
  email: string;
  fullName: string;
  phoneNumber: string;
  nationalId: string;
};

export type AddRecordParams = {
  type?: RecordType;
};

export type RecordDetailParams = {
  recordId: string;
};

export type RecordSavedParams = {
  recordId: string;
};

export type ResetPasswordParams = {
  token?: string;
};

export type LoanProductParams = {
  productId: string;
};

export type LoanApplicationParams = {
  applicationId: string;
};

// ---------------------------------------------------------------------------
// Stack param lists
// ---------------------------------------------------------------------------

export type AuthStackParamList = {
  [ROUTES.SPLASH]: undefined;
  [ROUTES.ONBOARDING]: undefined;
  [ROUTES.SIGN_IN]: undefined;
  [ROUTES.SIGN_UP_STEP_1]: undefined;
  [ROUTES.SIGN_UP_STEP_2]: SignUpStep2Params;
  [ROUTES.ACCOUNT_CREATED]: undefined;
  [ROUTES.FORGOT_PASSWORD]: undefined;
  [ROUTES.RESET_PASSWORD]: ResetPasswordParams | undefined;
};

export type HomeStackParamList = {
  [ROUTES.HOME_DASHBOARD]: undefined;
  [ROUTES.VERIFICATION_IN_PROGRESS]: undefined;
};

export type RecordsStackParamList = {
  [ROUTES.RECORDS_LIST]: undefined;
  [ROUTES.ADD_RECORD]: AddRecordParams | undefined;
  [ROUTES.RECORD_SAVED]: RecordSavedParams;
  [ROUTES.RECORD_DETAIL]: RecordDetailParams;
};

export type ScoreStackParamList = {
  [ROUTES.SCORE_READINESS]: undefined;
  [ROUTES.SCORE_INSIGHTS]: undefined;
};

export type LoansStackParamList = {
  [ROUTES.LOAN_MARKETPLACE]: undefined;
  [ROUTES.LOAN_PRODUCT_DETAIL]: LoanProductParams;
  [ROUTES.LOAN_APPLY]: LoanProductParams;
  [ROUTES.APPLICATION_RECEIVED]: LoanApplicationParams;
  [ROUTES.LOAN_STATUS]: LoanApplicationParams;
  [ROUTES.LOAN_APPLICATIONS_LIST]: undefined;
};

export type ProfileStackParamList = {
  [ROUTES.PROFILE_HUB]: undefined;
  [ROUTES.BUSINESS_PROFILE]: undefined;
  [ROUTES.VERIFICATION]: undefined;
  [ROUTES.PERSONAL_INFO]: undefined;
  [ROUTES.SECURITY]: undefined;
  [ROUTES.LANGUAGE]: undefined;
  [ROUTES.HELP_CENTER]: undefined;
};

// ---------------------------------------------------------------------------
// Tab + root param lists
// ---------------------------------------------------------------------------

export type MainTabParamList = {
  [ROUTES.HOME_TAB]: NavigatorScreenParams<HomeStackParamList>;
  [ROUTES.RECORDS_TAB]: NavigatorScreenParams<RecordsStackParamList>;
  [ROUTES.SCORE_TAB]: NavigatorScreenParams<ScoreStackParamList>;
  [ROUTES.LOANS_TAB]: NavigatorScreenParams<LoansStackParamList>;
  [ROUTES.PROFILE_TAB]: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  [ROUTES.AUTH]: NavigatorScreenParams<AuthStackParamList>;
  [ROUTES.MAIN]: NavigatorScreenParams<MainTabParamList>;
};

// ---------------------------------------------------------------------------
// Nested navigation helpers (tab + stack composite props)
// ---------------------------------------------------------------------------

export type HomeDashboardNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, typeof ROUTES.HOME_DASHBOARD>,
  BottomTabNavigationProp<MainTabParamList>
>;

export type RecordsListNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RecordsStackParamList, typeof ROUTES.RECORDS_LIST>,
  BottomTabNavigationProp<MainTabParamList>
>;

export type AddRecordNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RecordsStackParamList, typeof ROUTES.ADD_RECORD>,
  BottomTabNavigationProp<MainTabParamList>
>;

export type ScoreInsightsNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ScoreStackParamList, typeof ROUTES.SCORE_INSIGHTS>,
  BottomTabNavigationProp<MainTabParamList>
>;

export type LoanMarketplaceNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<LoansStackParamList, typeof ROUTES.LOAN_MARKETPLACE>,
  BottomTabNavigationProp<MainTabParamList>
>;

export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

/** Any navigator that can dispatch cross-tab actions via CommonActions. */
export type NavDispatchProp = {
  dispatch(action: NavigationAction): void;
};

export type AuthNavigationProp = Pick<
  NativeStackNavigationProp<AuthStackParamList>,
  'navigate' | 'replace' | 'goBack'
>;

// ---------------------------------------------------------------------------
// Screen props aliases
// ---------------------------------------------------------------------------

export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type HomeScreenProps<T extends keyof HomeStackParamList> = NativeStackScreenProps<
  HomeStackParamList,
  T
>;

export type RecordsScreenProps<T extends keyof RecordsStackParamList> = NativeStackScreenProps<
  RecordsStackParamList,
  T
>;

export type ScoreScreenProps<T extends keyof ScoreStackParamList> = NativeStackScreenProps<
  ScoreStackParamList,
  T
>;

export type LoansScreenProps<T extends keyof LoansStackParamList> = NativeStackScreenProps<
  LoansStackParamList,
  T
>;

export type ProfileScreenProps<T extends keyof ProfileStackParamList> = NativeStackScreenProps<
  ProfileStackParamList,
  T
>;

// ---------------------------------------------------------------------------
// Global augmentation (default useNavigation typing)
// ---------------------------------------------------------------------------

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
