import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';
import type { HomeStackParamList } from '../types/navigation';
import { defaultStackScreenOptions } from './screenOptions';
import { HomeDashboardScreen, VerificationInProgressScreen } from '../screens';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.HOME_DASHBOARD}
      screenOptions={defaultStackScreenOptions}
    >
      <Stack.Screen name={ROUTES.HOME_DASHBOARD} component={HomeDashboardScreen} />
      <Stack.Screen
        name={ROUTES.VERIFICATION_IN_PROGRESS}
        component={VerificationInProgressScreen}
      />
    </Stack.Navigator>
  );
}
