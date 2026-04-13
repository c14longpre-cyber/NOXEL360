import { useMemo } from "react";
import { useLanguage } from "./language/LanguageStore";
import { translate, hasTranslation } from "./i18n/translate";
import type { TranslationParams } from "./i18n/types";

export function useI18n() {
  const { language } = useLanguage();

  return useMemo(() => {
    return {
      language,
      t: (key: string, params?: TranslationParams, fallback?: string) =>
        translate(language, key, params, fallback),
      has: (key: string) => hasTranslation(language, key),
    };
  }, [language]);
}