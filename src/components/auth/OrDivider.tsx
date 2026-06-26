import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';
import { Text } from '../ui/Text';

export function OrDivider() {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text variant="caption" color={colors.textMuted} style={styles.label}>
        OR
      </Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  label: { marginHorizontal: spacing.md },
});
