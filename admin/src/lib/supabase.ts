import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './supabase-config';

export const supabaseConfig = getSupabaseConfig({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
});

export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
