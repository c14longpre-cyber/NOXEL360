// src/i18n/LanguageContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export type LanguageCode = "fr" | "en" | "es" | "pt" | "auto";

export type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

type ProviderProps = {
  children: ReactNode;
};

export function LanguageProvider({ children }: ProviderProps) {
  const [language, setLanguage] = useState<LanguageCode>("fr");

  const value: LanguageContextType = {
    language,
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error(
      "useLanguage must be used inside a <LanguageProvider>"
    );
  }
  return ctx;
}
