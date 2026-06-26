import type { FinancialRecord } from '../types/models';

export function getDateSectionKey(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const monthDay = date
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    .toUpperCase();

  if (date >= startOfToday) return `TODAY, ${monthDay}`;
  if (date >= startOfYesterday) return `YESTERDAY, ${monthDay}`;

  return date
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    .toUpperCase();
}

export type RecordSection = {
  title: string;
  data: FinancialRecord[];
};

export function groupRecordsByDate(records: FinancialRecord[]): RecordSection[] {
  const map = new Map<string, FinancialRecord[]>();

  records.forEach((record) => {
    const key = getDateSectionKey(record.transactionDate);
    const existing = map.get(key) ?? [];
    existing.push(record);
    map.set(key, existing);
  });

  return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
}

export function getCurrentMonthParams() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
}
