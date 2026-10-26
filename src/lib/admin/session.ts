import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type AdminProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: "admin" | "staff" | "guide" | "client";
};

/** Set ADMIN_REQUIRE_MFA=false to temporarily switch MFA enforcement off (not recommended). */
const REQUIRE_MFA = process.env.ADMIN_REQUIRE_MFA !== "false";

/**
 * Gatekeeper for every admin page and action:
 *   signed in -> role is "admin" -> MFA (TOTP) verified this session.
 * Anything else is redirected. Row Level Security re-checks all of this in the
 * database, so a mistake here can never expose data on its own.
 */
export async function requireAdmin({ skipMfa = false }: { skipMfa?: boolean } = {}) {
  if (!isSupabaseConfigured()) redirect("/login?error=config");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, role")
    .eq("id", user.id)
    .single<AdminProfile>();
  if (!profile || profile.role !== "admin") redirect("/login?error=noaccess");

  if (REQUIRE_MFA && !skipMfa) {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel !== "aal2") {
      // Has a verified authenticator? Ask for the code. Otherwise make them set one up.
      redirect(aal?.nextLevel === "aal2" ? "/login/mfa" : "/admin/security?setup=1");
    }
  }

  return { supabase, user, profile };
}

/** Only allow redirects back into the admin area. */
export function safeNext(value: string | null | undefined): string {
  return value && /^\/admin(\/[\w\-./?=&%]*)?$/.test(value) ? value : "/admin";
}
