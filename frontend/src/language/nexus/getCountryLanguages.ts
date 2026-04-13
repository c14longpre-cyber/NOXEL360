import countryLanguages from "./countryLanguages.json";

export type Lang = {
  code: string;
  nameNative: string;
  nameEnglish: string;
  isOfficial: boolean;
};

export type CountryLangEntry = {
  countryCode: string;          // "RU"
  countryName: string;          // "Russia"
  countryNativeName?: string;   // "Россия" (si présent)
  languages: Lang[];
};

export function getCountryEntry(svgId?: string | null): CountryLangEntry | null {
  if (!svgId) return null;
  const iso2 = svgId.toUpperCase();
  const entry = (countryLanguages as CountryLangEntry[]).find(e => e.countryCode === iso2);
  return entry ?? null;
}

export function getCountryLanguages(svgId?: string | null): Lang[] {
  return getCountryEntry(svgId)?.languages ?? [];
}
