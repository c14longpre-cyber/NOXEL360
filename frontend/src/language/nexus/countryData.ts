export type CountryId = string;

export interface CountrySubdivisionInfo {
  iso: string;
  code: string;
  name: string;
  type?: string;
  flag?: string;
}

export interface CountryLanguageInfo {
  code?: string;
  name: string;
  nativeName?: string;
  official?: boolean;
  indigenous?: boolean;
}

export interface CountryInfo {
  id: CountryId;
  name: string;
  officialName?: string;
  capital?: string;
  iso2: string;
  iso3?: string;
  isoNumeric?: string;
  domain?: string;
  region?: string;
  subregion?: string;
  currency?: string;
  currencyCode?: string;
  currencySymbol?: string;
  flag?: string;
  officialLanguages?: string[];
  indigenousLanguages?: string[];
  languages?: CountryLanguageInfo[];
  subdivisions?: CountrySubdivisionInfo[];
  aliases?: string[];
  notes?: string;
}

export const COUNTRY_DATA: Record<CountryId, CountryInfo> = {
};

export function getCountryById(id?: string | null): CountryInfo | null {
  if (!id) return null;
  return COUNTRY_DATA[id.toLowerCase()] || null;
}

export function getCountryByISO2(iso2?: string | null): CountryInfo | null {
  if (!iso2) return null;
  const key = iso2.toLowerCase();
  return COUNTRY_DATA[key] || null;
}

export function getCountryByISO3(iso3?: string | null): CountryInfo | null {
  if (!iso3) return null;
  const key = iso3.toUpperCase();
  return Object.values(COUNTRY_DATA).find((c) => c.iso3 === key) || null;
}

export function getCountryPrimaryLanguage(country?: CountryInfo | null): string | null {
  if (!country) return null;
  return country.officialLanguages?.[0] || country.languages?.[0]?.name || null;
}
