"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/session";
import { REQUEST_STATUSES } from "@/lib/admin/constants";
import { createClient } from "@/lib/supabase/server";

const UpdateSchema = z.object({
  id: z.uuid(),
  status: z.enum(REQUEST_STATUSES),
  assigned_to: z.union([z.uuid(), z.literal("")]),
  internal_notes: z.string().max(5000),
});

/** Change status / assignee / notes. Always re-checks the caller is an admin; RLS checks it again in the database. */
export async function updateRequest(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const parsed = UpdateSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    assigned_to: formData.get("assigned_to") ?? "",
    internal_notes: String(formData.get("internal_notes") ?? ""),
  });
  if (!parsed.success) redirect("/admin?error=invalid");
  const { id, status, assigned_to, internal_notes } = parsed.data;

  const { error } = await supabase
    .from("requests")
    .update({
      status,
      assigned_to: assigned_to || null,
      internal_notes: internal_notes.trim() || null,
      last_updated_by: user.id,
    })
    .eq("id", id);

  if (error) redirect(`/admin/requests/${id}?error=save`);

  revalidatePath("/admin");
  revalidatePath(`/admin/requests/${id}`);
  redirect(`/admin/requests/${id}?saved=1`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
