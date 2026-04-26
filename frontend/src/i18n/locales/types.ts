/**
 * Types pour le système i18n NOXEL.
 */

/** Code d'une langue supportée */
export type SupportedLanguage =
  | "en" | "fr" | "es" | "de" | "it" | "pt"
  | "nl" | "ja" | "zh" | "ar" | "ru" | "hi"
  | "ko" | "tr" | "fa" | "he" | "sv" | "no"
  | "da" | "fi" | "pl" | "cs" | "hu" | "ro"
  | "el" | "uk" | "id" | "th" | "vi" | "ms" | "bn";

/** Code de langue générique (ex: "fr-CA", "ike") */
export type AppLanguage = string;

export type TranslationValue = string;
export type TranslationDictionary = Record<string, TranslationValue>;
export type TranslationParams = Record<string, string | number>;

export type TranslationStatus =
  | "complete"
  | "partial"
  | "untranslated"
  | "missing";

export type LanguageOption = {
  code: AppLanguage;
  label: string;
  nativeLabel: string;
  flag?: string;
  family?: string;
  indigenous?: boolean;
  direction?: "ltr" | "rtl";
  translationStatus?: TranslationStatus;
};

//
// 🔥 NOXEL TRANSLATION TIERS
//

/** Langues 100% validées (UX + contenu complet) */
export const CORE_FULLY_TRANSLATED_LANGUAGES = [
  "en",
  "fr",
  "es",
  "de",
  "it",
  "pt",
] as const;

/** Langues avec fichiers présents (ex: zip 115 langues) */
export const EXTENDED_TRANSLATED_LANGUAGES: SupportedLanguage[] = [
  "en","fr","es","de","it","pt",
  "nl","ja","zh","ar","ru","hi",
  "ko","tr","fa","he","sv","no",
  "da","fi","pl","cs","hu","ro",
  "el","uk","id","th","vi","ms","bn",
];

/** Langues officiellement considérées "fully translated" */
export const FULLY_TRANSLATED_LANGUAGES: SupportedLanguage[] = [
  ...CORE_FULLY_TRANSLATED_LANGUAGES,
  // 👉 tu peux ajouter ici dynamiquement plus tard
];