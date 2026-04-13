import countries from "world-countries";
import getSymbolFromCurrency from "currency-symbol-map";

export type CountryMeta = {
  iso2: string;
  iso3?: string;
  numeric?: string;
  capital?: string;
  domain?: string;
  currencyCode?: string;
  currencySymbol?: string;
};

type WorldCountry = {
  cca2: string;
  cca3?: string;
  ccn3?: string;
  capital?: string[];
  tld?: string[];
  currencies?: Record<string, unknown>;
};

export function getCountryMetaByISO2(
  iso2?: string | null
): CountryMeta | null {
  if (!iso2) return null;

  const key = iso2.toUpperCase();

  const c = (countries as WorldCountry[]).find(
    (x) => x.cca2 === key
  );

  if (!c) {
    return { iso2: key };
  }

  const currencyCode = c.currencies
    ? Object.keys(c.currencies)[0]
    : undefined;

  const currencySymbol = currencyCode
    ? getSymbolFromCurrency(currencyCode)
    : undefined;

  return {
    iso2: key,
    iso3: c.cca3,
    numeric: c.ccn3,
    capital: c.capital?.[0],
    domain: c.tld?.[0],
    currencyCode,
    currencySymbol,
  };
}
