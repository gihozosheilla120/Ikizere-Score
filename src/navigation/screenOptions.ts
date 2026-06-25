import { colors } from '../theme';

export const defaultStackScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background },
} as const;

export const defaultTabScreenOptions = {
  headerShown: false,
} as const;
