import { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const typography = {
  h1: {
    fontSize: fontSize['3xl'],
    fontWeight: '700',
    lineHeight: fontSize['3xl'] * lineHeight.tight,
  } satisfies TextStyle,
  h2: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    lineHeight: fontSize['2xl'] * lineHeight.tight,
  } satisfies TextStyle,
  h3: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    lineHeight: fontSize.xl * lineHeight.tight,
  } satisfies TextStyle,
  body: {
    fontSize: fontSize.md,
    fontWeight: '400',
    lineHeight: fontSize.md * lineHeight.normal,
  } satisfies TextStyle,
  bodySmall: {
    fontSize: fontSize.sm,
    fontWeight: '400',
    lineHeight: fontSize.sm * lineHeight.normal,
  } satisfies TextStyle,
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    lineHeight: fontSize.sm * lineHeight.normal,
    letterSpacing: 0.3,
  } satisfies TextStyle,
  caption: {
    fontSize: fontSize.xs,
    fontWeight: '400',
    lineHeight: fontSize.xs * lineHeight.normal,
  } satisfies TextStyle,
  button: {
    fontSize: fontSize.md,
    fontWeight: '600',
    lineHeight: fontSize.md * lineHeight.tight,
  } satisfies TextStyle,
} as const;
