import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';
import type { ProfileStackParamList } from '@/types/navigation';
import { defaultStackScreenOptions } from './screenOptions';
import {
  BusinessProfileScreen,
  HelpCenterScreen,
  LanguageScreen,
  PersonalInfoScreen,
  ProfileHubScreen,
  SecurityScreen,
  VerificationScreen,
} from '../screens';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.PROFILE_HUB}
      screenOptions={defaultStackScreenOptions}
    >
      <Stack.Screen name={ROUTES.PROFILE_HUB} component={ProfileHubScreen} />
      <Stack.Screen name={ROUTES.BUSINESS_PROFILE} component={BusinessProfileScreen} />
      <Stack.Screen name={ROUTES.VERIFICATION} component={VerificationScreen} />
      <Stack.Screen name={ROUTES.PERSONAL_INFO} component={PersonalInfoScreen} />
      <Stack.Screen name={ROUTES.SECURITY} component={SecurityScreen} />
      <Stack.Screen name={ROUTES.LANGUAGE} component={LanguageScreen} />
      <Stack.Screen name={ROUTES.HELP_CENTER} component={HelpCenterScreen} />
    </Stack.Navigator>
  );
}
