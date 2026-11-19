import {
  CONTACT_EMAIL,
  INSTAGRAM_HANDLE,
  THREADS_HANDLE,
  WECHAT_ID,
  WHATSAPP_NUMBER,
  isPlaceholder,
} from "@/data/placeholders";

/**
 * With a placeholder number, wa.me opens WhatsApp's contact chooser with the
 * text prefilled. It never points at a number until a real one is configured.
 */
export function whatsappUrl(message: string): string {
  const number = isPlaceholder(WHATSAPP_NUMBER) ? "" : WHATSAPP_NUMBER;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function instagramUrl(): string {
  return isPlaceholder(INSTAGRAM_HANDLE)
    ? "https://www.instagram.com/"
    : `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;
}

export function threadsUrl(): string {
  return `https://www.threads.com/@${THREADS_HANDLE}`;
}

/** null while the email is still a placeholder. */
export function mailtoUrl(): string | null {
  return isPlaceholder(CONTACT_EMAIL) ? null : `mailto:${CONTACT_EMAIL}`;
}

export const hasRealContact = {
  whatsapp: !isPlaceholder(WHATSAPP_NUMBER),
  instagram: !isPlaceholder(INSTAGRAM_HANDLE),
  email: !isPlaceholder(CONTACT_EMAIL),
  wechat: !isPlaceholder(WECHAT_ID),
  threads: !isPlaceholder(THREADS_HANDLE),
};
