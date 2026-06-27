import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { ROUTES } from '../../constants/routes';
import { authNavigation } from '../../navigation/navigationActions';
import type { AuthScreenProps } from '@/types/navigation';
import { colors, spacing, borderRadius } from '../../theme';
import { Text } from '../../components/ui/Text';
import {
  AuthHeader,
  AuthInput,
  AuthPrimaryButton,
  ErrorBanner,
  OrDivider,
  SocialAuthButtons,
} from '../../components/auth';
import { useLoginMutation } from '../../hooks/useAuthMutations';
import { getErrorMessage } from '../../utils/errors';
import {
  hasErrors,
  SignInForm,
  validateSignInForm,
} from '../../utils/validation/authValidation';

type Props = AuthScreenProps<typeof ROUTES.SIGN_IN>;

export function SignInScreen({ navigation }: Props) {
  const loginMutation = useLoginMutation();
  const [form, setForm] = useState<SignInForm>({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof SignInForm, string>>>({});
  const [apiError, setApiError] = useState('');

  const updateField = <K extends keyof SignInForm>(key: K, value: SignInForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    setApiError('');
  };

  const handleSubmit = () => {
    const errors = validateSignInForm(form);
    setFieldErrors(errors);
    if (hasErrors(errors)) return;

    loginMutation.mutate(
      { email: form.email.trim().toLowerCase(), password: form.password },
      {
        onError: (error) => setApiError(getErrorMessage(error, 'Login failed')),
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
        <AuthHeader title="Sign In" subtitle="Welcome Back!" />

        <View style={styles.form}>
          <ErrorBanner message={apiError} />

          <AuthInput
            label="Email Address"
            placeholder="Enter Mail Address"
            value={form.email}
            onChangeText={(v) => updateField('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={fieldErrors.email}
          />

          <AuthInput
            label="Password"
            placeholder="Enter Your Password"
            value={form.password}
            onChangeText={(v) => updateField('password', v)}
            secureTextEntry
            error={fieldErrors.password}
            containerStyle={styles.fieldGap}
          />

          <Pressable
            onPress={() => authNavigation.toForgotPassword(navigation)}
            style={styles.forgot}
          >
            <Text variant="bodySmall" color={colors.primary}>
              Forgot Password?
            </Text>
          </Pressable>

          <AuthPrimaryButton
            title="Sign In"
            onPress={handleSubmit}
            loading={loginMutation.isPending}
            style={styles.submit}
          />

          <OrDivider />
          <SocialAuthButtons />

          <Pressable onPress={() => authNavigation.toSignUpStep1(navigation)} style={styles.footer}>
            <Text variant="bodySmall" color={colors.textSecondary} align="center">
              Don&apos;t Have An Account?{' '}
              <Text variant="bodySmall" color={colors.primary}>
                Sign Up
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
  fieldGap: { marginTop: spacing.lg },
  forgot: { alignSelf: 'flex-end', marginTop: spacing.sm },
  submit: { marginTop: spacing.xl },
  footer: { marginTop: spacing.xl },
});
