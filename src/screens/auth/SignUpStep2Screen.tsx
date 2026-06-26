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
import type { BusinessType } from '../../types/models';
import { colors, spacing, borderRadius } from '../../theme';
import { Text } from '../../components/ui/Text';
import {
  AuthHeader,
  AuthInput,
  AuthPrimaryButton,
  BusinessTypeSelect,
  ErrorBanner,
  TermsCheckbox,
} from '../../components/auth';
import { useRegisterMutation } from '../../hooks/useAuthMutations';
import { getErrorMessage } from '../../utils/errors';
import {
  SignUpStep2Form,
  hasErrors,
  validateSignUpStep2,
} from '../../utils/validation/authValidation';

type Props = NativeStackScreenProps<AuthStackParamList, typeof ROUTES.SIGN_UP_STEP_2>;

export function SignUpStep2Screen({ navigation, route }: Props) {
  const registerMutation = useRegisterMutation();
  const { email, fullName, phoneNumber, nationalId } = route.params;

  const [form, setForm] = useState<SignUpStep2Form>({
    businessType: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof SignUpStep2Form, string>>>({});
  const [apiError, setApiError] = useState('');

  const updateField = <K extends keyof SignUpStep2Form>(key: K, value: SignUpStep2Form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    setApiError('');
  };

  const handleCreateAccount = () => {
    const errors = validateSignUpStep2(form);
    setFieldErrors(errors);
    if (hasErrors(errors)) return;

    registerMutation.mutate(
      {
        email,
        fullName,
        phoneNumber,
        nationalId,
        businessType: form.businessType as BusinessType,
        password: form.password,
        confirmPassword: form.confirmPassword,
        acceptTerms: form.acceptTerms,
      },
      {
        onSuccess: () => navigation.replace(ROUTES.ACCOUNT_CREATED),
        onError: (error) => setApiError(getErrorMessage(error, 'Registration failed')),
      }
    );
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
          step={2}
          totalSteps={2}
          showBack
          onBack={() => navigation.goBack()}
        />

        <View style={styles.form}>
          <Text variant="h3" color={colors.primary} style={styles.sectionTitle}>
            Other details
          </Text>

          <ErrorBanner message={apiError} />

          <BusinessTypeSelect
            value={form.businessType as BusinessType | ''}
            onChange={(value) => updateField('businessType', value)}
            error={fieldErrors.businessType}
          />

          <AuthInput
            label="Password"
            placeholder="Enter password"
            leftIcon="lock-closed-outline"
            value={form.password}
            onChangeText={(v) => updateField('password', v)}
            secureTextEntry
            error={fieldErrors.password}
            containerStyle={styles.fieldGap}
          />

          <AuthInput
            label="Confirm Password"
            placeholder="Confirm password"
            leftIcon="shield-checkmark-outline"
            value={form.confirmPassword}
            onChangeText={(v) => updateField('confirmPassword', v)}
            secureTextEntry
            error={fieldErrors.confirmPassword}
            containerStyle={styles.fieldGap}
          />

          <TermsCheckbox
            checked={form.acceptTerms}
            onToggle={() => updateField('acceptTerms', !form.acceptTerms)}
            error={fieldErrors.acceptTerms}
          />

          <AuthPrimaryButton
            title="Create Account"
            onPress={handleCreateAccount}
            loading={registerMutation.isPending}
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
  sectionTitle: { marginBottom: spacing.xl },
  fieldGap: { marginTop: spacing.lg },
  submit: { marginTop: spacing['2xl'] },
  footer: { marginTop: spacing.xl },
});
