export const AUTH_STORAGE_KEY = 'admin-auth';
export const THEME_STORAGE_KEY = 'admin-theme';

export type Theme = 'light' | 'dark';

export function hasRememberedAuth(storage: Pick<Storage, 'getItem'> = localStorage): boolean {
  return storage.getItem(AUTH_STORAGE_KEY) === 'yes';
}

export function setRememberedAuth(storage: Pick<Storage, 'setItem'> = localStorage): void {
  storage.setItem(AUTH_STORAGE_KEY, 'yes');
}

export function clearRememberedAuth(storage: Pick<Storage, 'removeItem'> = localStorage): void {
  storage.removeItem(AUTH_STORAGE_KEY);
}

export function getStoredTheme(storage: Pick<Storage, 'getItem'> = localStorage): Theme | null {
  const value = storage.getItem(THEME_STORAGE_KEY);
  return value === 'dark' || value === 'light' ? value : null;
}

export function getInitialTheme(
  storage: Pick<Storage, 'getItem'> = localStorage,
  prefersDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches,
): Theme {
  return getStoredTheme(storage) ?? (prefersDark ? 'dark' : 'light');
}

export function setStoredTheme(storage: Pick<Storage, 'setItem'> = localStorage, theme: Theme): void {
  storage.setItem(THEME_STORAGE_KEY, theme);
}
