import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';
import type { AuthStackParamList } from '@/types/navigation';
import { useAuth } from '../context';
import { defaultStackScreenOptions } from './screenOptions';
import {
  AccountCreatedScreen,
  ForgotPasswordScreen,
  OnboardingScreen,
  ResetPasswordScreen,
  SignInScreen,
  SignUpStep1Screen,
  SignUpStep2Screen,
  SplashScreen,
} from '../screens';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  const { status } = useAuth();
  const initialRouteName =
    status === 'account_created' ? ROUTES.ACCOUNT_CREATED : ROUTES.SPLASH;

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={defaultStackScreenOptions}
    >
      <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
      <Stack.Screen name={ROUTES.ONBOARDING} component={OnboardingScreen} />
      <Stack.Screen name={ROUTES.SIGN_IN} component={SignInScreen} />
      <Stack.Screen name={ROUTES.SIGN_UP_STEP_1} component={SignUpStep1Screen} />
      <Stack.Screen name={ROUTES.SIGN_UP_STEP_2} component={SignUpStep2Screen} />
      <Stack.Screen name={ROUTES.ACCOUNT_CREATED} component={AccountCreatedScreen} />
      <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
      <Stack.Screen name={ROUTES.RESET_PASSWORD} component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
