import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from "react";
import { LANGUAGE_CATALOG, getLanguageOption, isSupportedLanguage, } from "../i18n/languageCatalog";
import { loadDictionary, DEFAULT_LANGUAGE } from "../i18n/translate";
const STORAGE_KEY = "noxel.language";
const LanguageContext = createContext(null);
const FALLBACK_OPTION = {
    code: DEFAULT_LANGUAGE,
    label: "English",
    nativeLabel: "English",
    flag: "🇬🇧",
    direction: "ltr",
    translationStatus: "complete",
};
function normalizeBrowserLanguage(browserLanguage) {
    const value = browserLanguage.toLowerCase();
    const base = value.split("-")[0];
    if (isSupportedLanguage(base))
        return base;
    return DEFAULT_LANGUAGE;
}
function getInitialLanguage() {
    if (typeof window === "undefined")
        return DEFAULT_LANGUAGE;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && isSupportedLanguage(saved)) {
        return saved.toLowerCase();
    }
    const browserLanguages = navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : navigator.language
            ? [navigator.language]
            : [];
    for (const lang of browserLanguages) {
        const normalized = normalizeBrowserLanguage(lang);
        if (isSupportedLanguage(normalized))
            return normalized;
    }
    return DEFAULT_LANGUAGE;
}
export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState(getInitialLanguage);
    const [version, setVersion] = useState(0);
    // Chargement dynamique du dictionnaire à chaque changement
    useEffect(() => {
        let cancelled = false;
        loadDictionary(language).then(() => {
            if (!cancelled)
                setVersion((v) => v + 1);
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
    const setLanguage = useCallback((value) => {
        const lower = value.toLowerCase();
        if (!isSupportedLanguage(lower))
            return;
        setLanguageState(lower);
    }, []);
    const value = useMemo(() => {
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
    return (_jsx(LanguageContext.Provider, { value: value, children: children }));
}
export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) {
        throw new Error("useLanguage must be used inside LanguageProvider");
    }
    return ctx;
}
