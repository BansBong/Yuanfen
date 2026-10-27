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
import { TRIPS } from "./trips";
import type { Localized } from "./types";

export type FormId =
  | "tour"
  | "jastip"
  | "medical"
  | "admission"
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
  /** Special validation: an email address or a phone / WhatsApp number. */
  kind?: "contact";
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

const TRIP_OPTIONS: Option[] = TRIPS.map((t) => ({ value: t.slug, label: t.name }));

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

const NOTES: Field = {
  name: "notes",
  type: "textarea",
  max: 1500,
  label: { en: "Anything else we should know?", id: "Ada hal lain yang perlu kami ketahui?" },
};

const ABOUT_YOU: Step = {
  id: "about-you",
  title: { en: "About you", id: "Tentang Anda" },
  fields: [NAME, CONTACT, PREFERRED_LANGUAGE],
};

// Forms ---------------------------------------------------------------------

export const FORMS: Record<FormId, FormDef> = {
  tour: {
    id: "tour",
    steps: [
      ABOUT_YOU,
      {
        id: "trip",
        title: { en: "Your trip", id: "Perjalanan Anda" },
        fields: [
          {
            name: "destinations",
            type: "textarea",
            required: true,
            max: 400,
            rows: 3,
            label: { en: "Where do you want to go?", id: "Anda ingin ke mana?" },
            placeholder: { en: "e.g. Guangzhou, Lijiang, Harbin", id: "mis. Guangzhou, Lijiang, Harbin" },
            help: {
              en: "Write one place or several, in any order. Any place in China is welcome, not only the ones on our list.",
              id: "Tulis satu tempat atau beberapa, urutan bebas. Tempat mana pun di Tiongkok boleh, tidak hanya yang ada di daftar kami.",
            },
          },
          {
            name: "trip",
            type: "select",
            label: { en: "A ready-made trip? (optional)", id: "Trip siap pakai? (opsional)" },
            options: TRIP_OPTIONS,
          },
          {
            name: "services",
            type: "chips-multi",
            label: { en: "What do you need?", id: "Anda butuh apa?" },
            options: [
              opt("city", "City tour", "City tour"),
              opt("business", "Business trip", "Perjalanan bisnis"),
              opt("muslim", "Muslim-friendly travel", "Wisata ramah Muslim"),
              opt("airport", "Airport pickup", "Jemput bandara"),
              opt("photography", "Photography", "Fotografi"),
            ],
          },
          {
            name: "travelDates",
            type: "text",
            required: true,
            max: 120,
            label: { en: "When are you travelling?", id: "Kapan Anda bepergian?" },
            placeholder: { en: "Dates or month, e.g. 12-20 March", id: "Tanggal atau bulan, mis. 12-20 Maret" },
          },
          {
            name: "people",
            type: "number",
            min: 1,
            maxValue: 50,
            label: { en: "How many people?", id: "Berapa orang?" },
          },
        ],
      },
      {
        id: "details",
        title: { en: "A few details", id: "Beberapa detail" },
        fields: [
          {
            name: "interests",
            type: "textarea",
            max: 1000,
            label: { en: "What do you enjoy? (food, history, shopping, nature...)", id: "Apa yang Anda sukai? (kuliner, sejarah, belanja, alam...)" },
          },
          NOTES,
        ],
      },
    ],
  },

  jastip: {
    id: "jastip",
    steps: [
      ABOUT_YOU,
      {
        id: "items",
        title: { en: "What to buy", id: "Barang yang dicari" },
        fields: [
          {
            name: "items",
            type: "textarea",
            required: true,
            max: 2000,
            label: { en: "What would you like us to buy?", id: "Barang apa yang ingin dibelikan?" },
            help: {
              en: "Names, quantities and links if you have them. No payment details, please.",
              id: "Nama barang, jumlah, dan tautan jika ada. Jangan sertakan data pembayaran.",
            },
          },
          {
            name: "city",
            type: "text",
            max: 100,
            label: { en: "Which city or market? (optional)", id: "Kota atau pasar mana? (opsional)" },
          },
          {
            name: "neededBy",
            type: "date",
            label: { en: "Needed by (optional)", id: "Dibutuhkan sebelum (opsional)" },
          },
        ],
      },
      {
        id: "delivery",
        title: { en: "Delivery", id: "Pengiriman" },
        fields: [
          {
            name: "delivery",
            type: "chips",
            label: { en: "How will you receive it?", id: "Bagaimana Anda menerimanya?" },
            options: [
              opt("ship", "Ship to me", "Dikirim ke saya"),
              opt("pickup", "I will collect it", "Saya ambil sendiri"),
              opt("unsure", "Not sure yet", "Belum tahu"),
            ],
          },
          NOTES,
        ],
      },
    ],
  },

  medical: {
    id: "medical",
    steps: [
      ABOUT_YOU,
      {
        id: "need",
        title: { en: "What you need", id: "Yang Anda butuhkan" },
        fields: [
          {
            name: "needs",
            type: "chips-multi",
            required: true,
            label: { en: "How can we help?", id: "Bagaimana kami bisa membantu?" },
            options: [
              opt("hospital", "Find a hospital or clinic", "Mencari rumah sakit atau klinik"),
              opt("appointment", "Book a consultation", "Mengatur jadwal konsultasi"),
              opt("interpreter", "An interpreter", "Penerjemah"),
              opt("logistics", "Transport and logistics", "Transportasi dan logistik"),
            ],
          },
          {
            name: "city",
            type: "text",
            max: 150,
            label: { en: "Which city or cities? (optional)", id: "Kota mana saja? (opsional)" },
          },
          {
            name: "when",
            type: "text",
            max: 120,
            label: { en: "When? (optional)", id: "Kapan? (opsional)" },
          },
        ],
      },
      {
        id: "details",
        title: { en: "Last step", id: "Langkah terakhir" },
        fields: [
          {
            name: "notes",
            type: "textarea",
            max: 1000,
            label: { en: "Anything else we should know?", id: "Ada hal lain yang perlu kami ketahui?" },
            help: {
              en: "Please do NOT include medical records, diagnoses or ID numbers.",
              id: "Mohon JANGAN sertakan rekam medis, diagnosis, atau nomor identitas.",
            },
          },
          {
            name: "ack",
            type: "checkbox",
            required: true,
            label: {
              en: "I understand Yuanfen connects me with hospitals and interpreters and does not give medical advice.",
              id: "Saya mengerti bahwa Yuanfen menghubungkan saya dengan rumah sakit dan penerjemah, dan tidak memberi nasihat medis.",
            },
          },
        ],
      },
    ],
  },

  admission: {
    id: "admission",
    steps: [
      ABOUT_YOU,
      {
        id: "study",
        title: { en: "Your study plan", id: "Rencana studi" },
        fields: [
          {
            name: "applicant",
            type: "chips",
            label: { en: "Who is applying?", id: "Siapa yang mendaftar?" },
            options: [
              opt("me", "Me", "Saya"),
              opt("child", "My child", "Anak saya"),
              opt("other", "Someone else", "Orang lain"),
            ],
          },
          {
            name: "level",
            type: "select",
            required: true,
            label: { en: "What level?", id: "Jenjang apa?" },
            options: [
              opt("language", "Language course", "Kursus bahasa"),
              opt("school", "School", "Sekolah"),
              opt("bachelor", "Bachelor", "Sarjana (S1)"),
              opt("master", "Master", "Magister (S2)"),
              opt("phd", "PhD", "Doktor (S3)"),
              opt("other", "Other", "Lainnya"),
            ],
          },
          {
            name: "subject",
            type: "text",
            max: 150,
            label: { en: "Subject or major (optional)", id: "Jurusan (opsional)" },
          },
          {
            name: "city",
            type: "text",
            max: 100,
            label: { en: "Preferred city (optional)", id: "Kota yang diinginkan (opsional)" },
          },
          {
            name: "startWhen",
            type: "text",
            required: true,
            max: 100,
            label: { en: "When do you want to start?", id: "Kapan ingin mulai?" },
            placeholder: { en: "e.g. September 2027", id: "mis. September 2027" },
          },
        ],
      },
      { id: "details", title: { en: "Last step", id: "Langkah terakhir" }, fields: [NOTES] },
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
