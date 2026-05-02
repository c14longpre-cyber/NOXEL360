import countryLanguages from "./countryLanguages.json";

export function getCountryEntry(iso2: string | null) {
  if (!iso2) return null;
  const key = iso2.toUpperCase();
  const data: any = countryLanguages as any;
  return data[key] ?? data[key.toLowerCase()] ?? null;
}

export function getCountryLanguages(iso2: string | null) {
  const entry: any = getCountryEntry(iso2);
  return entry?.languages ?? [];
}


