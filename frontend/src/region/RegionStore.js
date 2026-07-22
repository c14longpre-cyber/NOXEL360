import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from "react";
import { getRegionInfo, isSupportedRegion, ALL_REGIONS, DEFAULT_REGION, REGION_CATALOG, } from "./regionCatalog";
import { detectRegion, persistRegion, REGION_STORAGE_KEY, } from "./detectRegion";
const PREFERENCES_STORAGE_KEY = "noxel.region.preferences";
const RegionContext = createContext(null);
function loadPreferences() {
    if (typeof window === "undefined")
        return {};
    try {
        const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
        if (!raw)
            return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
    }
    catch {
        return {};
    }
}
function savePreferences(prefs) {
    if (typeof window === "undefined")
        return;
    try {
        window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
    }
    catch {
        /* silent */
    }
}
const FALLBACK_REGION_INFO = {
    code: DEFAULT_REGION,
    name: "United States",
    flag: "🇺🇸",
    timezone: "America/New_York",
    measurementSystem: "imperial",
    firstDayOfWeek: 0,
    timeFormat: "12h",
};
export function RegionProvider({ children }) {
    const [detection, setDetection] = useState(null);
    const [region, setRegionState] = useState(() => {
        const result = detectRegion();
        return result.code;
    });
    const [preferences, setPreferencesState] = useState(() => loadPreferences());
    // Publie le résultat de détection initial
    useEffect(() => {
        setDetection(detectRegion());
    }, []);
    const setRegion = useCallback((code) => {
        const upper = code.toUpperCase();
        if (!isSupportedRegion(upper))
            return;
        setRegionState(upper);
        persistRegion(upper);
    }, []);
    const setPreferences = useCallback((update) => {
        setPreferencesState((prev) => {
            const next = { ...prev, ...update };
            savePreferences(next);
            return next;
        });
    }, []);
    const resetToAuto = useCallback(() => {
        if (typeof window !== "undefined") {
            try {
                window.localStorage.removeItem(REGION_STORAGE_KEY);
            }
            catch {
                /* silent */
            }
        }
        const result = detectRegion();
        setDetection(result);
        setRegionState(result.code);
    }, []);
    const value = useMemo(() => {
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
    return _jsx(RegionContext.Provider, { value: value, children: children });
}
export function useRegion() {
    const ctx = useContext(RegionContext);
    if (!ctx) {
        throw new Error("useRegion must be used inside RegionProvider");
    }
    return ctx;
}
export { REGION_CATALOG, ALL_REGIONS, DEFAULT_REGION };
