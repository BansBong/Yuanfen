import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./env";

/**
 * Service-role client: bypasses Row Level Security. Import ONLY from server
 * code (server actions, route handlers). The `server-only` import above makes
 * the build fail if a client component ever pulls this file in.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key) throw new Error("Supabase service-role client is not configured");
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
