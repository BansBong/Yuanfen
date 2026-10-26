"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { isFormId } from "@/data/forms";
import { isLocale } from "@/i18n/routing";
import { formSchema, isValidContact, issuesToErrors } from "@/lib/forms/schema";
import { generateReference } from "@/lib/forms/reference";
import type { SubmitInput, SubmitResult } from "@/lib/forms/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { isServiceRoleConfigured } from "@/lib/supabase/env";

/** 5 requests per IP per 10 minutes. */
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
/** Best-effort, per server instance. The database check below is the reliable one. */
const memory = new Map<string, number[]>();

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-16) ?? "yuanfen";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

function memoryLimited(key: string): boolean {
  const now = Date.now();
  const recent = (memory.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    memory.set(key, recent);
    return true;
  }
  recent.push(now);
  memory.set(key, recent);
  return false;
}

function contactType(value: string): "email" | "phone" | "other" {
  if (/@/.test(value)) return "email";
  return isValidContact(value) ? "phone" : "other";
}

/** Keep only meaningful answers in the details column. */
function cleanDetails(values: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (key === "name" || key === "contact") continue;
    if (value === "" || value === false || (Array.isArray(value) && value.length === 0)) continue;
    out[key] = value;
  }
  return out;
}

export async function submitRequest(input: SubmitInput): Promise<SubmitResult> {
  if (!isFormId(input.formId) || !isLocale(input.locale)) return { ok: false, code: "failed" };
  if (input.consent !== true) return { ok: false, code: "validation", errors: { consent: "consent" } };

  // Bots: a filled honeypot or an impossibly fast submit gets a fake success and nothing is stored.
  if (input.hp || input.elapsedMs < 2000) return { ok: true, reference: generateReference() };

  const parsed = formSchema(input.formId).safeParse(input.values);
  if (!parsed.success) return { ok: false, code: "validation", errors: issuesToErrors(parsed.error) };
  const values = parsed.data as Record<string, unknown>;

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const ipHash = hashIp(ip);
  if (memoryLimited(ipHash)) return { ok: false, code: "rateLimited" };

  if (!isServiceRoleConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      // Local development without Supabase: accept and log so the whole flow can be tried.
      const reference = generateReference();
      console.info("[dev] request NOT saved (Supabase not configured):", reference, input.formId, values);
      return { ok: true, reference };
    }
    return { ok: false, code: "notConfigured" };
  }

  try {
    const supabase = createAdminClient();

    const since = new Date(Date.now() - WINDOW_MS).toISOString();
    const { count, error: countError } = await supabase
      .from("requests")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if (countError) throw countError;
    if ((count ?? 0) >= LIMIT) return { ok: false, code: "rateLimited" };

    const name = String(values.name ?? "").trim();
    const contact = String(values.contact ?? "").trim();
    const details = { ...cleanDetails(values), consent: true };

    // A 6-character code can in theory collide; retry a few times.
    for (let attempt = 0; attempt < 4; attempt++) {
      const reference = generateReference();
      const { error } = await supabase.from("requests").insert({
        reference_code: reference,
        type: input.formId,
        locale: input.locale,
        name,
        contact,
        contact_type: contactType(contact),
        details,
        ip_hash: ipHash,
      });
      if (!error) return { ok: true, reference };
      if (error.code !== "23505") throw error; // not a unique-violation
    }
    return { ok: false, code: "failed" };
  } catch (err) {
    console.error("submitRequest failed", err);
    return { ok: false, code: "failed" };
  }
}
