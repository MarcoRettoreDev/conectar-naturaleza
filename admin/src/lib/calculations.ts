import type { Expense, Reservation } from '../types';

export const nightsBetween = (checkIn: string, checkOut: string): number => {
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000));
};
export const balance = (total: number, paid: number) => Math.max(0, total - paid);
export const median = (values: number[]): number => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};
export const monthOf = (date: string) => date.slice(0, 7);
export const monthSummary = (reservations: Reservation[], expenses: Expense[], month: string) => {
  const stays = reservations.filter((r) => monthOf(r.checkIn) === month);
  const costs = expenses.filter((e) => monthOf(e.date) === month);
  const nights = stays.map((r) => nightsBetween(r.checkIn, r.checkOut));
  const platform = stays.reduce<Record<string, number>>((counts, r) => ({ ...counts, [r.platform]: (counts[r.platform] ?? 0) + 1 }), {});
  const mostUsedPlatform = Object.entries(platform).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  const income = stays.reduce((sum, r) => sum + r.total, 0);
  const expenseTotal = costs.reduce((sum, e) => sum + e.amount, 0);
  return { income, expenses: expenseTotal, result: income - expenseTotal, guests: stays.reduce((sum, r) => sum + r.guests, 0), totalNights: nights.reduce((sum, n) => sum + n, 0), averageNights: nights.length ? nights.reduce((sum, n) => sum + n, 0) / nights.length : 0, medianNights: median(nights), mostUsedPlatform };
};
