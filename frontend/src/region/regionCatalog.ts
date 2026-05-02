/**
 * Catalogue des régions NOXEL.
 *
 * Sources combinées :
 *   1. `countryLanguages.json` (250 pays, langues officielles)
 *   2. `countryMetaData.ts` (~60 pays avec méta riche)
 *   3. `timezoneMap.ts` (timezones IANA par pays)
 *   4. Cette table : système de mesure, format horaire, premier jour,
 *      code appel, drapeau
 *
 * Le résultat : 250 `RegionInfo` complets, utilisables dans tout le
 * moteur de formatage `Intl`.
 */

import countryLanguagesRaw from "../language/nexus/countryLanguages.json";
import { COUNTRY_META_BY_ISO2 } from "../language/nexus/countryMetaData";
import { TIMEZONE_BY_REGION } from "./timezoneMap";
import type {
  RegionInfo,
  MeasurementSystem,
  FirstDayOfWeek,
  TimeFormat,
} from "./types";

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

/**
 * Système de mesure par pays.
 * Par défaut : métrique. Seuls les pays encore en impérial sont listés.
 * Sources : Wikipedia — "Metrication by country"
 */
const IMPERIAL_REGIONS = new Set<string>([
  "US", // principal utilisateur de l'impérial
  "LR", // Libéria
  "MM", // Myanmar (transition en cours)
]);

/**
 * Pays où le format 12h domine.
 * Les autres utilisent le 24h par défaut.
 */
const TWELVE_HOUR_REGIONS = new Set<string>([
  "US", "CA", "AU", "NZ", "PH", "IN", "PK", "BD", "LK", "NP",
  "EG", "SA", "AE", "JO", "KW", "BH", "QA", "OM", "YE",
  "CO", "MX", "DO", "PA", "CR", "GT", "HN", "NI", "SV", "VE",
  "GR", "MT",
]);

/**
 * Premier jour de la semaine par pays.
 * 0 = dimanche, 1 = lundi, 6 = samedi.
 * Par défaut : lundi (ISO 8601). Liste uniquement les exceptions.
 */
const FIRST_DAY_EXCEPTIONS: Record<string, FirstDayOfWeek> = {
  US: 0, CA: 0, MX: 0, CO: 0, PA: 0, VE: 0, PE: 0, DO: 0, GT: 0, HN: 0,
  NI: 0, SV: 0, JM: 0, BZ: 0, BO: 0, BR: 0, AR: 0,
  JP: 0, KR: 0, TW: 0, CN: 0, HK: 0, PH: 0, TH: 0, LA: 0, KH: 0, MM: 0,
  IN: 0, PK: 0, BD: 0, NP: 0, LK: 0, BT: 0, MV: 0,
  IL: 0, ZA: 0, ZW: 0, BW: 0,
  // Samedi : certains pays du Moyen-Orient
  SA: 6, YE: 6, BH: 6, KW: 6, QA: 6, OM: 6, EG: 6, AE: 6, JO: 6, IQ: 6,
  LY: 6, DZ: 6, SD: 6, SY: 6,
};

/**
 * Codes d'appel internationaux par pays (+X).
 */
const CALLING_CODE: Record<string, string> = {
  CA: "+1", US: "+1", MX: "+52", BR: "+55", AR: "+54", CL: "+56", CO: "+57",
  PE: "+51", VE: "+58", UY: "+598", PY: "+595", BO: "+591", EC: "+593",
  FR: "+33", DE: "+49", ES: "+34", IT: "+39", PT: "+351", NL: "+31",
  BE: "+32", CH: "+41", AT: "+43", GB: "+44", IE: "+353", SE: "+46",
  NO: "+47", DK: "+45", FI: "+358", IS: "+354", PL: "+48", CZ: "+420",
  HU: "+36", RO: "+40", GR: "+30", UA: "+380", RU: "+7", TR: "+90",
  CN: "+86", JP: "+81", KR: "+82", IN: "+91", ID: "+62", TH: "+66",
  VN: "+84", PH: "+63", MY: "+60", SG: "+65", BD: "+880", PK: "+92",
  IR: "+98", IL: "+972", SA: "+966", AE: "+971", EG: "+20", MA: "+212",
  DZ: "+213", TN: "+216", ZA: "+27", NG: "+234", KE: "+254", ET: "+251",
  SN: "+221", AU: "+61", NZ: "+64",
};

/**
 * Drapeaux emoji — calculés à partir du code ISO.
 */
function flagForRegion(iso2: string): string {
  if (!iso2 || iso2.length !== 2) return "🌐";
  // Les drapeaux emoji sont formés de Regional Indicator Symbols
  // A = U+1F1E6, donc "CA" = 🇨🇦 = U+1F1E8 U+1F1E6
  const base = 0x1f1e6;
  const a = "A".charCodeAt(0);
  const c1 = iso2.charCodeAt(0) - a + base;
  const c2 = iso2.charCodeAt(1) - a + base;
  return String.fromCodePoint(c1, c2);
}

function buildRegionCatalog(): Record<string, RegionInfo> {
  const out: Record<string, RegionInfo> = {};
  const raw = countryLanguagesRaw as RawCountry[];

  for (const row of raw) {
    const code = row.countryCode?.toUpperCase();
    if (!code || code.length !== 2) continue;

    const meta = COUNTRY_META_BY_ISO2[code];

    const officialLanguages =
      row.languages
        ?.filter((l) => l.isOfficial)
        .map((l) => l.code?.toLowerCase())
        .filter((x): x is string => Boolean(x)) || [];

    const defaultLanguage = officialLanguages[0];

    const measurement: MeasurementSystem = IMPERIAL_REGIONS.has(code)
      ? "imperial"
      : "metric";

    const timeFormat: TimeFormat = TWELVE_HOUR_REGIONS.has(code) ? "12h" : "24h";

    const firstDay: FirstDayOfWeek =
      FIRST_DAY_EXCEPTIONS[code] !== undefined ? FIRST_DAY_EXCEPTIONS[code] : 1;

    out[code] = {
      code,
      name: row.countryName,
      nativeName: row.countryNativeName,
      flag: flagForRegion(code),
      region: meta?.region,
      subregion: meta?.subregion,
      capital: meta?.capital,
      currencyCode: meta?.currencyCode,
      currencySymbol: meta?.currencySymbol,
      callingCode: CALLING_CODE[code],
      domain: meta?.domain,
      timezone: TIMEZONE_BY_REGION[code] || "UTC",
      timezones: TIMEZONE_BY_REGION[code] ? [TIMEZONE_BY_REGION[code]] : ["UTC"],
      measurementSystem: measurement,
      firstDayOfWeek: firstDay,
      timeFormat,
      officialLanguages,
      defaultLanguage,
    };
  }

  return out;
}

export const REGION_CATALOG: Record<string, RegionInfo> = buildRegionCatalog();

export const ALL_REGIONS: RegionInfo[] = Object.values(REGION_CATALOG).sort(
  (a, b) => a.name.localeCompare(b.name)
);

export function getRegionInfo(code: string | null | undefined): RegionInfo | null {
  if (!code) return null;
  return REGION_CATALOG[code.toUpperCase()] || null;
}

export function isSupportedRegion(code: string | null | undefined): boolean {
  if (!code) return false;
  return Boolean(REGION_CATALOG[code.toUpperCase()]);
}

/** Région par défaut quand tout échoue. */
export const DEFAULT_REGION = "US";


