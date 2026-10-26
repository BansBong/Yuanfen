"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LANG, type Lang } from "@/data/site";

type Ctx = { lang: Lang; setLang: (l: Lang) => void };

const LanguageContext = createContext<Ctx>({ lang: DEFAULT_LANG, setLang: () => {} });

export function useLang() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("yf-lang", l);
    } catch {}
  }, []);

  // Restore a saved choice after hydration (keeps server and first client render identical).
  useEffect(() => {
    try {
      const saved = localStorage.getItem("yf-lang");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === "id" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
