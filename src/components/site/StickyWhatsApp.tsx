import { MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { whatsappUrl } from "@/lib/contact";

/** Always-visible WhatsApp shortcut on phones. */
export async function StickyWhatsApp() {
  const t = await getTranslations("common");
  return (
    <a
      href={whatsappUrl(t("whatsappMessage"))}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-30 inline-flex min-h-14 items-center gap-3 rounded-full bg-[#1f8f4e] px-5 text-lg font-semibold text-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.5)] hover:bg-[#177a40] lg:hidden"
    >
      <MessageCircle aria-hidden="true" className="size-6" />
      {t("whatsapp")}
    </a>
  );
}
