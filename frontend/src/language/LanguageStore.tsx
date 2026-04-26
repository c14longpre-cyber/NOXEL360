import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { LanguageOption } from "../i18n/types";
import {
  LANGUAGE_CATALOG,
  getLanguageOption,
  isSupportedLanguage,
} from "../i18n/languageCatalog";
import { loadDictionary, DEFAULT_LANGUAGE } from "../i18n/translate";

/**
 * AppLanguage est maintenant un type ouvert : n'importe quel code ISO 639-1
 * + codes autochtones étendus (iu, ike, nv, chr, mi, qu, gn, nah, yua…).
 * Voir `languageCatalog.ts` pour la liste complète.
 */
export type AppLanguage = string;

export type { LanguageOption };

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (value: AppLanguage) => void;
  languages: LanguageOption[];
  currentLanguage: LanguageOption;
  /** Incrémenté à chaque fois que le dictionnaire actif change, pour déclencher un re-render */
  version: number;
};

const STORAGE_KEY = "noxel.language";

const LanguageContext = createContext<LanguageContextValue | null>(null);

const FALLBACK_OPTION: LanguageOption = {
  code: DEFAULT_LANGUAGE,
  label: "English",
  nativeLabel: "English",
  flag: "🇬🇧",
  direction: "ltr",
  translationStatus: "complete",
};

function normalizeBrowserLanguage(browserLanguage: string): string {
  const value = browserLanguage.toLowerCase();
  const base = value.split("-")[0];
  if (isSupportedLanguage(base)) return base;
  return DEFAULT_LANGUAGE;
}

function getInitialLanguage(): AppLanguage {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved && isSupportedLanguage(saved)) {
    return saved.toLowerCase();
  }

  const browserLanguages =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : navigator.language
        ? [navigator.language]
        : [];

  for (const lang of browserLanguages) {
    const normalized = normalizeBrowserLanguage(lang);
    if (isSupportedLanguage(normalized)) return normalized;
  }

  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(getInitialLanguage);
  const [version, setVersion] = useState(0);

  // Chargement dynamique du dictionnaire à chaque changement
  useEffect(() => {
    let cancelled = false;
    loadDictionary(language).then(() => {
      if (!cancelled) setVersion((v) => v + 1);
    });
    return () => {
      cancelled = true;
    };
  }, [language]);

  // Persistance + direction de lecture
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, language);
    }

    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      const opt = getLanguageOption(language);
      document.documentElement.dir = opt?.direction || "ltr";
    }
  }, [language]);

  const setLanguage = useCallback((value: AppLanguage) => {
    const lower = value.toLowerCase();
    if (!isSupportedLanguage(lower)) return;
    setLanguageState(lower);
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    const currentLanguage = getLanguageOption(language) || FALLBACK_OPTION;
    return {
      language,
      setLanguage,
      languages: LANGUAGE_CATALOG,
      currentLanguage,
      version,
    };
    // version volontairement inclus pour que les consommateurs qui
    // lisent `currentLanguage` via useI18n() re-rendent au chargement
    // asynchrone du dictionnaire
  }, [language, setLanguage, version]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return ctx;
}
