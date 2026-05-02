/**
 * validateTranslations.ts
 * Utilitaire de validation des dictionnaires i18n NOXEL.
 *
 * Usage : `npx ts-node validateTranslations.ts`
 * Lance une comparaison de toutes les langues par rapport à EN
 * et affiche les clés manquantes ou en surplus.
 */
import { TRANSLATIONS, DEFAULT_LANGUAGE } from "./locales";
export function validateTranslations() {
    const reference = TRANSLATIONS[DEFAULT_LANGUAGE];
    const refKeys = new Set(Object.keys(reference));
    const results = [];
    for (const [lang, dict] of Object.entries(TRANSLATIONS)) {
        if (lang === DEFAULT_LANGUAGE)
            continue;
        const isFallback = dict === reference;
        if (isFallback) {
            results.push({ lang, missing: [], extra: [], status: "fallback" });
            continue;
        }
        const dictKeys = new Set(Object.keys(dict));
        const missing = [...refKeys].filter((k) => !dictKeys.has(k));
        const extra = [...dictKeys].filter((k) => !refKeys.has(k));
        const status = missing.length === 0 && extra.length === 0 ? "ok" : "incomplete";
        results.push({ lang, missing, extra, status });
    }
    return results;
}
// --- CLI runner ---
if (require.main === module) {
    const results = validateTranslations();
    let hasErrors = false;
    for (const r of results) {
        if (r.status === "fallback") {
            console.log(`⬜ ${r.lang.padEnd(4)} — fallback EN (not yet translated)`);
            continue;
        }
        if (r.status === "ok") {
            console.log(`✅ ${r.lang.padEnd(4)} — all ${Object.keys(TRANSLATIONS[r.lang]).length} keys present`);
            continue;
        }
        hasErrors = true;
        console.error(`❌ ${r.lang.padEnd(4)} — ${r.missing.length} missing, ${r.extra.length} extra`);
        if (r.missing.length) {
            console.error(`   Missing:`);
            r.missing.forEach((k) => console.error(`     - "${k}"`));
        }
        if (r.extra.length) {
            console.error(`   Extra (not in EN):`);
            r.extra.forEach((k) => console.error(`     + "${k}"`));
        }
    }
    process.exit(hasErrors ? 1 : 0);
}
