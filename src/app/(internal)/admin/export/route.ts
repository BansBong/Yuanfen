import { FORMS } from "@/data/forms";
import { csvCell, displayValue } from "@/lib/admin/answers";
import { STATUS_LABELS } from "@/lib/admin/constants";
import { parseRange } from "@/lib/admin/insights";
import { fetchInquiries } from "@/lib/admin/responses";
import { requireAdmin } from "@/lib/admin/session";

/** CSV of every inquiry response (opens in Excel / Google Sheets). Admins only. */
export async function GET(request: Request) {
  const range = parseRange(new URL(request.url).searchParams.get("range") ?? undefined);
  const { supabase } = await requireAdmin();
  const { rows } = await fetchInquiries(supabase, range);

  const fields = FORMS.inquiry.steps.flatMap((s) => s.fields).filter((f) => f.name !== "name" && f.name !== "contact");
  const header = ["Submitted (UTC)", "Reference", "Status", "Site language", "Name", "WhatsApp", ...fields.map((f) => f.label.en)];
  const lines = [header.map(csvCell).join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.created_at,
        r.reference_code,
        STATUS_LABELS[r.status],
        r.locale === "id" ? "Indonesian" : "English",
        r.name,
        r.contact,
        ...fields.map((f) => displayValue(f, r.details[f.name])),
      ]
        .map(csvCell)
        .join(","),
    );
  }

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="yuanfen-inquiries-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
