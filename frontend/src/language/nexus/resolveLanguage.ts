import { COUNTRY_DATA } from "./countryData";
import { SUBDIVISION_LANGUAGE_OVERRIDES } from "./subdivisionLanguage";

export function resolveBestLanguage(
  countryIso2?: string,
  subdivisionIso?: string,
  userLanguages: readonly string[] = [],
  defaultLang = "en"
): string {
  const country = countryIso2
    ? COUNTRY_DATA[countryIso2.toLowerCase()]
    : null;

  const subdivisionLangs =
    subdivisionIso && SUBDIVISION_LANGUAGE_OVERRIDES[subdivisionIso]
      ? SUBDIVISION_LANGUAGE_OVERRIDES[subdivisionIso]
      : null;

  const countryLangs =
    country?.languages
      ?.filter((lang) => lang.official)
      .map((lang) => lang.code)
      .filter((code): code is string => Boolean(code)) || [];

  const available = subdivisionLangs || countryLangs;

  if (available.length > 0) {
    for (const lang of userLanguages) {
      const normalized = lang.toLowerCase();
      const base = normalized.split("-")[0];

      if (available.includes(normalized)) return normalized;
      if (available.includes(base)) return base;
    }

    return available[0];
  }

  return defaultLang;
}

