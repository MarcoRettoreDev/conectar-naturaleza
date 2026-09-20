import { describe, expect, it } from 'vitest';
import { formatMoneyInput, formatMoneyValue, parseMoneyInput } from './money';

describe('Spanish monetary inputs', () => {
  it('groups thousands and preserves decimal typing', () => {
    expect(formatMoneyInput('1234')).toBe('1.234');
    expect(formatMoneyInput('1234567,89')).toBe('1.234.567,89');
    expect(formatMoneyInput('1.234,56')).toBe('1.234,56');
  });

  it('parses formatted values into numbers', () => {
    expect(parseMoneyInput('1.234,56')).toBe(1234.56);
    expect(parseMoneyInput('1.234')).toBe(1234);
    expect(parseMoneyInput('')).toBeNaN();
  });

  it('formats stored numeric values without changing their numeric representation', () => {
    expect(formatMoneyValue(1234.5)).toBe('1.234,5');
  });
});
