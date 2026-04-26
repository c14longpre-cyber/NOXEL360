import { useMemo } from "react";
import { useLanguage } from "./language/LanguageStore";
import { translateSync, hasTranslation } from "./i18n/translate";
import { hasFullTranslation } from "./i18n/languageCatalog";
/**
 * Hook principal d'internationalisation.
 *
 * Retourne :
 *   - `language` : code actif (ex: "fr", "iu", "nv")
 *   - `t(key, params?, fallback?)` : traduction d'une clé
 *   - `has(key)` : vrai si la clé existe dans le dictionnaire actif
 *   - `isFullyTranslated` : vrai si la langue active a un dictionnaire dédié
 *   - `version` : nombre incrémenté à chaque chargement dynamique (pour dep arrays)
 */
export function useI18n() {
    const { language, version } = useLanguage();
    return useMemo(() => {
        const isFullyTranslated = hasFullTranslation(language);
        return {
            language,
            version,
            isFullyTranslated,
            t: (key, params, fallback) => translateSync(language, key, params, fallback),
            has: (key) => hasTranslation(language, key),
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language, version]);
}
