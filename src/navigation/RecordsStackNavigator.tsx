import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';
import type { RecordsStackParamList } from '../types/navigation';
import { defaultStackScreenOptions } from './screenOptions';
import {
  AddRecordScreen,
  RecordDetailScreen,
  RecordSavedScreen,
  RecordsListScreen,
} from '../screens';

const Stack = createNativeStackNavigator<RecordsStackParamList>();

export function RecordsStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.RECORDS_LIST}
      screenOptions={defaultStackScreenOptions}
    >
      <Stack.Screen name={ROUTES.RECORDS_LIST} component={RecordsListScreen} />
      <Stack.Screen name={ROUTES.ADD_RECORD} component={AddRecordScreen} />
      <Stack.Screen name={ROUTES.RECORD_SAVED} component={RecordSavedScreen} />
      <Stack.Screen name={ROUTES.RECORD_DETAIL} component={RecordDetailScreen} />
    </Stack.Navigator>
  );
}
