import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from '../../constants/routes';
import type { AuthStackParamList } from '../../types/navigation';
import { colors, spacing, borderRadius } from '../../theme';
import { Text } from '../../components/ui/Text';
import { AuthHeader, AuthInput, AuthPrimaryButton } from '../../components/auth';
import {
  SignUpStep1Form,
  hasErrors,
  validateSignUpStep1,
} from '../../utils/validation/authValidation';

type Props = NativeStackScreenProps<AuthStackParamList, typeof ROUTES.SIGN_UP_STEP_1>;

export function SignUpStep1Screen({ navigation }: Props) {
  const [form, setForm] = useState<SignUpStep1Form>({
    email: '',
    fullName: '',
    phoneNumber: '',
    nationalId: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof SignUpStep1Form, string>>>({});

  const updateField = <K extends keyof SignUpStep1Form>(key: K, value: SignUpStep1Form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleContinue = () => {
    const errors = validateSignUpStep1(form);
    setFieldErrors(errors);
    if (hasErrors(errors)) return;

    navigation.navigate(ROUTES.SIGN_UP_STEP_2, {
      email: form.email.trim().toLowerCase(),
      fullName: form.fullName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      nationalId: form.nationalId.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <AuthHeader
          title="Sign Up"
          subtitle="Create Account"
          step={1}
          totalSteps={2}
        />

        <View style={styles.form}>
          <Text variant="h3" color={colors.primary} style={styles.sectionTitle}>
            Personal Details
          </Text>
          <Text variant="bodySmall" color={colors.textSecondary} style={styles.sectionDesc}>
            Let&apos;s start by getting to know you better.
          </Text>

          <AuthInput
            label="Full Name"
            placeholder="Enter your full name"
            leftIcon="person-outline"
            value={form.fullName}
            onChangeText={(v) => updateField('fullName', v)}
            error={fieldErrors.fullName}
          />

          <AuthInput
            label="Email Address"
            placeholder="Enter your email"
            leftIcon="mail-outline"
            value={form.email}
            onChangeText={(v) => updateField('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={fieldErrors.email}
            containerStyle={styles.fieldGap}
          />

          <AuthInput
            label="Phone Number"
            placeholder="Enter your number"
            leftIcon="phone-portrait-outline"
            value={form.phoneNumber}
            onChangeText={(v) => updateField('phoneNumber', v)}
            keyboardType="phone-pad"
            error={fieldErrors.phoneNumber}
            containerStyle={styles.fieldGap}
          />

          <AuthInput
            label="National ID"
            placeholder="Enter ID number"
            leftIcon="card-outline"
            value={form.nationalId}
            onChangeText={(v) => updateField('nationalId', v)}
            error={fieldErrors.nationalId}
            containerStyle={styles.fieldGap}
          />

          <AuthPrimaryButton
            title="Continue"
            onPress={handleContinue}
            showArrow
            style={styles.submit}
          />

          <Pressable onPress={() => navigation.navigate(ROUTES.SIGN_IN)} style={styles.footer}>
            <Text variant="bodySmall" color={colors.textSecondary} align="center">
              Already Have An Account?{' '}
              <Text variant="bodySmall" color={colors.primary}>
                Log In
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.surface },
  scroll: { flexGrow: 1 },
  form: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    marginTop: -spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['3xl'],
  },
  sectionTitle: { marginBottom: spacing.xs },
  sectionDesc: { marginBottom: spacing.xl },
  fieldGap: { marginTop: spacing.lg },
  submit: { marginTop: spacing['2xl'] },
  footer: { marginTop: spacing.xl },
});
