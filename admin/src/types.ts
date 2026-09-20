export type Platform = 'particular' | 'booking' | 'airbnb';
export type ExpenseKind = 'variable' | 'extraordinary';
export type VariableCategory = 'alquiler' | 'luz' | 'agua' | 'limpieza' | 'blancos' | 'booking_commission' | 'varios' | 'flow' | 'gas';
export type ExtraordinaryCategory = 'extraordinary';

export const variableCategoryLabels: Record<VariableCategory, string> = {
  alquiler: 'Alquiler', luz: 'Luz', agua: 'Agua', limpieza: 'Limpieza', blancos: 'Blancos', booking_commission: 'Comisión Booking', varios: 'Varios', flow: 'Flow', gas: 'Gas',
};

export const extraordinaryCategoryLabels: Record<ExtraordinaryCategory, string> = { extraordinary: 'Extraordinario' };

export interface Reservation { id: string; checkIn: string; checkOut: string; passenger: string; guests: number; platform: Platform; phone: string; total: number; paid: number; }
export interface Expense { id: string; date: string; kind: ExpenseKind; category: VariableCategory | ExtraordinaryCategory; description: string; amount: number; }
export interface FinanceState { reservations: Reservation[]; expenses: Expense[]; }
