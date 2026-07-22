import { COUNTRY_DATA } from "./countryData";
const FALLBACK = {
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
export function getCountryInfo(id) {
    if (!id)
        return FALLBACK;
    return COUNTRY_DATA[id] ?? { ...FALLBACK, id, name: `Unknown (${id})` };
}
