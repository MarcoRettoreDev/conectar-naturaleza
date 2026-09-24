import type { Expense, Reservation } from '../types';
import { validateExpense, validateReservation } from './validation';

export const FINANCES_STORAGE_KEY = 'conectar-naturaleza-finances';
const migratedKey = (userId: string) => `${FINANCES_STORAGE_KEY}-migrated:${userId}`;

type PersistedEnvelope = { state?: { reservations?: unknown; expenses?: unknown } };
export type LocalFinanceData = { reservations: Reservation[]; expenses: Expense[] };

const asRecord = (value: unknown): Record<string, unknown> | null => value && typeof value === 'object' ? value as Record<string, unknown> : null;

const normalizeReservation = (value: unknown): Reservation | null => {
  const item = asRecord(value);
  if (!item) return null;
  const reservation: Reservation = {
    id: typeof item.id === 'string' ? item.id : '',
    checkIn: typeof item.checkIn === 'string' ? item.checkIn : '',
    checkOut: typeof item.checkOut === 'string' ? item.checkOut : '',
    passenger: typeof item.passenger === 'string' ? item.passenger : '',
    guests: Number(item.guests),
    platform: item.platform as Reservation['platform'],
    phone: typeof item.phone === 'string' ? item.phone : '',
    total: Number(item.total),
    paid: Number(item.paid ?? 0),
  };
  return reservation.id && validateReservation(reservation) === null ? reservation : null;
};

const normalizeExpense = (value: unknown): Expense | null => {
  const item = asRecord(value);
  if (!item) return null;
  const expense: Expense = {
    id: typeof item.id === 'string' ? item.id : '',
    date: typeof item.date === 'string' ? item.date : '',
    kind: item.kind as Expense['kind'],
    category: item.category as Expense['category'],
    description: typeof item.description === 'string' ? item.description : '',
    amount: Number(item.amount),
  };
  return expense.id && validateExpense(expense) === null ? expense : null;
};

/** Parses only the Zustand persisted finance envelope; theme/auth keys are never read. */
export const parsePersistedFinanceData = (raw: string | null): LocalFinanceData | null => {
  if (!raw) return null;
  try {
    const envelope = JSON.parse(raw) as PersistedEnvelope;
    const state = asRecord(envelope?.state);
    if (!state || !Array.isArray(state.reservations) || !Array.isArray(state.expenses)) return null;
    const reservations = state.reservations.map(normalizeReservation).filter((item): item is Reservation => item !== null);
    const expenses = state.expenses.map(normalizeExpense).filter((item): item is Expense => item !== null);
    return { reservations, expenses };
  } catch {
    return null;
  }
};

export const detectLocalFinanceData = (storage: Pick<Storage, 'getItem'> = localStorage): LocalFinanceData | null => parsePersistedFinanceData(storage.getItem(FINANCES_STORAGE_KEY));
export const migrationMarkerKey = (userId: string) => migratedKey(userId);

export type MigrationMethods = {
  reservations: Reservation[];
  expenses: Expense[];
  addReservation: (reservation: Reservation) => Promise<void>;
  addExpense: (expense: Expense) => Promise<void>;
};

/** Uploads validated records once, retaining the source key as a local backup until success. */
export const migrateLocalFinanceData = async (storage: Pick<Storage, 'getItem' | 'setItem'>, userId: string, methods: MigrationMethods): Promise<{ migrated: boolean; reservations: number; expenses: number }> => {
  if (storage.getItem(migratedKey(userId)) === 'true') return { migrated: false, reservations: 0, expenses: 0 };
  const data = parsePersistedFinanceData(storage.getItem(FINANCES_STORAGE_KEY));
  if (!data || (data.reservations.length === 0 && data.expenses.length === 0)) return { migrated: false, reservations: 0, expenses: 0 };
  const reservationIds = new Set(methods.reservations.map((item) => item.id));
  const expenseIds = new Set(methods.expenses.map((item) => item.id));
  let reservations = 0;
  let expenses = 0;
  for (const reservation of data.reservations) {
    if (!reservationIds.has(reservation.id)) { await methods.addReservation(reservation); reservations++; reservationIds.add(reservation.id); }
  }
  for (const expense of data.expenses) {
    if (!expenseIds.has(expense.id)) { await methods.addExpense(expense); expenses++; expenseIds.add(expense.id); }
  }
  storage.setItem(migratedKey(userId), 'true');
  return { migrated: true, reservations, expenses };
};
