import { describe, expect, it } from 'vitest';
import { balance, median, monthSummary, nightsBetween } from './calculations';

describe('financial calculations', () => {
  it('calculates nights across dates and rejects reversed stays', () => { expect(nightsBetween('2025-05-01', '2025-05-04')).toBe(3); expect(nightsBetween('2025-05-04', '2025-05-01')).toBe(0); });
  it('calculates balance without negative debt', () => { expect(balance(100, 40)).toBe(60); expect(balance(100, 140)).toBe(0); });
  it('calculates odd and even medians', () => { expect(median([5, 1, 3])).toBe(3); expect(median([1, 4, 2, 8])).toBe(3); });
  it('summarizes a month', () => { const summary = monthSummary([{ id: '1', checkIn: '2025-05-10', checkOut: '2025-05-12', passenger: 'A', guests: 2, platform: 'booking', phone: '', total: 100, paid: 50 }], [{ id: '2', date: '2025-05-02', kind: 'variable', category: 'luz', description: 'x', amount: 20 }], '2025-05'); expect(summary).toMatchObject({ income: 100, expenses: 20, result: 80, guests: 2, totalNights: 2, mostUsedPlatform: 'booking' }); });
});
