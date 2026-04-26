export function getCountryMetaByISO2(iso2: string | null) {
  if (!iso2) return null;
  return {
    iso2: iso2.toUpperCase(),
    iso3: "",
    numeric: "",
    domain: "." + iso2.toLowerCase(),
    capital: "—",
    currencyCode: "",
    currencySymbol: "",
  };
}
