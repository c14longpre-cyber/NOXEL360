import type {
  SupportedLanguage,
  TranslationDictionary,
  TranslationParams,
} from "./types";
import { DEFAULT_LANGUAGE, TRANSLATIONS } from "./locales";

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template;

  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = params[key];
    return value === undefined || value === null ? `{${key}}` : String(value);
  });
}

function getDictionary(language: SupportedLanguage): TranslationDictionary {
  return TRANSLATIONS[language] || TRANSLATIONS[DEFAULT_LANGUAGE];
}

export function hasTranslation(language: SupportedLanguage, key: string): boolean {
  const dict = getDictionary(language);
  return Boolean(dict[key]);
}

export function translate(
  language: SupportedLanguage,
  key: string,
  params?: TranslationParams,
  fallback?: string
): string {
  const dict = getDictionary(language);
  const defaultDict = getDictionary(DEFAULT_LANGUAGE);

  const value = dict[key] ?? defaultDict[key] ?? fallback ?? key;
  return interpolate(value, params);
}