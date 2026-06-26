import type { Currency } from '../types/models';

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function formatCurrency(amount: number, currency: Currency | string = 'RWF'): string {
  if (currency === 'RWF') {
    return `RWF ${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  }
}

export function formatSignedCurrency(amount: number, currency: Currency | string = 'RWF'): string {
  const prefix = amount >= 0 ? '+' : '-';
  return `${prefix}${formatCurrency(Math.abs(amount), currency)}`;
}

export function formatRecordDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  if (date >= startOfToday) {
    return `Today, ${time}`;
  }
  if (date >= startOfYesterday) {
    return `Yesterday, ${time}`;
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRatingLabel(rating: string): string {
  return rating.replace(/_/g, ' ').toUpperCase();
}
