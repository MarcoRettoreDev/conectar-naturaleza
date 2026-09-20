import { monthOf } from './calculations';
import type { Expense, Platform, Reservation } from '../types';

export type HistoryMonth = 'all' | string;
export type ReservationPlatformFilter = 'all' | Platform;

export const historyMonths = (reservations: Reservation[], expenses: Expense[]): string[] => {
  const months = new Set([...reservations.map((reservation) => monthOf(reservation.checkIn)), ...expenses.map((expense) => monthOf(expense.date))]);
  return [...months].filter(Boolean).sort((a, b) => b.localeCompare(a));
};

export const filterReservations = (
  reservations: Reservation[],
  month: HistoryMonth,
  platform: ReservationPlatformFilter,
  passengerSearch: string,
): Reservation[] => {
  const query = passengerSearch.trim().toLocaleLowerCase();
  return reservations.filter((reservation) => (
    (month === 'all' || monthOf(reservation.checkIn) === month)
    && (platform === 'all' || reservation.platform === platform)
    && (!query || reservation.passenger.toLocaleLowerCase().includes(query))
  ));
};

export const filterExpenses = (expenses: Expense[], month: HistoryMonth): Expense[] => (
  month === 'all' ? expenses : expenses.filter((expense) => monthOf(expense.date) === month)
);
