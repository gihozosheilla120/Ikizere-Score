import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';
import type { RootStackParamList } from '@/types/navigation';
import { useAuth } from '../context';
import { colors } from '../theme';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { defaultStackScreenOptions } from './screenOptions';

const Stack = createNativeStackNavigator<RootStackParamList>();

function NavigationGate() {
  const { status, isAuthenticated } = useAuth();

  if (status === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={defaultStackScreenOptions}>
      {isAuthenticated ? (
        <Stack.Screen name={ROUTES.MAIN} component={MainTabNavigator} />
      ) : (
        <Stack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <NavigationGate />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
