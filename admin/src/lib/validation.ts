import type { Expense, FinanceState, Reservation } from '../types';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const isValidDate = (value: string): boolean => {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const isPositiveFinite = (value: number) => Number.isFinite(value) && value > 0;
const isNonNegativeFinite = (value: number) => Number.isFinite(value) && value >= 0;

export const validateReservation = (reservation: Pick<Reservation, 'checkIn' | 'checkOut' | 'passenger' | 'guests' | 'total' | 'paid'>): string | null => {
  if (!isValidDate(reservation.checkIn) || !isValidDate(reservation.checkOut)) return 'Ingresa fechas válidas.';
  if (reservation.checkOut <= reservation.checkIn) return 'El check-out debe ser posterior al check-in.';
  if (!reservation.passenger.trim()) return 'Ingresa el nombre del pasajero.';
  if (!Number.isInteger(reservation.guests) || reservation.guests < 1) return 'Los huéspedes deben ser al menos 1.';
  if (!isPositiveFinite(reservation.total)) return 'El total debe ser un número positivo.';
  if (!isNonNegativeFinite(reservation.paid) || reservation.paid > reservation.total) return 'El importe pagado debe estar entre 0 y el total.';
  return null;
};

export const validateExpense = (expense: Pick<Expense, 'date' | 'kind' | 'description' | 'amount'>): string | null => {
  if (!isValidDate(expense.date)) return 'Ingresa una fecha válida.';
  if (!isPositiveFinite(expense.amount)) return 'El importe debe ser un número positivo.';
  if (expense.description.trim().length > 255) return 'La descripción no puede superar 255 caracteres.';
  return null;
};

export const isFinanceState = (value: unknown): value is FinanceState => {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<FinanceState>;
  return Array.isArray(state.reservations) && state.reservations.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const reservation = item as Reservation;
    return typeof reservation.id === 'string' && typeof reservation.passenger === 'string' && typeof reservation.guests === 'number' && typeof reservation.total === 'number' && typeof reservation.paid === 'number' && validateReservation(reservation) === null;
  }) && Array.isArray(state.expenses) && state.expenses.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const expense = item as Expense;
    return typeof expense.id === 'string' && typeof expense.description === 'string' && typeof expense.amount === 'number' && validateExpense(expense) === null;
  });
};
