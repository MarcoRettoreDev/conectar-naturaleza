import { describe, expect, it } from 'vitest';
import {
  clearRememberedAuth,
  getInitialTheme,
  getStoredTheme,
  hasRememberedAuth,
  setRememberedAuth,
  setStoredTheme,
} from './preferences';

function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

describe('admin preferences', () => {
  it('remembers auth until explicitly cleared', () => {
    const local = storage();
    expect(hasRememberedAuth(local)).toBe(false);
    setRememberedAuth(local);
    expect(hasRememberedAuth(local)).toBe(true);
    clearRememberedAuth(local);
    expect(hasRememberedAuth(local)).toBe(false);
  });

  it('uses a valid stored theme before the system preference', () => {
    const local = storage();
    expect(getInitialTheme(local, true)).toBe('dark');
    setStoredTheme(local, 'light');
    expect(getStoredTheme(local)).toBe('light');
    expect(getInitialTheme(local, true)).toBe('light');
  });

  it('ignores invalid stored themes', () => {
    const local = storage();
    local.setItem('admin-theme', 'sepia');
    expect(getStoredTheme(local)).toBe(null);
    expect(getInitialTheme(local, false)).toBe('light');
  });
});
