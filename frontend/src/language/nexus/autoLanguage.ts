import { resolveBestLanguage } from "./resolveLanguage";

type AppLanguage =
  | "en"
  | "fr"
  | "es"
  | "de"
  | "it"
  | "pt"
  | "nl"
  | "ja"
  | "zh"
  | "ar";

export function detectBestLanguageForCountry(
  countryIso2?: string,
  subdivisionIso?: string,
  fallback: AppLanguage = "en"
): AppLanguage {
  if (typeof navigator === "undefined") {
    return fallback;
  }

  const langs = navigator.languages?.length
    ? navigator.languages
    : navigator.language
      ? [navigator.language]
      : [fallback];

  const resolved = resolveBestLanguage(
    countryIso2,
    subdivisionIso,
    langs,
    fallback
  );

  return (resolved || fallback) as AppLanguage;
}