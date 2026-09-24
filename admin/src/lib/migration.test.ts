import { describe, expect, it, vi } from 'vitest';
import { detectLocalFinanceData, migrateLocalFinanceData, migrationMarkerKey, parsePersistedFinanceData, FINANCES_STORAGE_KEY } from './migration';
import type { Expense, Reservation } from '../types';

const reservation: Reservation = { id: 'r1', checkIn: '2026-09-10', checkOut: '2026-09-11', passenger: 'Ana', guests: 1, platform: 'particular', phone: '', total: 100, paid: 0 };
const expense: Expense = { id: 'e1', date: '2026-09-10', kind: 'variable', category: 'luz', description: '', amount: 20 };
const storage = (values: Record<string, string> = {}) => ({ getItem: (key: string) => values[key] ?? null, setItem: (key: string, value: string) => { values[key] = value; } });

 describe('local finance migration', () => {
  it('detects and normalizes a Zustand persisted envelope without reading other keys', () => {
    const data = parsePersistedFinanceData(JSON.stringify({ state: { reservations: [{ ...reservation, guests: '1' }], expenses: [{ ...expense, amount: '20' }] }, version: 0 }));
    expect(data).toEqual({ reservations: [reservation], expenses: [expense] });
    expect(detectLocalFinanceData(storage({ theme: JSON.stringify({ theme: 'dark' }) }))).toBeNull();
  });

  it('returns no-op when absent or already migrated', async () => {
    const absent = storage();
    const add = vi.fn();
    expect(await migrateLocalFinanceData(absent, 'user-1', { reservations: [], expenses: [], addReservation: add, addExpense: add })).toEqual({ migrated: false, reservations: 0, expenses: 0 });
    const done = storage({ [FINANCES_STORAGE_KEY]: JSON.stringify({ state: { reservations: [reservation], expenses: [expense] } }), [migrationMarkerKey('user-1')]: 'true' });
    expect(await migrateLocalFinanceData(done, 'user-1', { reservations: [], expenses: [], addReservation: add, addExpense: add })).toEqual({ migrated: false, reservations: 0, expenses: 0 });
    expect(add).not.toHaveBeenCalled();
  });

  it('skips remote ids, preserves the local key, and marks success only after uploads', async () => {
    const values: Record<string, string> = { [FINANCES_STORAGE_KEY]: JSON.stringify({ state: { reservations: [reservation], expenses: [expense] } }) };
    const source = storage(values);
    const addReservation = vi.fn(async () => {});
    const addExpense = vi.fn(async () => {});
    const result = await migrateLocalFinanceData(source, 'user-1', { reservations: [reservation], expenses: [], addReservation, addExpense });
    expect(result).toEqual({ migrated: true, reservations: 0, expenses: 1 });
    expect(addExpense).toHaveBeenCalledWith(expense);
    expect(values[FINANCES_STORAGE_KEY]).toBeTruthy();
    expect(values[migrationMarkerKey('user-1')]).toBe('true');
  });
});
