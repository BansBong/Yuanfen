import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sinceFor, type Range, type ResponseRow } from "./insights";

export const RESPONSE_COLUMNS = "id, reference_code, created_at, status, locale, name, contact, details";
export const MAX_ROWS = 5000;

/** The newest inquiry responses in a date range (RLS: only admins get rows back). */
export async function fetchInquiries(supabase: SupabaseClient, range: Range) {
  let q = supabase
    .from("requests")
    .select(RESPONSE_COLUMNS, { count: "exact" })
    .eq("type", "inquiry")
    .order("created_at", { ascending: false })
    .limit(MAX_ROWS);
  const since = sinceFor(range);
  if (since) q = q.gte("created_at", since);
  const { data, count, error } = await q;
  return { rows: (data ?? []) as ResponseRow[], total: count ?? 0, error };
}
