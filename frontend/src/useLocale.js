import { useMemo } from "react";
import { useLanguage } from "./language/LanguageStore";
import { useRegion } from "./region/RegionStore";
import { useI18n } from "./useI18n";
import { buildLocaleTag, formatDate, formatTime, formatDateTime, formatDateCustom, formatRelativeTime, formatTimeAgo, formatNumber, formatPercent, formatCompact, formatCurrency, formatDistance, formatTemperature, formatMass, formatVolume, formatList, plural, pluralRule, effectiveMeasurementSystem, } from "./region/format";
/**
 * useLocale — hook combiné langue + région.
 *
 * Expose :
 *   - `language`, `region` : codes actifs
 *   - `locale` : code BCP 47 combiné (ex: "fr-CA")
 *   - `t()` : fonction de traduction (de useI18n)
 *   - Toutes les fonctions de formatage pré-remplies avec le contexte
 *   - `setLanguage`, `setRegion`, `setPreferences` : actions
 *   - `preferences` : overrides utilisateur
 *   - `measurementSystem` : système effectif (metric / imperial)
 *
 * C'est le hook à privilégier dans les composants qui affichent du
 * contenu localisé (dashboard, listes de transactions, cartes, etc.).
 * Si un composant ne fait QUE des traductions de texte statique,
 * `useI18n()` suffit.
 */
export function useLocale() {
    const { language, setLanguage, currentLanguage } = useLanguage();
    const { region, regionInfo, preferences, detection, setRegion, setPreferences, resetToAuto, } = useRegion();
    const { t, has, isFullyTranslated } = useI18n();
    return useMemo(() => {
        const ctx = {
            language,
            region: regionInfo,
            preferences,
        };
        const locale = buildLocaleTag(ctx);
        return {
            // Identifiants
            language,
            region,
            locale,
            regionInfo,
            currentLanguage,
            preferences,
            detection,
            // Actions
            setLanguage,
            setRegion,
            setPreferences,
            resetToAuto,
            // Traduction (de useI18n)
            t,
            has,
            isFullyTranslated,
            // Système de mesure effectif
            measurementSystem: effectiveMeasurementSystem(ctx),
            // Formatters (curried avec ctx)
            formatDate: (date, style) => formatDate(date, ctx, style),
            formatTime: (date, style) => formatTime(date, ctx, style),
            formatDateTime: (date, dateStyle, timeStyle) => formatDateTime(date, ctx, dateStyle, timeStyle),
            formatDateCustom: (date, options) => formatDateCustom(date, ctx, options),
            formatRelativeTime: (value, unit, numeric) => formatRelativeTime(value, unit, ctx, numeric),
            formatTimeAgo: (date) => formatTimeAgo(date, ctx),
            formatNumber: (value, options) => formatNumber(value, ctx, options),
            formatPercent: (value, fractionDigits) => formatPercent(value, ctx, fractionDigits),
            formatCompact: (value) => formatCompact(value, ctx),
            formatCurrency: (value, currency) => formatCurrency(value, ctx, currency),
            formatDistance: (input, opts) => formatDistance(input, ctx, opts),
            formatTemperature: (input) => formatTemperature(input, ctx),
            formatMass: (input) => formatMass(input, ctx),
            formatVolume: (input) => formatVolume(input, ctx),
            formatList: (items, style, type) => formatList(items, ctx, style, type),
            plural: (count, forms, replace) => plural(count, ctx, forms, replace),
            pluralRule: (count, type) => pluralRule(count, ctx, type),
        };
    }, [
        language,
        region,
        regionInfo,
        preferences,
        detection,
        currentLanguage,
        setLanguage,
        setRegion,
        setPreferences,
        resetToAuto,
        t,
        has,
        isFullyTranslated,
    ]);
}
