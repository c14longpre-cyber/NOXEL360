import type { AppLanguage } from "../language/LanguageStore";

export type TranslationValue = string;

export type TranslationDictionary = Record<string, TranslationValue>;

export type TranslationParams = Record<string, string | number>;

export type SupportedLanguage = AppLanguage;