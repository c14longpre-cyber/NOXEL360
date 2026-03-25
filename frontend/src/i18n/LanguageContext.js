import { jsx as _jsx } from "react/jsx-runtime";
// src/i18n/LanguageContext.tsx
import { createContext, useContext, useState, } from "react";
const LanguageContext = createContext(undefined);
export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState("fr");
    const value = {
        language,
        setLanguage,
    };
    return (_jsx(LanguageContext.Provider, { value: value, children: children }));
}
export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) {
        throw new Error("useLanguage must be used inside a <LanguageProvider>");
    }
    return ctx;
}
