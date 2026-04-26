/**
 * Système de région NOXEL — séparé du système de langue.
 *
 * Principe : `locale = langue + région`. L'utilisateur peut parler
 * français mais vivre au Canada → dates au format canadien, devise CAD,
 * timezone America/Montreal, etc. indépendamment du fait que l'UI
 * s'affiche en français.
 *
 * Codes région : ISO 3166-1 alpha-2 (ex: "CA", "FR", "JP").
 * Codes locale combinés : BCP 47 (ex: "fr-CA", "en-US", "pt-BR").
 */

/** Code région ISO 3166-1 alpha-2, majuscule. */
export type RegionCode = string;

/** Famille d'unités de mesure. */
export type MeasurementSystem = "metric" | "imperial";

/** Jour de début de semaine (0 = dimanche, 1 = lundi). */
export type FirstDayOfWeek = 0 | 1 | 6;

/** Format horaire préféré. */
export type TimeFormat = "12h" | "24h";

/** Métadonnées complètes d'une région. */
export type RegionInfo = {
  code: RegionCode;
  /** Nom en anglais */
  name: string;
  /** Nom natif (dans la langue principale de la région) */
  nativeName?: string;
  /** Drapeau emoji */
  flag: string;
  /** Continent / région ONU */
  region?: string;
  /** Sous-région */
  subregion?: string;
  /** Capitale */
  capital?: string;
  /** Code devise ISO 4217 (ex: "CAD", "EUR") */
  currencyCode?: string;
  /** Symbole de devise (ex: "$", "€") */
  currencySymbol?: string;
  /** Code appel international (ex: "+1", "+33") */
  callingCode?: string;
  /** TLD internet principal */
  domain?: string;
  /** Timezone canonique IANA (ex: "America/Montreal") */
  timezone?: string;
  /** Toutes les timezones utilisées dans cette région */
  timezones?: string[];
  /** Système de mesure par défaut */
  measurementSystem?: MeasurementSystem;
  /** Jour de début de semaine */
  firstDayOfWeek?: FirstDayOfWeek;
  /** Format horaire par défaut */
  timeFormat?: TimeFormat;
  /** Langues officielles (codes ISO 639-1 / 639-3) */
  officialLanguages?: string[];
  /** Langue par défaut si l'utilisateur n'en a pas choisi */
  defaultLanguage?: string;
};

/**
 * Préférences utilisateur qui **override** les défauts régionaux.
 * Utile quand un Canadien veut voir les températures en °F, ou qu'un
 * Français en voyage au Japon garde ses formats FR.
 */
export type RegionPreferences = {
  /** Override de timezone (null = auto depuis région) */
  timezone?: string | null;
  /** Override de système de mesure */
  measurementSystem?: MeasurementSystem | null;
  /** Override format horaire */
  timeFormat?: TimeFormat | null;
  /** Override premier jour de semaine */
  firstDayOfWeek?: FirstDayOfWeek | null;
  /** Override code devise d'affichage (pas la devise réelle, juste celle affichée) */
  preferredCurrency?: string | null;
  /** Override calendrier (ex: "gregory", "islamic", "buddhist") */
  calendar?: string | null;
  /** Override système numérique (ex: "latn", "arab", "deva") */
  numberingSystem?: string | null;
};

/** Résultat de la détection automatique de région. */
export type RegionDetectionResult = {
  code: RegionCode;
  /** Source de la détection, pour debug / affichage */
  source:
    | "stored"
    | "timezone"
    | "navigator"
    | "language"
    | "fallback";
  /** Timezone détectée si connue */
  timezone?: string;
};
