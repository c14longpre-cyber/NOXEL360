import { resolveBestLanguage } from "./resolveLanguage";
/**
 * Détermine la meilleure langue à appliquer pour un pays donné,
 * en tenant compte des langues du navigateur de l'utilisateur.
 *
 * Accepte désormais n'importe quel code ISO 639-1 ou autochtone
 * supporté par le registre (voir `i18n/languageCatalog.ts`).
 */
export function detectBestLanguageForCountry(countryIso2, subdivisionIso, fallback = "en") {
    if (typeof navigator === "undefined") {
        return fallback;
    }
    const langs = navigator.languages?.length
        ? navigator.languages
        : navigator.language
            ? [navigator.language]
            : [fallback];
    const resolved = resolveBestLanguage(countryIso2, subdivisionIso, langs, fallback);
    return resolved || fallback;
}
