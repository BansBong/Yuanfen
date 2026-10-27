export const REQUEST_TYPES = [
  "inquiry",
  "tour",
  "jastip",
  "medical",
  "admission",
  "destination_request",
  "partnership",
  "guide_application",
  "contact",
] as const;
export type RequestType = (typeof REQUEST_TYPES)[number];

export const REQUEST_STATUSES = ["new", "contacted", "quoted", "won", "closed"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const TYPE_LABELS: Record<RequestType, string> = {
  inquiry: "Service inquiry",
  tour: "Tour Guiding",
  jastip: "Shopping (Jasa Titip)",
  medical: "Medical",
  admission: "Admission",
  destination_request: "Destination request",
  partnership: "Partnership",
  guide_application: "Guide application",
  contact: "Contact",
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  closed: "Closed",
};

export const STATUS_STYLES: Record<RequestStatus, string> = {
  new: "bg-crimson text-white",
  contacted: "bg-amber-100 text-amber-900",
  quoted: "bg-sky-100 text-sky-900",
  won: "bg-emerald-100 text-emerald-900",
  closed: "bg-stone-200 text-stone-700",
};

export type RequestRow = {
  id: string;
  reference_code: string;
  type: RequestType;
  locale: "en" | "id";
  name: string;
  contact: string;
  contact_type: "email" | "phone" | "other";
  details: Record<string, unknown>;
  status: RequestStatus;
  assigned_to: string | null;
  internal_notes: string | null;
  last_updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type TeamMember = { id: string; display_name: string | null; avatar_url: string | null };

export const PAGE_SIZE = 25;
