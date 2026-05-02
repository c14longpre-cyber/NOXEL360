import { COUNTRY_DATA, CountryInfo } from "./countryData";

const FALLBACK: CountryInfo = {
  id: "",
  name: "Unknown",
  capital: "—",
  officialLanguages: [],
  indigenousLanguages: [],
  currency: "—",
  iso2: "—",
  iso3: "—",
  isoNumeric: "—",
  domain: "—",
  region: "—",
};

export function getCountryInfo(id?: string | null): CountryInfo {
  if (!id) return FALLBACK;
  return COUNTRY_DATA[id] ?? { ...FALLBACK, id, name: `Unknown (${id})` };
}


