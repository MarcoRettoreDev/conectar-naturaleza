import { describe, expect, it } from 'vitest';
import { validateExpense, validateReservation } from './validation';

describe('reservation and expense validation', () => {
  it('rejects reversed reservation dates', () => {
    expect(validateReservation({
      checkIn: '2025-05-10',
      checkOut: '2025-05-09',
      passenger: 'Ana',
      guests: 2,
      total: 100,
      paid: 0,
    })).toBe('El check-out debe ser posterior al check-in.');
  });

  it('rejects reservation overpayment', () => {
    expect(validateReservation({
      checkIn: '2025-05-09',
      checkOut: '2025-05-10',
      passenger: 'Ana',
      guests: 2,
      total: 100,
      paid: 101,
    })).toBe('El importe pagado debe estar entre 0 y el total.');
  });

  it('requires positive guests and total', () => {
    const reservation = {
      checkIn: '2025-05-09',
      checkOut: '2025-05-10',
      passenger: 'Ana',
      guests: 0,
      total: 100,
      paid: 0,
    };

    expect(validateReservation(reservation)).toBe('Los huéspedes deben ser al menos 1.');
    expect(validateReservation({ ...reservation, guests: 1, total: 0 })).toBe('El total debe ser un número positivo.');
  });

  it('rejects extraordinary descriptions longer than 255 characters', () => {
    expect(validateExpense({
      date: '2025-05-09',
      kind: 'extraordinary',
      description: 'a'.repeat(256),
      amount: 100,
    })).toBe('La descripción no puede superar 255 caracteres.');
  });

  it('accepts a valid variable expense', () => {
    expect(validateExpense({
      date: '2025-05-09',
      kind: 'variable',
      description: 'Cleaning supplies',
      amount: 25,
    })).toBeNull();
  });
});
