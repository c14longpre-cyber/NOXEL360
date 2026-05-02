/**
 * Types pour le système i18n NOXEL.
 */

/** Code d'une langue supportée */
export type SupportedLanguage =
  | "af"
  | "am"
  | "ar"
  | "ay"
  | "az"
  | "be"
  | "bg"
  | "bi"
  | "bn"
  | "bs"
  | "ca"
  | "ch"
  | "cs"
  | "da"
  | "de"
  | "dv"
  | "dz"
  | "el"
  | "en"
  | "es"
  | "et"
  | "eu"
  | "fa"
  | "ff"
  | "fi"
  | "fj"
  | "fo"
  | "fr"
  | "ga"
  | "gl"
  | "gn"
  | "gv"
  | "he"
  | "hi"
  | "hr"
  | "ht"
  | "hu"
  | "hy"
  | "id"
  | "is"
  | "it"
  | "ja"
  | "ka"
  | "kg"
  | "kk"
  | "kl"
  | "km"
  | "ko"
  | "ku"
  | "ky"
  | "la"
  | "lb"
  | "ln"
  | "lo"
  | "lt"
  | "lu"
  | "lv"
  | "mg"
  | "mh"
  | "mi"
  | "mk"
  | "mn"
  | "ms"
  | "mt"
  | "my"
  | "na"
  | "nb"
  | "nd"
  | "ne"
  | "nl"
  | "nn"
  | "no"
  | "nr"
  | "ny"
  | "oc"
  | "pa"
  | "pl"
  | "ps"
  | "pt"
  | "qu"
  | "rn"
  | "ro"
  | "ru"
  | "rw"
  | "sg"
  | "si"
  | "sk"
  | "sl"
  | "sm"
  | "sn"
  | "so"
  | "sq"
  | "sr"
  | "ss"
  | "st"
  | "sv"
  | "sw"
  | "ta"
  | "tg"
  | "th"
  | "ti"
  | "tk"
  | "tl"
  | "tn"
  | "to"
  | "tr"
  | "ts"
  | "uk"
  | "ur"
  | "uz"
  | "ve"
  | "vi"
  | "xh"
  | "zh"
  | "zu";

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

/** Langues 100% validées (mêmes clés que en.ts) */
export const CORE_FULLY_TRANSLATED_LANGUAGES = [
  "af", "am", "ar", "ay", "az", "be", "bg", "bi", "bn", "bs", "ca", "ch", "cs", "da", "de", "dv", "dz", "el", "en", "es", "et", "eu", "fa", "ff", "fi", "fj", "fo", "fr", "ga", "gl", "gn", "gv", "he", "hi", "hr", "ht", "hu", "hy", "id", "is", "it", "ja", "ka", "kg", "kk", "kl", "km", "ko", "ku", "ky", "la", "lb", "ln", "lo", "lt", "lu", "lv", "mg", "mh", "mi", "mk", "mn", "ms", "mt", "my", "na", "nb", "nd", "ne", "nl", "nn", "no", "nr", "ny", "oc", "pa", "pl", "ps", "pt", "qu", "rn", "ro", "ru", "rw", "sg", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "ss", "st", "sv", "sw", "ta", "tg", "th", "ti", "tk", "tl", "tn", "to", "tr", "ts", "uk", "ur", "uz", "ve", "vi", "xh", "zh", "zu"
] as const;

/** Langues avec fichiers présents dans /locales */
export const EXTENDED_TRANSLATED_LANGUAGES: SupportedLanguage[] = [
  "af", "am", "ar", "ay", "az", "be", "bg", "bi", "bn", "bs", "ca", "ch", "cs", "da", "de", "dv", "dz", "el", "en", "es", "et", "eu", "fa", "ff", "fi", "fj", "fo", "fr", "ga", "gl", "gn", "gv", "he", "hi", "hr", "ht", "hu", "hy", "id", "is", "it", "ja", "ka", "kg", "kk", "kl", "km", "ko", "ku", "ky", "la", "lb", "ln", "lo", "lt", "lu", "lv", "mg", "mh", "mi", "mk", "mn", "ms", "mt", "my", "na", "nb", "nd", "ne", "nl", "nn", "no", "nr", "ny", "oc", "pa", "pl", "ps", "pt", "qu", "rn", "ro", "ru", "rw", "sg", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "ss", "st", "sv", "sw", "ta", "tg", "th", "ti", "tk", "tl", "tn", "to", "tr", "ts", "uk", "ur", "uz", "ve", "vi", "xh", "zh", "zu"
];

/** Langues officiellement considérées fully translated */
export const FULLY_TRANSLATED_LANGUAGES: SupportedLanguage[] = [
  "af", "am", "ar", "ay", "az", "be", "bg", "bi", "bn", "bs", "ca", "ch", "cs", "da", "de", "dv", "dz", "el", "en", "es", "et", "eu", "fa", "ff", "fi", "fj", "fo", "fr", "ga", "gl", "gn", "gv", "he", "hi", "hr", "ht", "hu", "hy", "id", "is", "it", "ja", "ka", "kg", "kk", "kl", "km", "ko", "ku", "ky", "la", "lb", "ln", "lo", "lt", "lu", "lv", "mg", "mh", "mi", "mk", "mn", "ms", "mt", "my", "na", "nb", "nd", "ne", "nl", "nn", "no", "nr", "ny", "oc", "pa", "pl", "ps", "pt", "qu", "rn", "ro", "ru", "rw", "sg", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "ss", "st", "sv", "sw", "ta", "tg", "th", "ti", "tk", "tl", "tn", "to", "tr", "ts", "uk", "ur", "uz", "ve", "vi", "xh", "zh", "zu"
];


