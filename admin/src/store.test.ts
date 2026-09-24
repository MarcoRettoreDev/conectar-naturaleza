import { afterEach, describe, expect, it, vi } from 'vitest';
import { useFinanceStore } from './store';
import type { Expense, Reservation } from './types';

const supabase = vi.hoisted(() => ({
  from: vi.fn(),
}));
vi.mock('./lib/supabase', () => ({ supabase }));

const reservation: Reservation = { id: 'reservation-1', checkIn: '2026-09-10', checkOut: '2026-09-11', passenger: 'Ana', guests: 1, platform: 'particular', phone: '', total: 100, paid: 0 };
const expense: Expense = { id: 'expense-1', date: '2026-09-10', kind: 'variable', category: 'luz', description: '', amount: 20 };

const successfulQuery = (result: { error: unknown } = { error: null }) => {
  const selectQuery = {
    select: vi.fn(),
    eq: vi.fn(),
    order: vi.fn().mockResolvedValue({ data: [], error: null }),
  };
  selectQuery.select.mockReturnValue(selectQuery);
  selectQuery.eq.mockReturnValue(selectQuery);
  return {
    insert: vi.fn().mockResolvedValue(result),
    update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue(result) }),
    delete: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue(result) }),
    ...selectQuery,
  };
};

afterEach(() => {
  vi.clearAllMocks();
  useFinanceStore.getState().clear();
});

describe('finance store', () => {
  it('updates existing movements without changing their ids', async () => {
    supabase.from.mockImplementation(() => successfulQuery());
    useFinanceStore.setState({ userId: 'user-1' });
    await useFinanceStore.getState().addReservation(reservation);
    await useFinanceStore.getState().addExpense(expense);
    await useFinanceStore.getState().updateReservation({ ...reservation, passenger: 'Bruno' });
    await useFinanceStore.getState().updateExpense({ ...expense, amount: 35 });

    expect(useFinanceStore.getState().reservations).toEqual([{ ...reservation, passenger: 'Bruno' }]);
    expect(useFinanceStore.getState().expenses).toEqual([{ ...expense, amount: 35 }]);
    expect(supabase.from).toHaveBeenCalledWith('reservations');
    expect(supabase.from).toHaveBeenCalledWith('expenses');
  });

  it('surfaces remote failures without requiring a live Supabase connection', async () => {
    supabase.from.mockImplementation(() => successfulQuery({ error: new Error('network unavailable') }));
    useFinanceStore.setState({ userId: 'user-1' });

    await expect(useFinanceStore.getState().addExpense(expense)).rejects.toThrow('network unavailable');
    expect(useFinanceStore.getState().error).toBe('network unavailable');
  });
});
