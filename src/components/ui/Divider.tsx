import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';

interface DividerProps {
  style?: import('react-native').ViewStyle;
}

export function Divider({ style }: DividerProps = {}) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
});
