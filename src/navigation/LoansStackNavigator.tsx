import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';
import type { LoansStackParamList } from '../types/navigation';
import { defaultStackScreenOptions } from './screenOptions';
import {
  ApplicationReceivedScreen,
  LoanApplicationsListScreen,
  LoanApplyScreen,
  LoanMarketplaceScreen,
  LoanProductDetailScreen,
  LoanStatusScreen,
} from '../screens';

const Stack = createNativeStackNavigator<LoansStackParamList>();

export function LoansStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.LOAN_MARKETPLACE}
      screenOptions={defaultStackScreenOptions}
    >
      <Stack.Screen name={ROUTES.LOAN_MARKETPLACE} component={LoanMarketplaceScreen} />
      <Stack.Screen name={ROUTES.LOAN_PRODUCT_DETAIL} component={LoanProductDetailScreen} />
      <Stack.Screen name={ROUTES.LOAN_APPLY} component={LoanApplyScreen} />
      <Stack.Screen name={ROUTES.APPLICATION_RECEIVED} component={ApplicationReceivedScreen} />
      <Stack.Screen name={ROUTES.LOAN_STATUS} component={LoanStatusScreen} />
      <Stack.Screen
        name={ROUTES.LOAN_APPLICATIONS_LIST}
        component={LoanApplicationsListScreen}
      />
    </Stack.Navigator>
  );
}
