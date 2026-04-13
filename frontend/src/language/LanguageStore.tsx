import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AppLanguage =
  | "en"
  | "fr"
  | "es"
  | "de"
  | "it"
  | "pt"
  | "nl"
  | "ja"
  | "zh"
  | "ar"
  | "ru"
  | "hi"
  | "ko"
  | "tr"
  | "fa"
  | "he"
  | "sv"
  | "no"
  | "da"
  | "fi"
  | "pl"
  | "cs"
  | "hu"
  | "ro"
  | "el"
  | "uk"
  | "id"
  | "th"
  | "vi"
  | "ms"
  | "bn";

export type LanguageOption = {
  code: AppLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
};

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇨🇦" },
  { code: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷" },
  { code: "es", label: "Spanish", nativeLabel: "Español", flag: "🇪🇸" },
  { code: "de", label: "German", nativeLabel: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italian", nativeLabel: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português", flag: "🇵🇹" },
  { code: "nl", label: "Dutch", nativeLabel: "Nederlands", flag: "🇳🇱" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", flag: "🇯🇵" },
  { code: "zh", label: "Chinese", nativeLabel: "中文", flag: "🇨🇳" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", flag: "🇸🇦" },
  { code: "ru", label: "Russian", nativeLabel: "Русский", flag: "🇷🇺" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", flag: "🇮🇳" },
  { code: "ko", label: "Korean", nativeLabel: "한국어", flag: "🇰🇷" },
  { code: "tr", label: "Turkish", nativeLabel: "Türkçe", flag: "🇹🇷" },
  { code: "fa", label: "Persian", nativeLabel: "فارسی", flag: "🇮🇷" },
  { code: "he", label: "Hebrew", nativeLabel: "עברית", flag: "🇮🇱" },
  { code: "sv", label: "Swedish", nativeLabel: "Svenska", flag: "🇸🇪" },
  { code: "no", label: "Norwegian", nativeLabel: "Norsk", flag: "🇳🇴" },
  { code: "da", label: "Danish", nativeLabel: "Dansk", flag: "🇩🇰" },
  { code: "fi", label: "Finnish", nativeLabel: "Suomi", flag: "🇫🇮" },
  { code: "pl", label: "Polish", nativeLabel: "Polski", flag: "🇵🇱" },
  { code: "cs", label: "Czech", nativeLabel: "Čeština", flag: "🇨🇿" },
  { code: "hu", label: "Hungarian", nativeLabel: "Magyar", flag: "🇭🇺" },
  { code: "ro", label: "Romanian", nativeLabel: "Română", flag: "🇷🇴" },
  { code: "el", label: "Greek", nativeLabel: "Ελληνικά", flag: "🇬🇷" },
  { code: "uk", label: "Ukrainian", nativeLabel: "Українська", flag: "🇺🇦" },
  { code: "id", label: "Indonesian", nativeLabel: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "th", label: "Thai", nativeLabel: "ไทย", flag: "🇹🇭" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ms", label: "Malay", nativeLabel: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা", flag: "🇧🇩" },
];

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (value: AppLanguage) => void;
  languages: LanguageOption[];
  currentLanguage: LanguageOption;
};

const STORAGE_KEY = "noxel.language";

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isSupportedLanguage(value: string): value is AppLanguage {
  return LANGUAGE_OPTIONS.some((x) => x.code === value);
}

function normalizeBrowserLanguage(browserLanguage: string): AppLanguage {
  const value = browserLanguage.toLowerCase();

  if (value.startsWith("fr")) return "fr";
  if (value.startsWith("es")) return "es";
  if (value.startsWith("de")) return "de";
  if (value.startsWith("it")) return "it";
  if (value.startsWith("pt")) return "pt";
  if (value.startsWith("nl")) return "nl";
  if (value.startsWith("ja")) return "ja";
  if (value.startsWith("zh")) return "zh";
  if (value.startsWith("ar")) return "ar";
  if (value.startsWith("ru")) return "ru";
  if (value.startsWith("hi")) return "hi";
  if (value.startsWith("ko")) return "ko";
  if (value.startsWith("tr")) return "tr";
  if (value.startsWith("fa")) return "fa";
  if (value.startsWith("he")) return "he";
  if (value.startsWith("sv")) return "sv";
  if (value.startsWith("no")) return "no";
  if (value.startsWith("da")) return "da";
  if (value.startsWith("fi")) return "fi";
  if (value.startsWith("pl")) return "pl";
  if (value.startsWith("cs")) return "cs";
  if (value.startsWith("hu")) return "hu";
  if (value.startsWith("ro")) return "ro";
  if (value.startsWith("el")) return "el";
  if (value.startsWith("uk")) return "uk";
  if (value.startsWith("id")) return "id";
  if (value.startsWith("th")) return "th";
  if (value.startsWith("vi")) return "vi";
  if (value.startsWith("ms")) return "ms";
  if (value.startsWith("bn")) return "bn";

  return "en";
}

function getInitialLanguage(): AppLanguage {
  if (typeof window === "undefined") return "en";

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved && isSupportedLanguage(saved)) {
    return saved;
  }

  const browserLanguages =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : navigator.language
        ? [navigator.language]
        : [];

  for (const lang of browserLanguages) {
    const normalized = normalizeBrowserLanguage(lang);
    if (isSupportedLanguage(normalized)) {
      return normalized;
    }
  }

  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(getInitialLanguage);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, language);
    }

    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (value: AppLanguage) => {
    if (!isSupportedLanguage(value)) return;
    setLanguageState(value);
  };

  const value = useMemo<LanguageContextValue>(() => {
    const currentLanguage =
      LANGUAGE_OPTIONS.find((x) => x.code === language) ?? LANGUAGE_OPTIONS[0];

    return {
      language,
      setLanguage,
      languages: LANGUAGE_OPTIONS,
      currentLanguage,
    };
  }, [language]);

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