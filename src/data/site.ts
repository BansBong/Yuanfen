/**
 * Single source of truth for constants and copy.
 * Brand rules: the company is always "Yuanfenn" (double n); the domain is
 * yuanfenbridge.com (single n). Do not "fix" either spelling.
 */

export const BRAND = {
  name: "Yuanfenn",
  chineseName: "缘分",
  domain: "yuanfenbridge.com",
  url: "https://yuanfenbridge.com",
  tagline: "Your bridge to China, guided by fate.",
  madeIn: "Made in Guangzhou",
  year: 2026,
} as const;

// ---------------------------------------------------------------------------
// TODO: fill these in. They are intentionally empty; nothing is invented.
// While empty, the site degrades gracefully (see helpers below).
// ---------------------------------------------------------------------------
/** TODO: digits only, with country code, no "+" or spaces. e.g. 62812XXXXXXX */
export const WHATSAPP_NUMBER = "";
/** TODO: Instagram username without the "@". */
export const INSTAGRAM_HANDLE = "";
/** TODO: public contact email. Footer link is hidden while empty. */
export const CONTACT_EMAIL = "";

export type Lang = "id" | "en";
export const DEFAULT_LANG: Lang = "id";

export const SERVICE_IDS = ["tour", "shop", "admission", "medical"] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];

type Localized = Record<Lang, string>;

export const SERVICES: Record<
  ServiceId,
  { image: string; name: Localized; description: Localized; alt: Localized }
> = {
  tour: {
    image: "/brand/card-tour.jpg",
    name: { id: "Tour Guiding", en: "Tour Guiding" },
    description: {
      id: "Dipandu langsung di kota air, pegunungan, dan tempat wisata favorit.",
      en: "Guided in person through water towns, mountains and favourite sights.",
    },
    alt: {
      id: "Ilustrasi pemandu wisata membawa bendera di kota air Tiongkok, bersama turis yang memotret.",
      en: "Illustration of a tour guide with a flag in a Chinese water town, with a tourist taking photos.",
    },
  },
  shop: {
    image: "/brand/card-shop.jpg",
    name: { id: "Jasa Titip", en: "Personal Shopping" },
    description: {
      id: "Belanja langsung dari pasar grosir dan toko di Tiongkok, kami yang urus.",
      en: "We shop for you at China's wholesale markets and stores.",
    },
    alt: {
      id: "Ilustrasi dua perempuan di konter toko dengan tas kain.",
      en: "Illustration of two women at a shop counter with a tote bag.",
    },
  },
  medical: {
    image: "/brand/card-medical.jpg",
    name: { id: "Medical", en: "Medical" },
    description: {
      id: "Pendampingan berobat dan konsultasi di rumah sakit internasional.",
      en: "Support for treatment and consultations at international hospitals.",
    },
    alt: {
      id: "Ilustrasi ruang konsultasi rumah sakit: dokter berbicara dengan pasien.",
      en: "Illustration of a hospital consultation room with a doctor talking to patients.",
    },
  },
  admission: {
    image: "/brand/card-admission.jpg",
    name: { id: "Admission Kampus/Sekolah", en: "University & School Admission" },
    description: {
      id: "Bantu daftar kuliah dan sekolah di Tiongkok, dari berkas sampai tiba di kampus.",
      en: "Help applying to universities and schools in China, from paperwork to campus arrival.",
    },
    alt: {
      id: "Ilustrasi mahasiswa berjubah wisuda di kampus, salah satunya berhijab.",
      en: "Illustration of graduates in gowns on a campus, one wearing a hijab.",
    },
  },
};

export const NAV = {
  home: { id: "Beranda", en: "Home" },
  about: { id: "Tentang", en: "About" },
} as const;

export const COPY = {
  comingSoon: { left: { id: "COMING", en: "COMING" }, right: { id: "SOON", en: "SOON" } },
  logoAlt: {
    id: "Logo Yuanfenn: pita merah membentuk huruf Y dengan tulisan 缘分",
    en: "Yuanfenn logo: a red ribbon forming a Y above the characters 缘分",
  },
  scroll: { id: "Lihat layanan", en: "See our services" },
  services: {
    eyebrow: { id: "Layanan kami", en: "What we do" },
    title: { id: "Satu jembatan, empat cara menuju Tiongkok", en: "One bridge, four ways into China" },
  },
  // TODO: review this copy; the three steps describe the intended flow, not a finished process.
  hint: {
    eyebrow: { id: "Sekilas tentang kami", en: "A glimpse of what we do" },
    title: { id: "Jembatan antara Anda dan Tiongkok", en: "A bridge between you and China" },
    body: {
      id: "Yuanfenn membantu Anda menjelajah, berbelanja, berobat, dan berkuliah di Tiongkok, dengan pendampingan langsung dari tim kami.",
      en: "Yuanfenn helps you explore, shop, seek medical care and study in China, with hands-on support from our team.",
    },
    steps: [
      {
        title: { id: "Ceritakan kebutuhan Anda", en: "Tell us what you need" },
        text: { id: "Hubungi kami lewat WhatsApp dan sampaikan rencana Anda.", en: "Message us on WhatsApp and share your plans." },
      },
      {
        title: { id: "Kami yang mengatur", en: "We arrange it" },
        text: { id: "Kami bantu menyiapkan rencana, berkas, dan janji yang diperlukan.", en: "We help prepare the plan, paperwork and appointments." },
      },
      {
        title: { id: "Kami mendampingi", en: "We go with you" },
        text: { id: "Selama di Tiongkok, ada yang membantu Anda langkah demi langkah.", en: "While you are in China, someone helps you every step of the way." },
      },
    ],
  },
  about: {
    metaTitle: { id: "Tentang Yuanfenn | Your bridge to China", en: "About Yuanfenn | Your bridge to China" },
    eyebrow: { id: "Tentang kami", en: "About us" },
    title: { id: "Tentang Yuanfenn", en: "About Yuanfenn" },
    lead: {
      id: "Yuanfenn adalah jembatan Anda menuju Tiongkok, dibimbing oleh takdir.",
      en: "Yuanfenn is your bridge to China, guided by fate.",
    },
    meaningTitle: { id: "Apa arti 缘分?", en: "What does 缘分 mean?" },
    meaningPinyin: "yuánfèn",
    meaningBody: {
      id: "缘分 adalah gagasan Tionghoa tentang takdir yang mempertemukan dua orang atau dua hal. Itulah semangat kami: mempertemukan Anda dengan Tiongkok, dengan orang-orangnya, dan dengan peluangnya.",
      en: "缘分 is the Chinese idea of fate bringing two people, or two things, together. That is our spirit: connecting you with China, its people and its opportunities.",
    },
    ribbonTitle: { id: "Pita merah", en: "The red ribbon" },
    ribbonBody: {
      id: "Pita merah pada logo kami mengingatkan pada benang merah takdir dalam budaya Tionghoa, yang diyakini mengikat orang-orang yang ditakdirkan bertemu.",
      en: "The red ribbon in our logo recalls the red thread of fate in Chinese culture, said to bind people who are destined to meet.",
    },
    servicesTitle: { id: "Yang kami siapkan", en: "What we are preparing" },
    baseTitle: { id: "Dibuat di Guangzhou", en: "Made in Guangzhou" },
    baseBody: {
      id: "Yuanfenn lahir di Guangzhou, untuk menemani perjalanan Anda ke Tiongkok.",
      en: "Yuanfenn is made in Guangzhou, to accompany your journey to China.",
    },
    ctaTitle: { id: "Punya pertanyaan?", en: "Have a question?" },
  },
  intro: {
    id: "Layanan kami segera hadir. Hubungi kami sekarang atau daftar untuk kabar peluncuran.",
    en: "Our services are coming soon. Message us now or join the waitlist for launch news.",
  },
  ctaWhatsApp: { id: "Hubungi kami via WhatsApp", en: "Contact us on WhatsApp" },
  ctaInstagram: { id: "Ikuti di Instagram", en: "Follow on Instagram" },
  whatsappMessage: {
    id: "Halo Yuanfenn, saya ingin bertanya tentang layanan Anda.",
    en: "Hello Yuanfenn, I would like to ask about your services.",
  },
  waitlist: {
    title: { id: "Daftar waitlist", en: "Join the waitlist" },
    label: { id: "Alamat email", en: "Email address" },
    placeholder: { id: "nama@email.com", en: "name@email.com" },
    button: { id: "Daftar", en: "Join" },
    sending: { id: "Mengirim…", en: "Sending…" },
    invalid: { id: "Masukkan alamat email yang valid.", en: "Please enter a valid email address." },
    failed: { id: "Terjadi kesalahan. Coba lagi.", en: "Something went wrong. Please try again." },
    success: {
      id: "Terima kasih! Kami akan mengabari Anda saat Yuanfenn diluncurkan.",
      en: "Thank you! We'll let you know when Yuanfenn launches.",
    },
  },
  footer: {
    social: { id: "Media sosial", en: "Social links" },
    email: { id: "Email", en: "Email" },
  },
  langToggle: { id: "Bahasa", en: "Language" },
} as const;

// ---------------------------------------------------------------------------
// Link helpers
// ---------------------------------------------------------------------------

/** With no number set, wa.me opens WhatsApp's contact chooser with the text prefilled. */
export function whatsappUrl(lang: Lang): string {
  const text = encodeURIComponent(COPY.whatsappMessage[lang]);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function instagramUrl(): string {
  return INSTAGRAM_HANDLE
    ? `https://www.instagram.com/${INSTAGRAM_HANDLE}/`
    : "https://www.instagram.com/";
}

export function mailtoUrl(): string | null {
  return CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : null;
}
