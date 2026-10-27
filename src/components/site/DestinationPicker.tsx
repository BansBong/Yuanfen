"use client";

import { Check, MapPin } from "lucide-react";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";

export type PickerGroup = {
  id: string;
  name: string;
  cities: { id: string; name: string; hook: string; status: "available" | "on-request" }[];
};

export type PickerLabels = {
  available: string;
  onRequest: string;
  photoPlaceholder: string;
  choose: string;
  chosen: string;
};

/** Big tappable destination cards, grouped by region. */
export function DestinationPicker({
  groups,
  labels,
  value,
  onChange,
}: {
  groups: PickerGroup[];
  labels: PickerLabels;
  value: string[];
  onChange: (id: string) => void;
}) {
  return (
    <div className="space-y-12">
      {groups.map((g) => (
        <div key={g.id}>
          <h3 className="font-display text-xl text-ink-red sm:text-2xl">{g.name}</h3>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {g.cities.map((c) => {
              const selected = value.includes(c.id);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onChange(c.id)}
                    className={`flex h-full w-full flex-col overflow-hidden rounded-3xl border-2 bg-white/70 text-left transition hover:-translate-y-1 ${
                      selected ? "border-crimson shadow-[0_0_0_4px_rgba(214,40,40,0.15)]" : "border-ink-red/15"
                    }`}
                  >
                    {/* photo placeholder */}
                    <span className="relative grid aspect-[4/3] w-full place-items-center bg-gradient-to-br from-cream via-cream-center to-crimson/15">
                      <span className="flex flex-col items-center gap-1 text-ink-red/70">
                        <MapPin aria-hidden="true" className="size-9" />
                        <span className="text-sm">{labels.photoPlaceholder}</span>
                      </span>
                      <span className="absolute top-2 left-2">
                        <PlaceholderBadge what="photo" />
                      </span>
                    </span>
                    <span className="flex flex-1 flex-col gap-2 p-4">
                      <span className="font-display text-xl text-ink-red">{c.name}</span>
                      <span className="text-base leading-snug text-maroon">{c.hook}</span>
                      <span className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                        <StatusBadge
                          status={c.status}
                          label={c.status === "available" ? labels.available : labels.onRequest}
                        />
                        <span
                          className={`inline-flex items-center gap-1 text-base font-semibold ${
                            selected ? "text-crimson" : "text-ink-red"
                          }`}
                        >
                          {selected && <Check aria-hidden="true" className="size-5" />}
                          {selected ? labels.chosen : labels.choose}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
