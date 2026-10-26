"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/browser";

const field =
  "min-h-12 w-full rounded-xl border-2 border-ink-red/30 bg-white px-3 text-base text-maroon focus:border-crimson focus:outline-none";
const MAX_BYTES = 2 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/** Name + photo. Each teammate edits only their own profile (enforced by Row Level Security). */
export function ProfileForm({
  userId,
  displayName,
  avatarUrl,
}: {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
}) {
  const router = useRouter();
  const [name, setName] = useState(displayName);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const supabase = createClient();
    let newAvatar: string | undefined;

    const file = (e.currentTarget.elements.namedItem("avatar") as HTMLInputElement).files?.[0];
    if (file) {
      const ext = TYPES[file.type];
      if (!ext) return fail("Please choose a JPG, PNG or WebP image.");
      if (file.size > MAX_BYTES) return fail("The image must be 2 MB or smaller.");
      const path = `${userId}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { contentType: file.type });
      if (error) return fail(`Upload failed: ${error.message}`);
      newAvatar = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: name.trim() || null, ...(newAvatar ? { avatar_url: newAvatar } : {}) })
      .eq("id", userId);
    if (error) return fail(`Could not save: ${error.message}`);

    setBusy(false);
    setMessage({ ok: true, text: "Saved." });
    router.refresh();

    function fail(text: string) {
      setBusy(false);
      setMessage({ ok: false, text });
    }
  }

  return (
    <form onSubmit={save} className="max-w-lg space-y-5 rounded-2xl border border-ink-red/15 bg-white p-5">
      <div className="flex items-center gap-4">
        <Avatar name={displayName || "A"} url={avatarUrl} size={72} />
        <label className="block flex-1">
          <span className="mb-1 block font-semibold text-ink-red">Photo</span>
          <input name="avatar" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-base" />
          <span className="mt-1 block text-sm text-maroon/70">JPG, PNG or WebP, up to 2 MB.</span>
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block font-semibold text-ink-red">Display name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required className={field} />
        <span className="mt-1 block text-sm text-maroon/70">Shown next to the requests you handle.</span>
      </label>
      {message && (
        <p role={message.ok ? "status" : "alert"} className={`rounded-xl p-3 font-medium ${message.ok ? "bg-emerald-50 text-emerald-900" : "border-2 border-crimson text-crimson"}`}>
          {message.text}
        </p>
      )}
      <button type="submit" disabled={busy} className="min-h-12 rounded-full bg-crimson px-8 font-semibold text-white hover:bg-maroon disabled:opacity-60">
        {busy ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
