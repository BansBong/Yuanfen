/**
 * ALL form questions live here (labels are bilingual). When you send the real
 * question lists, ONLY this file needs to change.
 *
 * PLACEHOLDER: every field list below is a sensible draft, not final.
 *
 * Rules (also in PLACEHOLDERS.md):
 *  - Never ask for passport numbers, payment details or medical records.
 *  - Required fields are kept to: name, contact, destination/topic, and dates
 *    where they matter.
 *  - `name` and `contact` are stored in dedicated columns; everything else goes
 *    into the `details` JSON column of the request.
 */
import type { Localized } from "./types";

export type FormId =
  | "inquiry"
  | "destination_request"
  | "partnership"
  | "guide_application"
  | "contact";

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "chips" // choose one
  | "chips-multi" // choose several
  | "date"
  | "number"
  | "checkbox";

export type Option = { value: string; label: Localized };

export type Field = {
  name: string;
  type: FieldType;
  label: Localized;
  required?: boolean;
  placeholder?: Localized;
  help?: Localized;
  options?: Option[];
  /** Max characters for text fields. */
  max?: number;
  /** Visible rows for a textarea. */
  rows?: number;
  /** Min/max for number fields. */
  min?: number;
  maxValue?: number;
  /** Special validation: "contact" = email OR phone; "phone" = phone / WhatsApp number only. */
  kind?: "contact" | "phone";
  /** Two short fields can sit side by side on wide screens. */
  width?: "half";
  /** Only show this field while another field has the given value selected. */
  showWhen?: { field: string; includes: string };
  autoComplete?: string;
};

export type Step = { id: string; title: Localized; fields: Field[] };

export type FormDef = {
  id: FormId;
  /** Heading shown above the form. */
  steps: Step[];
};

const opt = (value: string, en: string, id: string = en): Option => ({ value, label: { en, id } });

const LANGUAGE_OPTIONS: Option[] = [
  opt("en", "English"),
  opt("id", "Bahasa Indonesia", "Bahasa Indonesia"),
  opt("other", "Other", "Lainnya"),
];

// Shared fields -------------------------------------------------------------

const NAME: Field = {
  name: "name",
  type: "text",
  required: true,
  max: 100,
  autoComplete: "name",
  label: { en: "Your name", id: "Nama Anda" },
};

const CONTACT: Field = {
  name: "contact",
  type: "text",
  kind: "contact",
  required: true,
  max: 120,
  autoComplete: "off",
  label: { en: "WhatsApp number, phone or email", id: "Nomor WhatsApp, telepon, atau email" },
  help: {
    en: "Include the country code for phone numbers, e.g. +62 …",
    id: "Sertakan kode negara untuk nomor telepon, mis. +62 …",
  },
};

const PREFERRED_LANGUAGE: Field = {
  name: "language",
  type: "chips",
  label: { en: "Which language do you prefer?", id: "Bahasa apa yang Anda pilih?" },
  options: LANGUAGE_OPTIONS,
};

// Forms ---------------------------------------------------------------------

export const FORMS: Record<FormId, FormDef> = {
  // The main questionnaire: one dedicated page (/inquiry) with 5 sections. Every service
  // (tour guiding, shopping, medical, admission...) is requested through this form.
  inquiry: {
    id: "inquiry",
    steps: [
      {
        id: "personal",
        title: { en: "Personal information", id: "Informasi pribadi" },
        fields: [
          {
            name: "name",
            type: "text",
            required: true,
            max: 100,
            autoComplete: "name",
            label: { en: "Full name", id: "Nama lengkap" },
          },
          {
            name: "contact",
            type: "text",
            kind: "phone",
            required: true,
            max: 40,
            autoComplete: "tel",
            label: { en: "WhatsApp number", id: "Nomor WhatsApp" },
            help: {
              en: "Include the country code, e.g. +62 812 ...",
              id: "Sertakan kode negara, mis. +62 812 ...",
            },
          },
          {
            name: "nationality",
            type: "text",
            max: 80,
            width: "half",
            label: { en: "Nationality", id: "Kewarganegaraan" },
          },
          {
            name: "location",
            type: "text",
            max: 120,
            width: "half",
            label: { en: "Current city / country", id: "Kota / negara saat ini" },
          },
        ],
      },
      {
        id: "travel",
        title: { en: "Travel information", id: "Informasi perjalanan" },
        fields: [
          {
            name: "destinations",
            type: "textarea",
            required: true,
            max: 400,
            rows: 3,
            label: { en: "Destination in China", id: "Tujuan di Tiongkok" },
            placeholder: { en: "e.g. Guangzhou, Lijiang, Harbin", id: "mis. Guangzhou, Lijiang, Harbin" },
            help: {
              en: "Write one place or several. Any place in China is welcome.",
              id: "Tulis satu tempat atau beberapa. Tempat mana pun di Tiongkok boleh.",
            },
          },
          {
            name: "arrivalDate",
            type: "date",
            width: "half",
            label: { en: "Arrival date", id: "Tanggal kedatangan" },
          },
          {
            name: "departureDate",
            type: "date",
            width: "half",
            label: { en: "Departure date", id: "Tanggal kepulangan" },
          },
          {
            name: "pax",
            type: "number",
            min: 1,
            maxValue: 200,
            width: "half",
            label: { en: "Number of pax", id: "Jumlah orang" },
          },
          {
            name: "preferredDateTime",
            type: "text",
            max: 150,
            width: "half",
            label: { en: "Preferred date & time of service", id: "Tanggal & jam layanan yang diinginkan" },
            placeholder: { en: "e.g. 12 March, 09:00", id: "mis. 12 Maret, 09.00" },
          },
        ],
      },
      {
        id: "assistance",
        title: { en: "Type of assistance required", id: "Jenis bantuan yang dibutuhkan" },
        fields: [
          {
            name: "assistance",
            type: "chips-multi",
            required: true,
            label: { en: "Please select all that apply", id: "Pilih semua yang sesuai" },
            options: [
              opt("airport", "Airport pickup / drop-off", "Jemput / antar bandara"),
              opt("transport", "Private transportation", "Transportasi pribadi"),
              opt("guide", "Tour guide / local assistance", "Pemandu wisata / bantuan lokal"),
              opt("business_trip", "Business trip assistance", "Pendampingan perjalanan bisnis"),
              opt("business_meeting", "Business meeting / factory visit", "Meeting bisnis / kunjungan pabrik"),
              opt("medical_appointment", "Medical appointment assistance", "Pendampingan janji temu medis"),
              opt("hospital_visit", "Hospital visit / medical check-up", "Kunjungan rumah sakit / medical check-up"),
              opt("translation", "Translation / interpretation", "Penerjemahan / interpreter"),
              opt("shopping", "Shopping assistance", "Bantuan belanja (jasa titip)"),
              opt("education", "Education / school visit", "Pendidikan / kunjungan sekolah"),
              opt("other", "Other", "Lainnya"),
            ],
            help: {
              en: "For medical help we connect you with hospitals and interpreters. We do not give medical advice. Please do not include medical records here.",
              id: "Untuk bantuan medis, kami menghubungkan Anda dengan rumah sakit dan penerjemah. Kami tidak memberi nasihat medis. Mohon jangan sertakan rekam medis di sini.",
            },
          },
          {
            name: "assistanceOther",
            type: "text",
            max: 200,
            showWhen: { field: "assistance", includes: "other" },
            label: { en: "Other: please tell us", id: "Lainnya: mohon jelaskan" },
          },
        ],
      },
      {
        id: "requirements",
        title: { en: "Additional requirements", id: "Kebutuhan tambahan" },
        fields: [
          {
            name: "languages",
            type: "chips-multi",
            label: { en: "Preferred language", id: "Bahasa yang diinginkan" },
            options: [
              opt("en", "English"),
              opt("zh", "Mandarin", "Mandarin"),
              opt("id", "Indonesian", "Indonesia"),
              opt("other", "Other", "Lainnya"),
            ],
          },
          {
            name: "languageOther",
            type: "text",
            max: 80,
            showWhen: { field: "languages", includes: "other" },
            label: { en: "Other language", id: "Bahasa lainnya" },
          },
          {
            name: "hotel",
            type: "text",
            max: 200,
            label: { en: "Hotel / pickup location (if available)", id: "Hotel / lokasi penjemputan (jika ada)" },
          },
          {
            name: "requests",
            type: "textarea",
            max: 1500,
            rows: 4,
            label: { en: "Special requests or requirements", id: "Permintaan atau kebutuhan khusus" },
          },
        ],
      },
      {
        id: "budget",
        title: { en: "Budget & preferences (optional)", id: "Anggaran & preferensi (opsional)" },
        fields: [
          {
            name: "budget",
            type: "text",
            max: 100,
            width: "half",
            label: { en: "Estimated budget", id: "Perkiraan anggaran" },
          },
          {
            name: "serviceLevel",
            type: "chips",
            width: "half",
            label: { en: "Preferred service level", id: "Tingkat layanan yang diinginkan" },
            options: [opt("standard", "Standard", "Standar"), opt("premium", "Premium"), opt("vip", "VIP")],
          },
        ],
      },
    ],
  },

  destination_request: {
    id: "destination_request",
    steps: [
      {
        id: "place",
        title: { en: "Where to?", id: "Ke mana?" },
        fields: [
          {
            name: "place",
            type: "text",
            required: true,
            max: 120,
            label: { en: "Which place in China?", id: "Tempat mana di Tiongkok?" },
          },
          {
            name: "dates",
            type: "text",
            max: 120,
            label: { en: "When? (optional)", id: "Kapan? (opsional)" },
          },
          {
            name: "activities",
            type: "textarea",
            required: true,
            max: 1000,
            label: { en: "What do you want to do there?", id: "Apa yang ingin Anda lakukan di sana?" },
          },
        ],
      },
      { id: "contact", title: { en: "How to reach you", id: "Cara menghubungi Anda" }, fields: [NAME, CONTACT, PREFERRED_LANGUAGE] },
    ],
  },

  partnership: {
    id: "partnership",
    steps: [
      {
        id: "company",
        title: { en: "Your company", id: "Perusahaan Anda" },
        fields: [
          {
            name: "company",
            type: "text",
            required: true,
            max: 150,
            label: { en: "Company name", id: "Nama perusahaan" },
          },
          {
            name: "partnershipType",
            type: "select",
            required: true,
            label: { en: "What kind of company?", id: "Jenis perusahaan?" },
            options: [
              opt("agency", "Travel agency", "Biro perjalanan"),
              opt("hospital", "Hospital or clinic", "Rumah sakit atau klinik"),
              opt("university", "University or education agent", "Universitas atau agen pendidikan"),
              opt("supplier", "Supplier or merchant", "Pemasok atau pedagang"),
              opt("other", "Other", "Lainnya"),
            ],
          },
          {
            name: "website",
            type: "text",
            max: 200,
            label: { en: "Website (optional)", id: "Situs web (opsional)" },
          },
        ],
      },
      {
        id: "contact",
        title: { en: "Contact person", id: "Narahubung" },
        fields: [
          { ...NAME, label: { en: "Contact person", id: "Narahubung" } },
          CONTACT,
          {
            name: "message",
            type: "textarea",
            required: true,
            max: 2000,
            label: { en: "How would you like to work together?", id: "Bagaimana Anda ingin bekerja sama?" },
          },
        ],
      },
    ],
  },

  guide_application: {
    id: "guide_application",
    steps: [
      {
        id: "about",
        title: { en: "About you", id: "Tentang Anda" },
        fields: [
          NAME,
          CONTACT,
          {
            name: "city",
            type: "text",
            required: true,
            max: 100,
            label: { en: "Which city do you live in?", id: "Anda tinggal di kota mana?" },
          },
        ],
      },
      {
        id: "guiding",
        title: { en: "Guiding", id: "Memandu" },
        fields: [
          {
            name: "languages",
            type: "chips-multi",
            required: true,
            label: { en: "Languages you speak", id: "Bahasa yang Anda kuasai" },
            options: [
              opt("en", "English"),
              opt("id", "Bahasa Indonesia"),
              opt("zh", "Mandarin", "Mandarin"),
              opt("yue", "Cantonese", "Kanton"),
              opt("other", "Other", "Lainnya"),
            ],
          },
          {
            name: "experience",
            type: "chips",
            label: { en: "Your experience", id: "Pengalaman Anda" },
            options: [
              opt("student", "I am a student", "Saya mahasiswa"),
              opt("none", "No guiding experience yet", "Belum ada pengalaman memandu"),
              opt("some", "Some experience", "Ada sedikit pengalaman"),
              opt("lots", "A lot of experience", "Berpengalaman"),
            ],
          },
          {
            name: "about",
            type: "textarea",
            max: 1500,
            label: { en: "Tell us a little about yourself", id: "Ceritakan sedikit tentang diri Anda" },
          },
        ],
      },
    ],
  },

  contact: {
    id: "contact",
    steps: [
      { id: "about-you", title: { en: "About you", id: "Tentang Anda" }, fields: [NAME, CONTACT] },
      {
        id: "message",
        title: { en: "Your message", id: "Pesan Anda" },
        fields: [
          {
            name: "topic",
            type: "select",
            required: true,
            label: { en: "What is it about?", id: "Soal apa?" },
            options: [
              opt("general", "A general question", "Pertanyaan umum"),
              opt("tour", "Tour Guiding", "Tour Guiding"),
              opt("jastip", "Shopping (Jasa Titip)", "Jasa Titip"),
              opt("medical", "Medical", "Medical"),
              opt("admission", "School / university admission", "Admission kampus / sekolah"),
              opt("partnership", "Partnership", "Kemitraan"),
              opt("other", "Something else", "Lainnya"),
            ],
          },
          {
            name: "message",
            type: "textarea",
            required: true,
            max: 2000,
            label: { en: "Your message", id: "Pesan Anda" },
          },
        ],
      },
    ],
  },
};

export const FORM_IDS = Object.keys(FORMS) as FormId[];
export const isFormId = (value: unknown): value is FormId =>
  typeof value === "string" && value in FORMS;
