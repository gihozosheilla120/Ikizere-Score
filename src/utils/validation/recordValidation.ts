import type { Currency, RecordType } from '../../types/models';

export interface CreateRecordForm {
  type: RecordType;
  category: string;
  amount: string;
  currency: Currency;
  transactionDate: string;
  description: string;
  tags: string;
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function validateCreateRecordForm(values: CreateRecordForm): FieldErrors<CreateRecordForm> {
  const errors: FieldErrors<CreateRecordForm> = {};

  if (!values.category) {
    errors.category = 'Select a category';
  }

  const amount = Number(values.amount);
  if (!values.amount.trim()) {
    errors.amount = 'Amount is required';
  } else if (Number.isNaN(amount) || amount <= 0) {
    errors.amount = 'Enter a valid amount greater than 0';
  } else if (amount > 999999999) {
    errors.amount = 'Amount is too large';
  }

  if (!values.transactionDate.trim()) {
    errors.transactionDate = 'Date is required';
  } else if (!ISO_DATE_REGEX.test(values.transactionDate.trim())) {
    errors.transactionDate = 'Use YYYY-MM-DD format';
  } else if (Number.isNaN(Date.parse(values.transactionDate))) {
    errors.transactionDate = 'Enter a valid date';
  }

  if (values.description.length > 500) {
    errors.description = 'Description must be 500 characters or less';
  }

  const tags = parseTags(values.tags);
  if (tags.some((tag) => tag.length > 30)) {
    errors.tags = 'Each tag must be 30 characters or less';
  }
  if (tags.length > 10) {
    errors.tags = 'Maximum 10 tags allowed';
  }

  return errors;
}

export function hasErrors<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}

export function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function toIsoDateTime(date: string): string {
  const parsed = new Date(`${date}T12:00:00.000Z`);
  return parsed.toISOString();
}

export function formatInputDate(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDisplayDate(isoDate: string): string {
  const date = new Date(isoDate);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

export function categoryLabel(slug: string): string {
  return slug
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
