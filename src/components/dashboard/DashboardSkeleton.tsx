import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { Card } from '../ui';

export function DashboardSkeleton() {
  return (
    <View style={styles.wrap}>
      <View style={styles.header} />
      <Card style={styles.score}>
        <ActivityIndicator color={colors.primary} size="large" />
      </Card>
      <View style={styles.actions} />
      <Card style={styles.block} />
      <View style={styles.grid}>
        <Card style={styles.tile} />
        <Card style={styles.tile} />
        <Card style={styles.tile} />
        <Card style={styles.tile} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  header: {
    height: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  score: {
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    height: 88,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  block: { minHeight: 180 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tile: {
    width: '47%',
    minHeight: 100,
  },
});
