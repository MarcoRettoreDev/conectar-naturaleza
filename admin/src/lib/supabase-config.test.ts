import { describe, expect, it } from 'vitest';
import { getSupabaseConfig, requireSupabaseUrl } from './supabase-config';

describe('Supabase configuration', () => {
  it('accepts trimmed HTTP(S) values and never reads a database password', () => {
    expect(getSupabaseConfig({
      VITE_SUPABASE_URL: ' https://project.supabase.co ',
      VITE_SUPABASE_ANON_KEY: ' anon-key ',
    })).toEqual({ url: 'https://project.supabase.co', anonKey: 'anon-key' });
  });

  it('rejects missing or non-HTTP(S) URLs', () => {
    expect(() => requireSupabaseUrl(undefined)).toThrow('Missing VITE_SUPABASE_URL');
    expect(() => requireSupabaseUrl('postgres://project')).toThrow('valid HTTP(S) URL');
  });
});
