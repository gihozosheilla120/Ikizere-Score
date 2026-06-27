import React, { useState } from 'react';
import {
  View,
  Modal,
  Pressable,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../../theme';
import { Text } from '../ui';
import type { RecordCategory } from '@/types/models';

interface CategorySelectProps {
  value: string;
  categories: RecordCategory[];
  onChange: (slug: string) => void;
  error?: string;
  loading?: boolean;
}

export function CategorySelect({
  value,
  categories,
  onChange,
  error,
  loading,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const selected = categories.find((c) => c.slug === value);

  return (
    <View style={styles.wrap}>
      <Text variant="label" color={colors.textSecondary}>
        Category
      </Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.trigger, error ? styles.triggerError : null]}
      >
        <Text variant="body" color={selected ? colors.text : colors.textMuted}>
          {loading ? 'Loading categories...' : selected?.name ?? 'Select a category'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
      </Pressable>
      {error ? (
        <Text variant="caption" color={colors.error}>
          {error}
        </Text>
      ) : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.sheet}>
                <Text variant="h3" style={styles.sheetTitle}>
                  Category
                </Text>
                <FlatList
                  data={categories}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.option}
                      onPress={() => {
                        onChange(item.slug);
                        setOpen(false);
                      }}
                    >
                      <Text variant="body">{item.name}</Text>
                      {value === item.slug ? (
                        <Ionicons name="checkmark" size={18} color={colors.primary} />
                      ) : null}
                    </Pressable>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  trigger: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  triggerError: { borderColor: colors.error },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '55%',
    padding: spacing.lg,
  },
  sheetTitle: { marginBottom: spacing.md },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
});
