/**
 * Registre central des langues supportées par NOXEL.
 *
 * Combine :
 *   1. Les 184 langues ISO 639-1 (via data/iso_639-1.json)
 *   2. Des codes autochtones/étendus (iu, ike, nv, etc. via ISO 639-2/3)
 *      que l'on ajoute manuellement avec respect des endonymes.
 *
 * Chaque langue est disponible au choix dans l'interface. La présence
 * d'une traduction dédiée est signalée séparément par `translationStatus`.
 */

import iso639Raw from "./data/iso_639-1.json";
import type { AppLanguage, LanguageOption, TranslationStatus } from "./types";

type IsoEntry = {
  "639-1"?: string;
  "639-2"?: string;
  family?: string;
  name?: string;
  nativeName?: string;
  wikiUrl?: string;
};

const ISO639 = iso639Raw as Record<string, IsoEntry>;

/**
 * Liste des codes qui ont un dictionnaire de traduction UI complet.
 * À mettre à jour quand on ajoute un fichier `locales/XX.ts` réel.
 */
export const FULLY_TRANSLATED_CODES = new Set<string>([
  "en", "fr", "es", "de", "it", "pt", "zh", "ar", "hi", "ru", "ja", "ko", "tr", "nl", "pl", "sv", "da", "fi", "no", "cs", "hu", "ro", "uk", "id", "vi", "th",
]);

/**
 * Langues à sens de lecture RTL.
 */
const RTL_CODES = new Set<string>([
  "ar", "he", "fa", "ur", "ps", "sd", "yi", "ug", "ku",
]);

/**
 * Langues autochtones / minoritaires ajoutées en plus de l'ISO 639-1.
 * Codes : on privilégie ISO 639-3 quand disponible.
 *
 * Les endonymes sont tirés de sources officielles et référencées par
 * les communautés concernées (pas de traduction automatique — respect
 * des écritures originales).
 */
type IndigenousSeed = {
  code: string;
  label: string;
  nativeLabel: string;
  flag?: string;
  family?: string;
  direction?: "ltr" | "rtl";
};

const INDIGENOUS_SEEDS: IndigenousSeed[] = [
  // Amérique du Nord — Premières Nations, Inuit, Métis
  { code: "iu",  label: "Inuktitut",        nativeLabel: "ᐃᓄᒃᑎᑐᑦ",             flag: "🇨🇦", family: "Eskimo–Aleut" },
  { code: "ike", label: "Eastern Canadian Inuktitut", nativeLabel: "ᐃᓄᒃᑎᑐᑦ",   flag: "🇨🇦", family: "Eskimo–Aleut" },
  { code: "ikt", label: "Inuinnaqtun",      nativeLabel: "Inuinnaqtun",          flag: "🇨🇦", family: "Eskimo–Aleut" },
  { code: "cr",  label: "Cree",             nativeLabel: "Nēhiyawēwin",         flag: "🇨🇦", family: "Algonquian" },
  { code: "oj",  label: "Ojibwe",           nativeLabel: "Anishinaabemowin",    flag: "🇨🇦", family: "Algonquian" },
  { code: "moh", label: "Mohawk",           nativeLabel: "Kanienʼkéha",          flag: "🇨🇦", family: "Iroquoian" },
  { code: "mic", label: "Miꞌkmaq",           nativeLabel: "Lnuismk",              flag: "🇨🇦", family: "Algonquian" },
  { code: "ath", label: "Dene Suliné",      nativeLabel: "Dënesųłiné",          flag: "🇨🇦", family: "Dené–Yeniseian" },
  { code: "bla", label: "Blackfoot",        nativeLabel: "Siksiká",             flag: "🇨🇦", family: "Algonquian" },
  { code: "crg", label: "Michif",           nativeLabel: "Michif",               flag: "🇨🇦", family: "Creole" },

  // États-Unis — Native American
  { code: "nv",  label: "Navajo",           nativeLabel: "Diné bizaad",         flag: "🇺🇸", family: "Dené–Yeniseian" },
  { code: "chr", label: "Cherokee",         nativeLabel: "ᏣᎳᎩ ᎦᏬᏂᎯᏍᏗ",         flag: "🇺🇸", family: "Iroquoian" },
  { code: "lkt", label: "Lakota",           nativeLabel: "Lakȟótiyapi",         flag: "🇺🇸", family: "Siouan" },
  { code: "dak", label: "Dakota",           nativeLabel: "Dakhótiyapi",         flag: "🇺🇸", family: "Siouan" },
  { code: "chy", label: "Cheyenne",         nativeLabel: "Tsêhésenêstsestôtse", flag: "🇺🇸", family: "Algonquian" },
  { code: "haw", label: "Hawaiian",         nativeLabel: "ʻŌlelo Hawaiʻi",       flag: "🇺🇸", family: "Austronesian" },
  { code: "ypk", label: "Central Yupʼik",    nativeLabel: "Yugtun",              flag: "🇺🇸", family: "Eskimo–Aleut" },

  // Amérique latine — peuples précolombiens
  { code: "nah", label: "Nahuatl",          nativeLabel: "Nāhuatl",              flag: "🇲🇽", family: "Uto-Aztecan" },
  { code: "yua", label: "Yucatec Maya",     nativeLabel: "Maayaʼ tʼaan",          flag: "🇲🇽", family: "Mayan" },
  { code: "quc", label: "Kʼicheʼ",            nativeLabel: "Kʼicheʼ",              flag: "🇬🇹", family: "Mayan" },
  { code: "mam", label: "Mam",              nativeLabel: "Qyoolʼ Mam",           flag: "🇬🇹", family: "Mayan" },
  { code: "qu",  label: "Quechua",          nativeLabel: "Runa Simi",            flag: "🇵🇪", family: "Quechuan" },
  { code: "ay",  label: "Aymara",           nativeLabel: "Aymar aru",            flag: "🇧🇴", family: "Aymaran" },
  { code: "gn",  label: "Guaraní",          nativeLabel: "Avañeʼẽ",              flag: "🇵🇾", family: "Tupian" },
  { code: "arn", label: "Mapudungun",       nativeLabel: "Mapudungun",           flag: "🇨🇱", family: "Araucanian" },
  { code: "yrl", label: "Nheengatu",        nativeLabel: "Nheengatu",            flag: "🇧🇷", family: "Tupian" },

  // Océanie
  { code: "mi",  label: "Māori",            nativeLabel: "Te Reo Māori",        flag: "🇳🇿", family: "Austronesian" },
  { code: "sm",  label: "Samoan",           nativeLabel: "Gagana Sāmoa",         flag: "🇼🇸", family: "Austronesian" },
  { code: "to",  label: "Tongan",           nativeLabel: "Lea Faka-Tonga",       flag: "🇹🇴", family: "Austronesian" },
  { code: "fj",  label: "Fijian",           nativeLabel: "Vosa Vakaviti",        flag: "🇫🇯", family: "Austronesian" },
  { code: "ty",  label: "Tahitian",         nativeLabel: "Reo Tahiti",           flag: "🇵🇫", family: "Austronesian" },
  { code: "pau", label: "Palauan",          nativeLabel: "Tekoi ra Belau",        flag: "🇵🇼", family: "Austronesian" },
  { code: "gil", label: "Gilbertese",       nativeLabel: "Taetae ni Kiribati",   flag: "🇰🇮", family: "Austronesian" },
  { code: "mh",  label: "Marshallese",      nativeLabel: "Kajin M̧ajeļ",         flag: "🇲🇭", family: "Austronesian" },

  // Europe — langues indigènes / minoritaires
  { code: "se",  label: "Northern Sámi",    nativeLabel: "Davvisámegiella",     flag: "🇳🇴", family: "Uralic" },
  { code: "smj", label: "Lule Sámi",        nativeLabel: "Julevsámegiella",     flag: "🇸🇪", family: "Uralic" },
  { code: "sma", label: "Southern Sámi",    nativeLabel: "Åarjelsaemien gïele", flag: "🇳🇴", family: "Uralic" },
  { code: "sms", label: "Skolt Sámi",       nativeLabel: "Nuõrttsääʼmǩiõll",     flag: "🇫🇮", family: "Uralic" },
  { code: "smn", label: "Inari Sámi",       nativeLabel: "Anarâškielâ",         flag: "🇫🇮", family: "Uralic" },
  { code: "kw",  label: "Cornish",          nativeLabel: "Kernewek",             flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", family: "Indo-European" },
  { code: "gv",  label: "Manx",             nativeLabel: "Gaelg",                flag: "🇮🇲", family: "Indo-European" },
  { code: "fy",  label: "Frisian",          nativeLabel: "Frysk",                flag: "🇳🇱", family: "Indo-European" },
  { code: "lb",  label: "Luxembourgish",    nativeLabel: "Lëtzebuergesch",       flag: "🇱🇺", family: "Indo-European" },
  { code: "rm",  label: "Romansh",          nativeLabel: "Rumantsch",            flag: "🇨🇭", family: "Indo-European" },
  { code: "fur", label: "Friulian",         nativeLabel: "Furlan",               flag: "🇮🇹", family: "Indo-European" },
  { code: "sc",  label: "Sardinian",        nativeLabel: "Sardu",                flag: "🇮🇹", family: "Indo-European" },
  { code: "scn", label: "Sicilian",         nativeLabel: "Sicilianu",            flag: "🇮🇹", family: "Indo-European" },
  { code: "vec", label: "Venetian",         nativeLabel: "Vèneto",               flag: "🇮🇹", family: "Indo-European" },
  { code: "co",  label: "Corsican",         nativeLabel: "Corsu",                flag: "🇫🇷", family: "Indo-European" },
  { code: "oc",  label: "Occitan",          nativeLabel: "Occitan",              flag: "🇫🇷", family: "Indo-European" },
  { code: "br",  label: "Breton",           nativeLabel: "Brezhoneg",            flag: "🇫🇷", family: "Indo-European" },

  // Asie — langues autochtones / minoritaires
  { code: "bo",  label: "Tibetan",          nativeLabel: "བོད་སྐད་",              flag: "🇨🇳", family: "Sino-Tibetan", direction: "ltr" },
  { code: "ug",  label: "Uyghur",           nativeLabel: "ئۇيغۇرچە",             flag: "🇨🇳", family: "Turkic", direction: "rtl" },
  { code: "mn",  label: "Mongolian",        nativeLabel: "Монгол хэл",           flag: "🇲🇳", family: "Mongolic" },
  { code: "ckb", label: "Central Kurdish",  nativeLabel: "کوردیی ناوەندی",         flag: "🇮🇶", family: "Indo-European", direction: "rtl" },
  { code: "kmr", label: "Northern Kurdish", nativeLabel: "Kurmancî",             flag: "🇹🇷", family: "Indo-European" },
  { code: "sat", label: "Santali",          nativeLabel: "ᱥᱟᱱᱛᱟᱲᱤ",                flag: "🇮🇳", family: "Austroasiatic" },
  { code: "ks",  label: "Kashmiri",         nativeLabel: "کٲشُر",                 flag: "🇮🇳", family: "Indo-European", direction: "rtl" },

  // Afrique
  { code: "am",  label: "Amharic",          nativeLabel: "አማርኛ",                  flag: "🇪🇹", family: "Afro-Asiatic" },
  { code: "om",  label: "Oromo",            nativeLabel: "Afaan Oromoo",         flag: "🇪🇹", family: "Afro-Asiatic" },
  { code: "ti",  label: "Tigrinya",         nativeLabel: "ትግርኛ",                  flag: "🇪🇷", family: "Afro-Asiatic" },
  { code: "so",  label: "Somali",           nativeLabel: "Soomaaliga",           flag: "🇸🇴", family: "Afro-Asiatic" },
  { code: "ha",  label: "Hausa",            nativeLabel: "Harshen Hausa",        flag: "🇳🇬", family: "Afro-Asiatic" },
  { code: "ig",  label: "Igbo",             nativeLabel: "Asụsụ Igbo",           flag: "🇳🇬", family: "Niger–Congo" },
  { code: "yo",  label: "Yoruba",           nativeLabel: "Èdè Yorùbá",           flag: "🇳🇬", family: "Niger–Congo" },
  { code: "zu",  label: "isiZulu",          nativeLabel: "isiZulu",              flag: "🇿🇦", family: "Niger–Congo" },
  { code: "xh",  label: "isiXhosa",         nativeLabel: "isiXhosa",             flag: "🇿🇦", family: "Niger–Congo" },
  { code: "st",  label: "Sesotho",          nativeLabel: "Sesotho",              flag: "🇿🇦", family: "Niger–Congo" },
  { code: "tn",  label: "Setswana",         nativeLabel: "Setswana",             flag: "🇿🇦", family: "Niger–Congo" },
  { code: "ts",  label: "Xitsonga",         nativeLabel: "Xitsonga",             flag: "🇿🇦", family: "Niger–Congo" },
  { code: "ve",  label: "Tshivenḓa",         nativeLabel: "Tshivenḓa",             flag: "🇿🇦", family: "Niger–Congo" },
  { code: "sw",  label: "Swahili",          nativeLabel: "Kiswahili",            flag: "🇰🇪", family: "Niger–Congo" },
  { code: "rw",  label: "Kinyarwanda",      nativeLabel: "Ikinyarwanda",         flag: "🇷🇼", family: "Niger–Congo" },
  { code: "ln",  label: "Lingala",          nativeLabel: "Lingála",              flag: "🇨🇩", family: "Niger–Congo" },
  { code: "wo",  label: "Wolof",            nativeLabel: "Wolof",                flag: "🇸🇳", family: "Niger–Congo" },
  { code: "ber", label: "Tamazight",        nativeLabel: "ⵜⴰⵎⴰⵣⵉⵖⵜ",                flag: "🇲🇦", family: "Afro-Asiatic" },
];

const INDIGENOUS_CODES = new Set(INDIGENOUS_SEEDS.map((s) => s.code));

/**
 * Mapping flag par code de langue pour les langues ISO majeures.
 * (Les langues non-mappées reçoivent 🌐 par défaut.)
 */
const FLAG_BY_CODE: Record<string, string> = {
  en: "🇬🇧", fr: "🇫🇷", es: "🇪🇸", de: "🇩🇪", it: "🇮🇹", pt: "🇵🇹",
  nl: "🇳🇱", ja: "🇯🇵", zh: "🇨🇳", ar: "🇸🇦", ru: "🇷🇺", hi: "🇮🇳",
  ko: "🇰🇷", tr: "🇹🇷", fa: "🇮🇷", he: "🇮🇱", sv: "🇸🇪", no: "🇳🇴",
  da: "🇩🇰", fi: "🇫🇮", pl: "🇵🇱", cs: "🇨🇿", hu: "🇭🇺", ro: "🇷🇴",
  el: "🇬🇷", uk: "🇺🇦", id: "🇮🇩", th: "🇹🇭", vi: "🇻🇳", ms: "🇲🇾",
  bn: "🇧🇩", ur: "🇵🇰", ta: "🇮🇳", te: "🇮🇳", ml: "🇮🇳", kn: "🇮🇳",
  mr: "🇮🇳", gu: "🇮🇳", pa: "🇮🇳", ne: "🇳🇵", si: "🇱🇰", my: "🇲🇲",
  km: "🇰🇭", lo: "🇱🇦", ka: "🇬🇪", hy: "🇦🇲", az: "🇦🇿", kk: "🇰🇿",
  uz: "🇺🇿", ky: "🇰🇬", tg: "🇹🇯", tk: "🇹🇲", mn: "🇲🇳", is: "🇮🇸",
  ga: "🇮🇪", cy: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", gd: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", mt: "🇲🇹", sq: "🇦🇱", mk: "🇲🇰",
  bs: "🇧🇦", sr: "🇷🇸", hr: "🇭🇷", sl: "🇸🇮", sk: "🇸🇰", bg: "🇧🇬",
  lv: "🇱🇻", lt: "🇱🇹", et: "🇪🇪", be: "🇧🇾", af: "🇿🇦", yi: "🇮🇱",
  eu: "🇪🇸", ca: "🇪🇸", gl: "🇪🇸", eo: "🌍",
};

function getTranslationStatus(code: string): TranslationStatus {
  if (FULLY_TRANSLATED_CODES.has(code)) return "complete";
  return "untranslated";
}

function makeLanguageOption(code: string, entry: IsoEntry | undefined): LanguageOption {
  const lower = code.toLowerCase();
  const label = entry?.name || code;
  const nativeLabel = entry?.nativeName || entry?.name || code;
  const flag = FLAG_BY_CODE[lower] || "🌐";
  const direction = RTL_CODES.has(lower) ? "rtl" : "ltr";

  return {
    code: lower,
    label,
    nativeLabel,
    flag,
    family: entry?.family,
    indigenous: false,
    direction,
    translationStatus: getTranslationStatus(lower),
  };
}

/**
 * Construit le catalogue complet des langues disponibles.
 * Appelée une seule fois au chargement du module.
 */
function buildLanguageCatalog(): LanguageOption[] {
  const out: LanguageOption[] = [];
  const seen = new Set<string>();

  // 1) Toutes les langues ISO 639-1
  for (const [code, entry] of Object.entries(ISO639)) {
    const lower = code.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);
    out.push(makeLanguageOption(lower, entry));
  }

  // 2) Langues autochtones / étendues
  for (const seed of INDIGENOUS_SEEDS) {
    const lower = seed.code.toLowerCase();
    if (seen.has(lower)) {
      // Déjà dans ISO 639-1 (ex: iu, nv, mi, qu, gn, se, br, co, oc, fy, lb, rm, bo, ug, mn, ha, ig, yo, zu, xh, st, tn, ts, ve, sw, rw, ln, wo, am, om, ti, so, ay, haw, sm, to, fj, ty, mh, gv, kw)
      // → on override le flag et on marque indigenous
      const idx = out.findIndex((x) => x.code === lower);
      if (idx >= 0) {
        out[idx] = {
          ...out[idx],
          flag: seed.flag || out[idx].flag,
          indigenous: true,
          family: seed.family || out[idx].family,
          nativeLabel: seed.nativeLabel || out[idx].nativeLabel,
          direction: seed.direction || out[idx].direction,
        };
      }
      continue;
    }
    seen.add(lower);
    out.push({
      code: lower,
      label: seed.label,
      nativeLabel: seed.nativeLabel,
      flag: seed.flag || "🌐",
      family: seed.family,
      indigenous: true,
      direction: seed.direction || "ltr",
      translationStatus: getTranslationStatus(lower),
    });
  }

  return out.sort((a, b) => a.label.localeCompare(b.label));
}

export const LANGUAGE_CATALOG: LanguageOption[] = buildLanguageCatalog();

/** Map O(1) pour la recherche par code */
export const LANGUAGE_BY_CODE: Map<string, LanguageOption> = new Map(
  LANGUAGE_CATALOG.map((lang) => [lang.code, lang])
);

/** Vrai si un code est connu du registre. */
export function isSupportedLanguage(code: string | undefined | null): boolean {
  if (!code) return false;
  return LANGUAGE_BY_CODE.has(code.toLowerCase());
}

/** Retourne l'option complète pour un code (ou null). */
export function getLanguageOption(code: string | undefined | null): LanguageOption | null {
  if (!code) return null;
  return LANGUAGE_BY_CODE.get(code.toLowerCase()) || null;
}

/** Langues avec traduction UI complète (actuellement en, fr, es, de, it, pt). */
export function getFullyTranslatedLanguages(): LanguageOption[] {
  return LANGUAGE_CATALOG.filter((x) => x.translationStatus === "complete");
}

/** Langues indigènes / autochtones. */
export function getIndigenousLanguages(): LanguageOption[] {
  return LANGUAGE_CATALOG.filter((x) => x.indigenous);
}

/** Vrai si la langue a une traduction UI dédiée. */
export function hasFullTranslation(code: string): boolean {
  return FULLY_TRANSLATED_CODES.has(code.toLowerCase());
}


