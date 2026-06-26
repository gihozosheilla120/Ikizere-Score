const E164_REGEX = /^\+[1-9]\d{7,14}$/;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export interface SignUpStep1Form {
  email: string;
  fullName: string;
  phoneNumber: string;
  nationalId: string;
}

export interface SignUpStep2Form {
  businessType: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface SignInForm {
  email: string;
  password: string;
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function validateSignInForm(values: SignInForm): FieldErrors<SignInForm> {
  const errors: FieldErrors<SignInForm> = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  }

  return errors;
}

export function validateSignUpStep1(values: SignUpStep1Form): FieldErrors<SignUpStep1Form> {
  const errors: FieldErrors<SignUpStep1Form> = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!E164_REGEX.test(values.phoneNumber.trim())) {
    errors.phoneNumber = 'Use E.164 format (e.g. +250788000000)';
  }

  if (!values.nationalId.trim()) {
    errors.nationalId = 'National ID is required';
  } else if (values.nationalId.trim().length < 5) {
    errors.nationalId = 'Enter a valid national ID';
  }

  return errors;
}

export function validateSignUpStep2(values: SignUpStep2Form): FieldErrors<SignUpStep2Form> {
  const errors: FieldErrors<SignUpStep2Form> = {};

  if (!values.businessType) {
    errors.businessType = 'Select your business type';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms and conditions';
  }

  return errors;
}

export function hasErrors<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
