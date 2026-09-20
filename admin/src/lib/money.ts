/** Formats a monetary input using Spanish grouping and decimal separators. */
export const formatMoneyInput = (value: string): string => {
  const normalized = value.replace(/\s/g, '');
  if (!normalized.replace(/[^\d,]/g, '')) return '';
  const commaIndex = normalized.indexOf(',');
  const integerPart = (commaIndex >= 0 ? normalized.slice(0, commaIndex) : normalized).replace(/\D/g, '');
  const decimalPart = commaIndex >= 0 ? normalized.slice(commaIndex + 1).replace(/\D/g, '') : '';
  const groupedInteger = (integerPart || '0').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return commaIndex >= 0 ? `${groupedInteger},${decimalPart}` : groupedInteger;
};

/** Parses a Spanish-formatted monetary input without changing the model's number type. */
export const parseMoneyInput = (value: string): number => {
  const formatted = formatMoneyInput(value);
  if (!formatted || formatted === '0' || formatted === '0,') return formatted === '0' ? 0 : Number.NaN;
  const [integerPart, decimalPart] = formatted.split(',');
  const parsed = Number(`${integerPart.replace(/\./g, '')}.${decimalPart ?? ''}`);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

/** Formats a stored numeric value for display in a monetary input. */
export const formatMoneyValue = (value: number): string => {
  if (!Number.isFinite(value)) return '';
  return formatMoneyInput(String(value).replace('.', ','));
};

