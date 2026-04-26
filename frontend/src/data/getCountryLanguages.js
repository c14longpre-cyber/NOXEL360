import countryLanguages from "./countryLanguages.json";
export function getCountryEntry(iso2) {
    if (!iso2)
        return null;
    const key = iso2.toUpperCase();
    const data = countryLanguages;
    return data[key] ?? data[key.toLowerCase()] ?? null;
}
export function getCountryLanguages(iso2) {
    const entry = getCountryEntry(iso2);
    return entry?.languages ?? [];
}
