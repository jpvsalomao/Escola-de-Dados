"use client";

import { useTranslation } from "../lib/useTranslation";

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border-2 border-gray-200 p-1 shadow-sm">
      <button
        onClick={() => setLocale("pt-BR")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          locale === "pt-BR"
            ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
        aria-label="Mudar para Português"
      >
        🇧🇷 PT
      </button>
      <button
        onClick={() => setLocale("en")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          locale === "en"
            ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
        aria-label="Switch to English"
      >
        🇺🇸 EN
      </button>
    </div>
  );
}
