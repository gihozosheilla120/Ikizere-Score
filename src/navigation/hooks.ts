import { useNavigation } from '@react-navigation/native';
import type {
  AddRecordNavigationProp,
  AuthNavigationProp,
  HomeDashboardNavigationProp,
  LoanMarketplaceNavigationProp,
  MainTabNavigationProp,
  RecordsListNavigationProp,
  ScoreInsightsNavigationProp,
} from '../types/navigation';

export function useMainTabNavigation() {
  return useNavigation<MainTabNavigationProp>();
}

export function useHomeDashboardNavigation() {
  return useNavigation<HomeDashboardNavigationProp>();
}

export function useRecordsListNavigation() {
  return useNavigation<RecordsListNavigationProp>();
}

export function useAddRecordNavigation() {
  return useNavigation<AddRecordNavigationProp>();
}

export function useScoreInsightsNavigation() {
  return useNavigation<ScoreInsightsNavigationProp>();
}

export function useLoanMarketplaceNavigation() {
  return useNavigation<LoanMarketplaceNavigationProp>();
}

export function useAuthNavigation() {
  return useNavigation<AuthNavigationProp>();
}
