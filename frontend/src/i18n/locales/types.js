/**
 * Types pour le système i18n NOXEL.
 */
//
// 🔥 NOXEL TRANSLATION TIERS
//
/** Langues 100% validées (UX + contenu complet) */
export const CORE_FULLY_TRANSLATED_LANGUAGES = [
    "en",
    "fr",
    "es",
    "de",
    "it",
    "pt",
];
/** Langues avec fichiers présents (ex: zip 115 langues) */
export const EXTENDED_TRANSLATED_LANGUAGES = [
    "en", "fr", "es", "de", "it", "pt",
    "nl", "ja", "zh", "ar", "ru", "hi",
    "ko", "tr", "fa", "he", "sv", "no",
    "da", "fi", "pl", "cs", "hu", "ro",
    "el", "uk", "id", "th", "vi", "ms", "bn",
];
/** Langues officiellement considérées "fully translated" */
export const FULLY_TRANSLATED_LANGUAGES = [
    ...CORE_FULLY_TRANSLATED_LANGUAGES,
    // 👉 tu peux ajouter ici dynamiquement plus tard
];
