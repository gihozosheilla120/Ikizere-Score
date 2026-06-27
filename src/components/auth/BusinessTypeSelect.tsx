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
import { BUSINESS_TYPE_OPTIONS } from '../../constants/auth';
import { colors, borderRadius, spacing } from '../../theme';
import { Text } from '../ui/Text';
import type { BusinessType } from '@/types/models';

interface BusinessTypeSelectProps {
  value: BusinessType | '';
  onChange: (value: BusinessType) => void;
  error?: string;
}

export function BusinessTypeSelect({ value, onChange, error }: BusinessTypeSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = BUSINESS_TYPE_OPTIONS.find((o) => o.value === value);

  return (
    <View>
      <Text variant="label" color={colors.text} style={styles.label}>
        Business Type
      </Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.trigger, error ? styles.triggerError : null]}
      >
        <Ionicons name="storefront-outline" size={18} color={colors.textMuted} />
        <Text
          variant="body"
          color={selected ? colors.text : colors.textMuted}
          style={styles.triggerText}
        >
          {selected?.label ?? 'Select type'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
      </Pressable>
      {error ? (
        <Text variant="caption" color={colors.error} style={styles.error}>
          {error}
        </Text>
      ) : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.sheet}>
                <Text variant="h3" style={styles.sheetTitle}>
                  Business Type
                </Text>
                <FlatList
                  data={BUSINESS_TYPE_OPTIONS}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.option}
                      onPress={() => {
                        onChange(item.value);
                        setOpen(false);
                      }}
                    >
                      <Text variant="body">{item.label}</Text>
                      {value === item.value ? (
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
  label: { marginBottom: spacing.sm },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    minHeight: 52,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  triggerError: { borderColor: colors.error },
  triggerText: { flex: 1 },
  error: { marginTop: spacing.xs },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '60%',
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
