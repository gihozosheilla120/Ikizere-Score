import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { colors, typography } from '../../theme';

type TextVariant = keyof typeof typography;

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: TextStyle['textAlign'];
}

export function Text({
  variant = 'body',
  color = colors.text,
  align,
  style,
  children,
  ...rest
}: TextProps) {
  return (
    <RNText
      style={[typography[variant], { color, textAlign: align }, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

export const textStyles = StyleSheet.create({
  muted: { color: colors.textSecondary },
});
