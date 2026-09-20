import { describe, expect, it } from 'vitest';
import { filterExpenses, filterReservations, historyMonths } from './history';
import type { Expense, Reservation } from '../types';

const reservations: Reservation[] = [
  { id: '1', checkIn: '2025-05-10', checkOut: '2025-05-12', passenger: 'Ana Pérez', guests: 2, platform: 'booking', phone: '', total: 100, paid: 100 },
  { id: '2', checkIn: '2025-04-10', checkOut: '2025-04-11', passenger: 'Bruno', guests: 1, platform: 'airbnb', phone: '', total: 80, paid: 0 },
];
const expenses: Expense[] = [{ id: '3', date: '2025-04-02', kind: 'variable', category: 'luz', description: '', amount: 20 }];

describe('history filters', () => {
  it('offers descending months and an all-months view can preserve every record', () => {
    expect(historyMonths(reservations, expenses)).toEqual(['2025-05', '2025-04']);
    expect(filterReservations(reservations, 'all', 'all', '')).toHaveLength(2);
    expect(filterExpenses(expenses, 'all')).toHaveLength(1);
  });

  it('combines month, platform, and passenger filters', () => {
    expect(filterReservations(reservations, '2025-05', 'booking', '  PÉREZ ')).toEqual([reservations[0]]);
    expect(filterReservations(reservations, '2025-05', 'airbnb', '')).toEqual([]);
  });
});
