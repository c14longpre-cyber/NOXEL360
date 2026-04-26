import { create } from "zustand";
import { detectBrowserCountry, detectBrowserLanguage } from "../core/detect";
import { resolveLanguage } from "../core/resolve";

type NexusStore = {
  language: string;
  country: string | null;
  hydrated: boolean;
  setLanguage: (language: string) => void;
  setCountry: (country: string | null) => void;
  hydrate: () => void;
};

const STORAGE_KEY = "nexus.preferences";

function readStoredPrefs(): { language?: string; country?: string | null } {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as { language?: string; country?: string | null };
  } catch {
    return {};
  }
}

function writeStoredPrefs(data: { language: string; country: string | null }) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
  }
}

export const useNexusStore = create<NexusStore>((set, get) => ({
  language: "en",
  country: null,
  hydrated: false,

  setLanguage: (language) => {
    const country = get().country;
    writeStoredPrefs({ language, country });
    set({ language });
  },

  setCountry: (country) => {
    const language = get().language;
    writeStoredPrefs({ language, country });
    set({ country });
  },

  hydrate: () => {
    const stored = readStoredPrefs();
    const detectedLanguage = detectBrowserLanguage();
    const detectedCountry = detectBrowserCountry();

    const language = resolveLanguage({
      userLanguage: stored.language ?? null,
      detectedLanguage,
      detectedCountry: stored.country ?? detectedCountry ?? null,
    });

    const country = stored.country ?? detectedCountry ?? null;

    writeStoredPrefs({ language, country });
    set({
      language,
      country,
      hydrated: true,
    });
  },
}));
