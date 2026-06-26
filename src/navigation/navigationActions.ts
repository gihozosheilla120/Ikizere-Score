import { CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';
import type {
  AddRecordParams,
  AuthStackParamList,
  LoanApplicationParams,
  LoanProductParams,
  MainTabParamList,
  NavDispatchProp,
} from '../types/navigation';
import type { RecordType } from '../types/models';

/** Any navigation object that can dispatch actions (stack, tab, or composite). */
type NavDispatch = NavDispatchProp;

type AuthNavigation = Pick<
  NativeStackNavigationProp<AuthStackParamList>,
  'navigate' | 'replace'
>;

function navigateTab(
  navigation: NavDispatch,
  tab: keyof MainTabParamList,
  screenParams: MainTabParamList[keyof MainTabParamList]
) {
  navigation.dispatch(
    CommonActions.navigate({
      name: tab,
      params: screenParams,
    })
  );
}

/**
 * Type-safe cross-tab navigation helpers.
 * Uses CommonActions so they work from any nested stack screen.
 */
export const tabNavigation = {
  toHomeDashboard(navigation: NavDispatch) {
    navigateTab(navigation, ROUTES.HOME_TAB, { screen: ROUTES.HOME_DASHBOARD });
  },

  toRecordsList(navigation: NavDispatch) {
    navigateTab(navigation, ROUTES.RECORDS_TAB, { screen: ROUTES.RECORDS_LIST });
  },

  toAddRecord(navigation: NavDispatch, params?: AddRecordParams) {
    if (params?.type) {
      navigateTab(navigation, ROUTES.RECORDS_TAB, {
        screen: ROUTES.ADD_RECORD,
        params: { type: params.type },
      });
      return;
    }

    navigateTab(navigation, ROUTES.RECORDS_TAB, { screen: ROUTES.ADD_RECORD });
  },

  toAddRecordOfType(navigation: NavDispatch, type: RecordType) {
    tabNavigation.toAddRecord(navigation, { type });
  },

  toRecordDetail(navigation: NavDispatch, recordId: string) {
    navigateTab(navigation, ROUTES.RECORDS_TAB, {
      screen: ROUTES.RECORD_DETAIL,
      params: { recordId },
    });
  },

  toScoreReadiness(navigation: NavDispatch) {
    navigateTab(navigation, ROUTES.SCORE_TAB, { screen: ROUTES.SCORE_READINESS });
  },

  toScoreInsights(navigation: NavDispatch) {
    navigateTab(navigation, ROUTES.SCORE_TAB, { screen: ROUTES.SCORE_INSIGHTS });
  },

  toLoanMarketplace(navigation: NavDispatch) {
    navigateTab(navigation, ROUTES.LOANS_TAB, { screen: ROUTES.LOAN_MARKETPLACE });
  },

  toLoanProduct(navigation: NavDispatch, productId: string) {
    const params: LoanProductParams = { productId };
    navigateTab(navigation, ROUTES.LOANS_TAB, {
      screen: ROUTES.LOAN_PRODUCT_DETAIL,
      params,
    });
  },

  toLoanApply(navigation: NavDispatch, productId: string) {
    const params: LoanProductParams = { productId };
    navigateTab(navigation, ROUTES.LOANS_TAB, {
      screen: ROUTES.LOAN_APPLY,
      params,
    });
  },

  toLoanStatus(navigation: NavDispatch, applicationId: string) {
    const params: LoanApplicationParams = { applicationId };
    navigateTab(navigation, ROUTES.LOANS_TAB, {
      screen: ROUTES.LOAN_STATUS,
      params,
    });
  },

  toProfileHub(navigation: NavDispatch) {
    navigateTab(navigation, ROUTES.PROFILE_TAB, { screen: ROUTES.PROFILE_HUB });
  },
} as const;

export const authNavigation = {
  toSignIn(navigation: AuthNavigation) {
    navigation.navigate(ROUTES.SIGN_IN);
  },

  toSignUpStep1(navigation: AuthNavigation) {
    navigation.navigate(ROUTES.SIGN_UP_STEP_1);
  },

  toForgotPassword(navigation: AuthNavigation) {
    navigation.navigate(ROUTES.FORGOT_PASSWORD);
  },

  toSignUpStep2(
    navigation: AuthNavigation,
    params: AuthStackParamList[typeof ROUTES.SIGN_UP_STEP_2]
  ) {
    navigation.navigate(ROUTES.SIGN_UP_STEP_2, params);
  },

  toAccountCreated(navigation: AuthNavigation) {
    navigation.replace(ROUTES.ACCOUNT_CREATED);
  },
} as const;
