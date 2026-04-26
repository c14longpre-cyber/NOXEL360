import { COUNTRY_META_BY_ISO2, type CountryMetaRow } from "./countryMetaData";

export type CountryMeta = {
  iso2: string;
  iso3?: string;
  numeric?: string;
  capital?: string;
  domain?: string;
  currencyCode?: string;
  currencySymbol?: string;
  region?: string;
  subregion?: string;
};

/**
 * Remplace la dépendance `world-countries` par notre table locale
 * `COUNTRY_META_BY_ISO2`. Si le pays n'est pas dans la table, on
 * renvoie un objet minimal avec uniquement l'ISO2 — l'UI affichera "—"
 * pour les champs manquants plutôt que de planter.
 */
export function getCountryMetaByISO2(
  iso2?: string | null
): CountryMeta | null {
  if (!iso2) return null;
  const key = iso2.toUpperCase();

  const row: CountryMetaRow | undefined = COUNTRY_META_BY_ISO2[key];

  if (!row) {
    return { iso2: key };
  }

  return {
    iso2: key,
    iso3: row.iso3,
    numeric: row.numeric,
    capital: row.capital,
    domain: row.domain,
    currencyCode: row.currencyCode,
    currencySymbol: row.currencySymbol,
    region: row.region,
    subregion: row.subregion,
  };
}
