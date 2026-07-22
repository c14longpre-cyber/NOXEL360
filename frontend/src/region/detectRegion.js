/**
 * Détection automatique de région, en cascade :
 *
 *   1. Préférence stockée dans localStorage (si valide)
 *   2. Timezone du navigateur → région mappée (99 % fiable)
 *   3. `navigator.language` type "fr-CA" → extrait "CA"
 *   4. Langue du navigateur mappée vers région typique (fallback)
 *   5. Région par défaut (US)
 *
 * On ne fait JAMAIS d'appel réseau. Tout est local.
 */
import { isSupportedRegion, DEFAULT_REGION, REGION_CATALOG, } from "./regionCatalog";
import { regionFromTimezone } from "./timezoneMap";
const STORAGE_KEY = "noxel.region";
/**
 * Mapping de repli : si le navigateur envoie juste "fr" sans région
 * explicite, on devine une région plausible.
 */
const LANGUAGE_TO_DEFAULT_REGION = {
    en: "US",
    fr: "FR",
    es: "ES",
    de: "DE",
    it: "IT",
    pt: "PT",
    nl: "NL",
    ja: "JP",
    zh: "CN",
    ko: "KR",
    ar: "SA",
    ru: "RU",
    hi: "IN",
    tr: "TR",
    pl: "PL",
    uk: "UA",
    el: "GR",
    sv: "SE",
    no: "NO",
    da: "DK",
    fi: "FI",
    cs: "CZ",
    hu: "HU",
    ro: "RO",
    he: "IL",
    fa: "IR",
    th: "TH",
    vi: "VN",
    id: "ID",
    ms: "MY",
    bn: "BD",
};
function getStoredRegion() {
    if (typeof window === "undefined")
        return null;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw && isSupportedRegion(raw))
            return raw.toUpperCase();
    }
    catch {
        /* localStorage indisponible */
    }
    return null;
}
function getBrowserTimezone() {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
    }
    catch {
        return null;
    }
}
function extractRegionFromNavigatorLanguage(lang) {
    if (!lang)
        return null;
    // "fr-CA" → "CA"
    const parts = lang.split("-");
    if (parts.length >= 2) {
        const maybeRegion = parts[parts.length - 1].toUpperCase();
        if (maybeRegion.length === 2 && isSupportedRegion(maybeRegion)) {
            return maybeRegion;
        }
    }
    // "fr" seul → via mapping
    const short = parts[0].toLowerCase();
    const mapped = LANGUAGE_TO_DEFAULT_REGION[short];
    if (mapped && isSupportedRegion(mapped))
        return mapped;
    return null;
}
export function detectRegion() {
    // 1. Stocké
    const stored = getStoredRegion();
    if (stored) {
        return {
            code: stored,
            source: "stored",
            timezone: REGION_CATALOG[stored]?.timezone,
        };
    }
    // 2. Timezone (la plus fiable)
    const tz = getBrowserTimezone();
    if (tz) {
        const fromTz = regionFromTimezone(tz);
        if (fromTz && isSupportedRegion(fromTz)) {
            return {
                code: fromTz,
                source: "timezone",
                timezone: tz,
            };
        }
    }
    // 3. navigator.language avec région explicite
    if (typeof navigator !== "undefined") {
        const langs = navigator.languages?.length
            ? navigator.languages
            : navigator.language
                ? [navigator.language]
                : [];
        for (const lang of langs) {
            const region = extractRegionFromNavigatorLanguage(lang);
            if (region) {
                return {
                    code: region,
                    source: lang.includes("-") ? "navigator" : "language",
                    timezone: tz || undefined,
                };
            }
        }
    }
    // 4. Fallback
    return {
        code: DEFAULT_REGION,
        source: "fallback",
        timezone: tz || undefined,
    };
}
export function persistRegion(code) {
    if (typeof window === "undefined")
        return;
    try {
        window.localStorage.setItem(STORAGE_KEY, code.toUpperCase());
    }
    catch {
        /* silent */
    }
}
export { STORAGE_KEY as REGION_STORAGE_KEY };
