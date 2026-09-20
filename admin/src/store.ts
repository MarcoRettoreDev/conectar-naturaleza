import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Expense, FinanceState, Reservation } from './types';
import { isFinanceState } from './lib/validation';

interface Actions { addReservation: (reservation: Reservation) => void; addExpense: (expense: Expense) => void; removeReservation: (id: string) => void; removeExpense: (id: string) => void; }
const emptyState: FinanceState = { reservations: [], expenses: [] };

export const useFinanceStore = create<FinanceState & Actions>()(persist((set) => ({
  ...emptyState,
  addReservation: (reservation) => set((state) => ({ reservations: [reservation, ...state.reservations] })),
  addExpense: (expense) => set((state) => ({ expenses: [expense, ...state.expenses] })),
  removeReservation: (id) => set((state) => ({ reservations: state.reservations.filter((item) => item.id !== id) })),
  removeExpense: (id) => set((state) => ({ expenses: state.expenses.filter((item) => item.id !== id) })),
}), {
  name: 'conectar-naturaleza-finances',
  version: 1,
  migrate: (persisted) => isFinanceState(persisted) ? persisted : emptyState,
}));
