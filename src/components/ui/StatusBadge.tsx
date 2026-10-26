/** "Available" / "On request" pill. Always text, never colour alone. */
export function StatusBadge({ status, label }: { status: "available" | "on-request"; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${
        status === "available"
          ? "border-emerald-700/40 bg-emerald-50 text-emerald-900"
          : "border-ink-red/30 bg-cream text-ink-red"
      }`}
    >
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${status === "available" ? "bg-emerald-600" : "bg-ink-red/60"}`}
      />
      {label}
    </span>
  );
}
