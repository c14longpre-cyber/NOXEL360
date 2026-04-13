import type { SupportedLanguage, TranslationDictionary } from "../types";
import { en } from "./en";
import { fr } from "./fr";
import { es } from "./es";

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en,
  fr,
  es,

  de: en,
  it: en,
  pt: en,
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