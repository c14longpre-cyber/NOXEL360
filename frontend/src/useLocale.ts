import { useMemo } from "react";
import { useLanguage } from "./language/LanguageStore";
import { useRegion } from "./region/RegionStore";
import { useI18n } from "./useI18n";
import {
  buildLocaleTag,
  formatDate,
  formatTime,
  formatDateTime,
  formatDateCustom,
  formatRelativeTime,
  formatTimeAgo,
  formatNumber,
  formatPercent,
  formatCompact,
  formatCurrency,
  formatDistance,
  formatTemperature,
  formatMass,
  formatVolume,
  formatList,
  plural,
  pluralRule,
  effectiveMeasurementSystem,
  type FormatContext,
} from "./region/format";

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
  const {
    region,
    regionInfo,
    preferences,
    detection,
    setRegion,
    setPreferences,
    resetToAuto,
  } = useRegion();
  const { t, has, isFullyTranslated } = useI18n();

  return useMemo(() => {
    const ctx: FormatContext = {
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
      formatDate: (date: Date | number | string, style?: "short" | "medium" | "long" | "full") =>
        formatDate(date, ctx, style),
      formatTime: (date: Date | number | string, style?: "short" | "medium" | "long") =>
        formatTime(date, ctx, style),
      formatDateTime: (
        date: Date | number | string,
        dateStyle?: "short" | "medium" | "long" | "full",
        timeStyle?: "short" | "medium" | "long"
      ) => formatDateTime(date, ctx, dateStyle, timeStyle),
      formatDateCustom: (
        date: Date | number | string,
        options: Intl.DateTimeFormatOptions
      ) => formatDateCustom(date, ctx, options),

      formatRelativeTime: (
        value: number,
        unit: Intl.RelativeTimeFormatUnit,
        numeric?: "always" | "auto"
      ) => formatRelativeTime(value, unit, ctx, numeric),
      formatTimeAgo: (date: Date | number | string) => formatTimeAgo(date, ctx),

      formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
        formatNumber(value, ctx, options),
      formatPercent: (value: number, fractionDigits?: number) =>
        formatPercent(value, ctx, fractionDigits),
      formatCompact: (value: number) => formatCompact(value, ctx),
      formatCurrency: (value: number, currency?: string) =>
        formatCurrency(value, ctx, currency),

      formatDistance: (
        input: { meters: number } | { km: number } | { miles: number },
        opts?: { unit?: "auto" | "meters" | "kilometers" | "miles" | "feet" }
      ) => formatDistance(input, ctx, opts),
      formatTemperature: (
        input: { celsius: number } | { fahrenheit: number }
      ) => formatTemperature(input, ctx),
      formatMass: (
        input: { kg: number } | { g: number } | { pounds: number }
      ) => formatMass(input, ctx),
      formatVolume: (
        input: { liters: number } | { ml: number } | { gallons: number }
      ) => formatVolume(input, ctx),

      formatList: (
        items: string[],
        style?: "long" | "short" | "narrow",
        type?: "conjunction" | "disjunction" | "unit"
      ) => formatList(items, ctx, style, type),

      plural: (
        count: number,
        forms: Partial<Record<Intl.LDMLPluralRule | "zero", string>>,
        replace?: string
      ) => plural(count, ctx, forms, replace),
      pluralRule: (count: number, type?: "cardinal" | "ordinal") =>
        pluralRule(count, ctx, type),
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


