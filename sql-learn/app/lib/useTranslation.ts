"use client";

import { useState, useEffect } from "react";
import { getCurrentLocale, setLocale as setLocalePersist, t, type Locale } from "./i18n";

// Import locale files
import enTranslations from "../locales/en.json";
import ptBRTranslations from "../locales/pt-BR.json";

const translations = {
  en: enTranslations,
  "pt-BR": ptBRTranslations,
};

/**
 * Hook for using translations in components
 * Returns translation function and current locale
 */
export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>("pt-BR");
  const [mounted, setMounted] = useState(false);

  // Load locale from localStorage on mount
  useEffect(() => {
    setLocaleState(getCurrentLocale());
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setLocalePersist(newLocale);
    // Force page reload to apply translations everywhere
    window.location.reload();
  };

  const translate = (key: string, params?: Record<string, string | number>): string => {
    const currentTranslations = translations[locale];
    let text = t(key, currentTranslations, key);

    // Simple parameter substitution
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(new RegExp(`{{${paramKey}}}`, "g"), String(value));
      });
    }

    return text;
  };

  // Return default values during SSR/initial render
  if (!mounted) {
    return {
      t: translate,
      locale: "pt-BR" as Locale,
      setLocale,
    };
  }

  return {
    t: translate,
    locale,
    setLocale,
  };
}
