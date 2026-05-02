import type { SupportedLanguage, TranslationDictionary } from "../types";
import { FULLY_TRANSLATED_LANGUAGES } from "../types";
import { en } from "./en";
import { fr } from "./fr";
import { es } from "./es";
import { de } from "./de";
import { it } from "./it";
import { pt } from "./pt";

export { FULLY_TRANSLATED_LANGUAGES };
export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

/**
 * Langues avec dictionnaire explicitement branché ici.
 * Les autres langues retombent sur l'anglais via le moteur i18n.
 */
export const TRANSLATIONS: Partial<Record<SupportedLanguage, TranslationDictionary>> = {
  en,
  fr,
  es,
  de,
  it,
  pt,

  nl: en,
  ja: en,
  zh: en,
  ar: en,
  ru: en,
  hi: en,
  ko: en,
  tr: en,
  fa: en,
  he: en,
  sv: en,
  no: en,
  da: en,
  fi: en,
  pl: en,
  cs: en,
  hu: en,
  ro: en,
  el: en,
  uk: en,
  id: en,
  th: en,
  vi: en,
  ms: en,
  bn: en,
};

/** Retourne true si la langue a un dictionnaire dédié */
export function isFullyTranslated(lang: SupportedLanguage): boolean {
  return (FULLY_TRANSLATED_LANGUAGES as readonly string[]).includes(lang);
}

/** Retourne le dictionnaire de la langue ou fallback anglais */
export function getTranslationDictionary(
  lang: SupportedLanguage
): TranslationDictionary {
  return TRANSLATIONS[lang] ?? en;
}


