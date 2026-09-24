export function requireSupabaseUrl(value: string | undefined): string {
  if (!value) {
    throw new Error('Missing VITE_SUPABASE_URL. Set it in the admin environment before building.');
  }

  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('unsupported protocol');
    }
  } catch {
    throw new Error('Invalid VITE_SUPABASE_URL. It must be a valid HTTP(S) URL.');
  }

  return value;
}

export function requireSupabaseAnonKey(value: string | undefined): string {
  if (!value) {
    throw new Error('Missing VITE_SUPABASE_ANON_KEY. Set it in the admin environment before building.');
  }

  return value;
}

export function getSupabaseConfig(env: { VITE_SUPABASE_URL?: string; VITE_SUPABASE_ANON_KEY?: string }) {
  return {
    url: requireSupabaseUrl(env.VITE_SUPABASE_URL?.trim()),
    anonKey: requireSupabaseAnonKey(env.VITE_SUPABASE_ANON_KEY?.trim()),
  } as const;
}
