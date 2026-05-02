import countryLanguagesRaw from "./countryLanguages.json";
import { COUNTRY_META_BY_ISO2 } from "./countryMetaData";
import { INDIGENOUS_BY_ISO2 } from "./indigenous";

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

type RawLanguage = {
  code: string;
  nameNative?: string;
  nameEnglish?: string;
  isOfficial?: boolean;
};

type RawCountry = {
  countryCode: string;
  countryName: string;
  countryNativeName?: string;
  languages?: RawLanguage[];
};

function buildCountryData(): Record<CountryId, CountryInfo> {
  const out: Record<CountryId, CountryInfo> = {};
  const raw = countryLanguagesRaw as RawCountry[];

  for (const row of raw) {
    const iso2 = row.countryCode?.toUpperCase();
    if (!iso2 || iso2.length !== 2) continue;

    const id = iso2.toLowerCase();

    const officialLanguages =
      row.languages
        ?.filter((l) => l.isOfficial)
        .map((l) => l.nameEnglish || l.code)
        .filter(Boolean) || [];

    const allLangs: CountryLanguageInfo[] =
      row.languages?.map((l) => ({
        code: l.code,
        name: l.nameEnglish || l.code,
        nativeName: l.nameNative,
        official: l.isOfficial,
      })) || [];

    const indigenousNations = INDIGENOUS_BY_ISO2[iso2] || [];
    const indigenousLanguages: string[] = [];
    for (const nation of indigenousNations) {
      for (const lang of nation.languages || []) {
        if (lang.label && !indigenousLanguages.includes(lang.label)) {
          indigenousLanguages.push(lang.label);
        }
      }
    }
    if (indigenousLanguages.length > 0) {
      for (const ind of indigenousLanguages) {
        if (!allLangs.some((x) => x.name === ind)) {
          allLangs.push({ name: ind, indigenous: true });
        }
      }
    }

    const meta = COUNTRY_META_BY_ISO2[iso2];

    out[id] = {
      id,
      name: row.countryName,
      officialName: row.countryName,
      iso2,
      iso3: meta?.iso3,
      isoNumeric: meta?.numeric,
      capital: meta?.capital,
      domain: meta?.domain,
      region: meta?.region,
      subregion: meta?.subregion,
      currency: meta?.currencyCode,
      currencyCode: meta?.currencyCode,
      currencySymbol: meta?.currencySymbol,
      flag: `https://flagcdn.com/w160/${iso2.toLowerCase()}.png`,
      officialLanguages,
      indigenousLanguages,
      languages: allLangs,
    };
  }

  return out;
}

export const COUNTRY_DATA: Record<CountryId, CountryInfo> = buildCountryData();

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

export const ALL_COUNTRIES: CountryInfo[] = Object.values(COUNTRY_DATA).sort((a, b) =>
  a.name.localeCompare(b.name)
);


