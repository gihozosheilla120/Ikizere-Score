import { colors } from './colors';
import { typography, fontSize } from './typography';
import { spacing, borderRadius, layout } from './spacing';
import { shadows } from './shadows';

export const theme = {
  colors,
  typography,
  fontSize,
  spacing,
  borderRadius,
  layout,
  shadows,
} as const;

export type Theme = typeof theme;

export { colors, typography, fontSize, spacing, borderRadius, layout, shadows };
