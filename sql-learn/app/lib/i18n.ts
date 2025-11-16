/**
 * Simple i18n utilities for SQL Learn
 * Supports Portuguese (pt-BR) and English (en) locales
 */

export type Locale = "en" | "pt-BR";

const LOCALE_STORAGE_KEY = "sql-learn-locale";

/**
 * Get the current locale from localStorage or browser preference
 */
export function getCurrentLocale(): Locale {
  if (typeof window === "undefined") return "pt-BR"; // Default for SSR

  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === "en" || stored === "pt-BR") return stored;

  // Default to Brazilian Portuguese (target market)
  return "pt-BR";
}

/**
 * Set the current locale and persist to localStorage
 */
export function setLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

/**
 * Get nested value from object using dot notation
 * Example: get(obj, 'home.title') returns obj.home.title
 */
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Translation function
 * @param key - Translation key in dot notation (e.g., "home.title")
 * @param translations - Translation object
 * @param fallback - Optional fallback text if key not found
 */
export function t(
  key: string,
  translations: Record<string, any>,
  fallback?: string
): string {
  const value = getNestedValue(translations, key);
  return value || fallback || key;
}

/**
 * Format number according to locale
 */
export function formatNumber(num: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "pt-BR" ? "pt-BR" : "en-US").format(num);
}

/**
 * Format date according to locale
 */
export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "pt-BR" ? "pt-BR" : "en-US").format(date);
}
