/** Supabase environment. The service-role key is SERVER ONLY and must never reach the browser. */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function isServiceRoleConfigured(): boolean {
  return Boolean(SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
