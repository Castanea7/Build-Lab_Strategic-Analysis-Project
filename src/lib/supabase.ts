/**
 * Supabase is intentionally not initialized in Step 1.
 * Keep the public environment variable contract here so a later auth/data step
 * can add the client without leaking private keys into the browser bundle.
 */
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL ?? '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
}
