import { monthOf } from './calculations';
import type { Expense, Platform, Reservation } from '../types';

export type HistoryMonth = 'all' | string;
export type ReservationPlatformFilter = 'all' | Platform;

export const historyMonths = (reservations: Reservation[], expenses: Expense[]): string[] => {
  const months = new Set([...reservations.map((reservation) => monthOf(reservation.checkIn)), ...expenses.map((expense) => monthOf(expense.date))]);
  return [...months].filter(Boolean).sort((a, b) => b.localeCompare(a));
};

export const formatHistoryMonth = (month: string, locale = 'es-ES'): string => {
  const date = new Date(`${month}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) return month;
  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
  return `${monthLabel.charAt(0).toLocaleUpperCase(locale) + monthLabel.slice(1)} ${month.slice(0, 4)}`;
};

const newestFirst = <T>(items: T[], dateOf: (item: T) => string): T[] => (
  items.map((item, index) => ({ item, index }))
    .sort((a, b) => dateOf(b.item).localeCompare(dateOf(a.item)) || a.index - b.index)
    .map(({ item }) => item)
);

export const filterReservations = (
  reservations: Reservation[],
  month: HistoryMonth,
  platform: ReservationPlatformFilter,
  passengerSearch: string,
): Reservation[] => {
  const query = passengerSearch.trim().toLocaleLowerCase();
  return newestFirst(reservations.filter((reservation) => (
    (month === 'all' || monthOf(reservation.checkIn) === month)
    && (platform === 'all' || reservation.platform === platform)
    && (!query || reservation.passenger.toLocaleLowerCase().includes(query))
  )), (reservation) => reservation.checkIn);
};

export const filterExpenses = (expenses: Expense[], month: HistoryMonth): Expense[] => (
  newestFirst(month === 'all' ? expenses : expenses.filter((expense) => monthOf(expense.date) === month), (expense) => expense.date)
);
