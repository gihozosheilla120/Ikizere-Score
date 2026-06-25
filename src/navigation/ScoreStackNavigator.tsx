import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';
import type { ScoreStackParamList } from '../types/navigation';
import { defaultStackScreenOptions } from './screenOptions';
import { ScoreInsightsScreen, ScoreReadinessScreen } from '../screens';

const Stack = createNativeStackNavigator<ScoreStackParamList>();

export function ScoreStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.SCORE_READINESS}
      screenOptions={defaultStackScreenOptions}
    >
      <Stack.Screen name={ROUTES.SCORE_READINESS} component={ScoreReadinessScreen} />
      <Stack.Screen name={ROUTES.SCORE_INSIGHTS} component={ScoreInsightsScreen} />
    </Stack.Navigator>
  );
}
