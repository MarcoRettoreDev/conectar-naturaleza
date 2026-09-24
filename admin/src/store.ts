import { create } from 'zustand';
import type { Expense, FinanceState, Reservation } from './types';
import { supabase } from './lib/supabase';
import { migrateLocalFinanceData } from './lib/migration';

type ReservationRow = {
  id: string; check_in: string; check_out: string; passenger: string; guests: number;
  platform: Reservation['platform']; phone: string; total: number | string; paid: number | string;
};
type ExpenseRow = {
  id: string; date: string; kind: Expense['kind']; category: Expense['category']; description: string; amount: number | string;
};

export interface FinanceStore extends FinanceState {
  loading: boolean;
  error: string | null;
  userId: string | null;
  load: (userId: string) => Promise<void>;
  clear: () => void;
  clearError: () => void;
  addReservation: (reservation: Reservation) => Promise<void>;
  updateReservation: (reservation: Reservation) => Promise<void>;
  addExpense: (expense: Expense) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  removeReservation: (id: string) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  migrateLocalData: (storage?: Storage) => Promise<{ migrated: boolean; reservations: number; expenses: number }>;
}

const emptyState: FinanceState = { reservations: [], expenses: [] };
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'No se pudo guardar el cambio.';

export const reservationFromRow = (row: ReservationRow): Reservation => ({
  id: row.id, checkIn: row.check_in, checkOut: row.check_out, passenger: row.passenger,
  guests: row.guests, platform: row.platform, phone: row.phone, total: Number(row.total), paid: Number(row.paid),
});
export const expenseFromRow = (row: ExpenseRow): Expense => ({
  id: row.id, date: row.date, kind: row.kind, category: row.category, description: row.description, amount: Number(row.amount),
});

const reservationRow = (reservation: Reservation, userId: string) => ({
  id: reservation.id, user_id: userId, check_in: reservation.checkIn, check_out: reservation.checkOut,
  passenger: reservation.passenger, guests: reservation.guests, platform: reservation.platform,
  phone: reservation.phone, total: reservation.total, paid: reservation.paid,
});
const expenseRow = (expense: Expense, userId: string) => ({
  id: expense.id, user_id: userId, date: expense.date, kind: expense.kind, category: expense.category,
  description: expense.description, amount: expense.amount,
});

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  ...emptyState, loading: false, error: null, userId: null,
  clear: () => set({ ...emptyState, loading: false, error: null, userId: null }),
  clearError: () => set({ error: null }),
  load: async (userId) => {
    set({ loading: true, error: null, userId });
    const [reservationsResult, expensesResult] = await Promise.all([
      supabase.from('reservations').select('*').eq('user_id', userId).order('check_in', { ascending: false }),
      supabase.from('expenses').select('*').eq('user_id', userId).order('date', { ascending: false }),
    ]);
    if (reservationsResult.error || expensesResult.error) {
      const error = reservationsResult.error || expensesResult.error;
      const message = errorMessage(error);
      set({ loading: false, error: message });
      throw new Error(message);
    }
    set({ reservations: (reservationsResult.data as ReservationRow[]).map(reservationFromRow), expenses: (expensesResult.data as ExpenseRow[]).map(expenseFromRow), loading: false, error: null });
  },
  addReservation: async (reservation) => {
    const userId = get().userId; if (!userId) throw new Error('Sesión no disponible.');
    const { error } = await supabase.from('reservations').insert(reservationRow(reservation, userId));
    if (error) { const message = errorMessage(error); set({ error: message }); throw new Error(message); }
    set((state) => ({ reservations: [reservation, ...state.reservations], error: null }));
  },
  updateReservation: async (reservation) => {
    if (!get().userId) throw new Error('Sesión no disponible.');
    const { error } = await supabase.from('reservations').update(reservationRow(reservation, get().userId!)).eq('id', reservation.id);
    if (error) { const message = errorMessage(error); set({ error: message }); throw new Error(message); }
    set((state) => ({ reservations: state.reservations.map((item) => item.id === reservation.id ? reservation : item), error: null }));
  },
  addExpense: async (expense) => {
    const userId = get().userId; if (!userId) throw new Error('Sesión no disponible.');
    const { error } = await supabase.from('expenses').insert(expenseRow(expense, userId));
    if (error) { const message = errorMessage(error); set({ error: message }); throw new Error(message); }
    set((state) => ({ expenses: [expense, ...state.expenses], error: null }));
  },
  updateExpense: async (expense) => {
    if (!get().userId) throw new Error('Sesión no disponible.');
    const { error } = await supabase.from('expenses').update(expenseRow(expense, get().userId!)).eq('id', expense.id);
    if (error) { const message = errorMessage(error); set({ error: message }); throw new Error(message); }
    set((state) => ({ expenses: state.expenses.map((item) => item.id === expense.id ? expense : item), error: null }));
  },
  removeReservation: async (id) => {
    if (!get().userId) throw new Error('Sesión no disponible.');
    const { error } = await supabase.from('reservations').delete().eq('id', id);
    if (error) { const message = errorMessage(error); set({ error: message }); throw new Error(message); }
    set((state) => ({ reservations: state.reservations.filter((item) => item.id !== id), error: null }));
  },
  removeExpense: async (id) => {
    if (!get().userId) throw new Error('Sesión no disponible.');
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) { const message = errorMessage(error); set({ error: message }); throw new Error(message); }
    set((state) => ({ expenses: state.expenses.filter((item) => item.id !== id), error: null }));
  },
  migrateLocalData: async (storage = localStorage) => {
    const userId = get().userId;
    if (!userId) throw new Error('Sesión no disponible.');
    return migrateLocalFinanceData(storage, userId, {
      reservations: get().reservations,
      expenses: get().expenses,
      addReservation: get().addReservation,
      addExpense: get().addExpense,
    });
  },
}));
