export const locales = ['en', 'bn', 'ar'] as const;
export type Locale = typeof locales[number];

export function isLocale(l: string): l is Locale {
  return locales.includes(l as Locale);
}