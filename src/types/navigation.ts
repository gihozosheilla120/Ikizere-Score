import { NavigatorScreenParams } from '@react-navigation/native';
import { ROUTES } from '../constants/routes';

export type AuthStackParamList = {
  [ROUTES.ONBOARDING]: undefined;
  [ROUTES.SIGN_IN]: undefined;
  [ROUTES.SIGN_UP_STEP_1]: undefined;
  [ROUTES.SIGN_UP_STEP_2]: { fullName: string; phoneNumber: string; nationalId: string };
  [ROUTES.ACCOUNT_CREATED]: undefined;
  [ROUTES.FORGOT_PASSWORD]: undefined;
  [ROUTES.RESET_PASSWORD]: { token?: string };
};

export type HomeStackParamList = {
  [ROUTES.HOME_DASHBOARD]: undefined;
  [ROUTES.VERIFICATION_IN_PROGRESS]: undefined;
};

export type RecordsStackParamList = {
  [ROUTES.RECORDS_LIST]: undefined;
  [ROUTES.ADD_RECORD]: { type?: 'income' | 'expense' | 'savings' };
  [ROUTES.RECORD_SAVED]: { recordId: string };
  [ROUTES.RECORD_DETAIL]: { recordId: string };
};

export type ScoreStackParamList = {
  [ROUTES.SCORE_READINESS]: undefined;
  [ROUTES.SCORE_INSIGHTS]: undefined;
};

export type LoansStackParamList = {
  [ROUTES.LOAN_MARKETPLACE]: undefined;
  [ROUTES.LOAN_PRODUCT_DETAIL]: { productId: string };
  [ROUTES.LOAN_APPLY]: { productId: string };
  [ROUTES.APPLICATION_RECEIVED]: { applicationId: string };
  [ROUTES.LOAN_STATUS]: { applicationId: string };
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

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
