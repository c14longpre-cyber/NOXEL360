import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  RegionCode,
  RegionInfo,
  RegionPreferences,
  RegionDetectionResult,
  MeasurementSystem,
  FirstDayOfWeek,
  TimeFormat,
} from "./types";
import {
  getRegionInfo,
  isSupportedRegion,
  ALL_REGIONS,
  DEFAULT_REGION,
  REGION_CATALOG,
} from "./regionCatalog";
import {
  detectRegion,
  persistRegion,
  REGION_STORAGE_KEY,
} from "./detectRegion";

const PREFERENCES_STORAGE_KEY = "noxel.region.preferences";

type RegionContextValue = {
  /** Code région actuel (ISO 3166-1 alpha-2) */
  region: RegionCode;
  /** Métadonnées complètes de la région actuelle */
  regionInfo: RegionInfo;
  /** Liste des 250 régions disponibles */
  regions: RegionInfo[];
  /** Préférences utilisateur (overrides) */
  preferences: RegionPreferences;
  /** Résultat de la dernière détection */
  detection: RegionDetectionResult | null;
  /** Change la région active */
  setRegion: (code: RegionCode) => void;
  /** Met à jour une ou plusieurs préférences */
  setPreferences: (update: Partial<RegionPreferences>) => void;
  /** Remet la détection automatique (efface la préférence stockée) */
  resetToAuto: () => void;
};

const RegionContext = createContext<RegionContextValue | null>(null);

function loadPreferences(): RegionPreferences {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as RegionPreferences) : {};
  } catch {
    return {};
  }
}

function savePreferences(prefs: RegionPreferences): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* silent */
  }
}

const FALLBACK_REGION_INFO: RegionInfo = {
  code: DEFAULT_REGION,
  name: "United States",
  flag: "🇺🇸",
  timezone: "America/New_York",
  measurementSystem: "imperial",
  firstDayOfWeek: 0,
  timeFormat: "12h",
};

export function RegionProvider({ children }: { children: ReactNode }) {
  const [detection, setDetection] = useState<RegionDetectionResult | null>(null);
  const [region, setRegionState] = useState<RegionCode>(() => {
    const result = detectRegion();
    return result.code;
  });
  const [preferences, setPreferencesState] = useState<RegionPreferences>(() =>
    loadPreferences()
  );

  // Publie le résultat de détection initial
  useEffect(() => {
    setDetection(detectRegion());
  }, []);

  const setRegion = useCallback((code: RegionCode) => {
    const upper = code.toUpperCase();
    if (!isSupportedRegion(upper)) return;
    setRegionState(upper);
    persistRegion(upper);
  }, []);

  const setPreferences = useCallback(
    (update: Partial<RegionPreferences>) => {
      setPreferencesState((prev) => {
        const next = { ...prev, ...update };
        savePreferences(next);
        return next;
      });
    },
    []
  );

  const resetToAuto = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(REGION_STORAGE_KEY);
      } catch {
        /* silent */
      }
    }
    const result = detectRegion();
    setDetection(result);
    setRegionState(result.code);
  }, []);

  const value = useMemo<RegionContextValue>(() => {
    const info = getRegionInfo(region) || FALLBACK_REGION_INFO;
    return {
      region,
      regionInfo: info,
      regions: ALL_REGIONS,
      preferences,
      detection,
      setRegion,
      setPreferences,
      resetToAuto,
    };
  }, [region, preferences, detection, setRegion, setPreferences, resetToAuto]);

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion() {
  const ctx = useContext(RegionContext);
  if (!ctx) {
    throw new Error("useRegion must be used inside RegionProvider");
  }
  return ctx;
}

export type {
  RegionCode,
  RegionInfo,
  RegionPreferences,
  MeasurementSystem,
  FirstDayOfWeek,
  TimeFormat,
};

export { REGION_CATALOG, ALL_REGIONS, DEFAULT_REGION };


