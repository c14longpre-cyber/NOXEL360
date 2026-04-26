import countryLanguages from "./countryLanguages.json";
export function getCountryEntry(svgId) {
    if (!svgId)
        return null;
    const iso2 = svgId.toUpperCase();
    const entry = countryLanguages.find(e => e.countryCode === iso2);
    return entry ?? null;
}
export function getCountryLanguages(svgId) {
    return getCountryEntry(svgId)?.languages ?? [];
}
