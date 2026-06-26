import type { RecordType, Currency } from '../types/models';

export type RecordFilterTab = 'all' | RecordType;

export const RECORD_FILTER_TABS: { key: RecordFilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expenses' },
  { key: 'savings', label: 'Savings' },
];

export const RECORD_TYPE_FORM_TABS: { key: RecordType; label: string }[] = [
  { key: 'income', label: 'Add Income' },
  { key: 'expense', label: 'Add Expense' },
  { key: 'savings', label: 'Add Savings' },
];

export const CURRENCY_OPTIONS: { label: string; value: Currency }[] = [
  { label: 'RWF', value: 'RWF' },
  { label: 'USD', value: 'USD' },
  { label: 'TZS', value: 'TZS' },
];

export const RECORD_TYPE_META: Record<
  RecordType,
  { color: string; bg: string; icon: 'cash-outline' | 'cart-outline' | 'wallet-outline' }
> = {
  income: { color: '#16A34A', bg: '#DCFCE7', icon: 'cash-outline' },
  expense: { color: '#DC2626', bg: '#FEE2E2', icon: 'cart-outline' },
  savings: { color: '#2563EB', bg: '#DBEAFE', icon: 'wallet-outline' },
};

export const DEFAULT_LIST_LIMIT = 20;
