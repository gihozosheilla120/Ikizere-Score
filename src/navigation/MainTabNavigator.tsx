import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../constants/routes';
import type { MainTabParamList } from '@/types/navigation';
import { colors, layout } from '../theme';
import { defaultTabScreenOptions } from './screenOptions';
import { HomeStackNavigator } from './HomeStackNavigator';
import { RecordsStackNavigator } from './RecordsStackNavigator';
import { ScoreStackNavigator } from './ScoreStackNavigator';
import { LoansStackNavigator } from './LoansStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconName = keyof typeof Ionicons.glyphMap;

const tabIcons: Record<keyof MainTabParamList, { active: TabIconName; inactive: TabIconName }> = {
  [ROUTES.HOME_TAB]: { active: 'home', inactive: 'home-outline' },
  [ROUTES.RECORDS_TAB]: { active: 'document-text', inactive: 'document-text-outline' },
  [ROUTES.SCORE_TAB]: { active: 'speedometer', inactive: 'speedometer-outline' },
  [ROUTES.LOANS_TAB]: { active: 'business', inactive: 'business-outline' },
  [ROUTES.PROFILE_TAB]: { active: 'person', inactive: 'person-outline' },
};

const tabLabels: Record<keyof MainTabParamList, string> = {
  [ROUTES.HOME_TAB]: 'Home',
  [ROUTES.RECORDS_TAB]: 'Records',
  [ROUTES.SCORE_TAB]: 'Score',
  [ROUTES.LOANS_TAB]: 'Loans',
  [ROUTES.PROFILE_TAB]: 'Profile',
};

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={ROUTES.HOME_TAB}
      screenOptions={({ route }) => ({
        ...defaultTabScreenOptions,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          height: layout.tabBarHeight,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabel: tabLabels[route.name],
        tabBarIcon: ({ focused, color, size }) => {
          const icons = tabIcons[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name={ROUTES.HOME_TAB} component={HomeStackNavigator} />
      <Tab.Screen name={ROUTES.RECORDS_TAB} component={RecordsStackNavigator} />
      <Tab.Screen name={ROUTES.SCORE_TAB} component={ScoreStackNavigator} />
      <Tab.Screen name={ROUTES.LOANS_TAB} component={LoansStackNavigator} />
      <Tab.Screen name={ROUTES.PROFILE_TAB} component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}
