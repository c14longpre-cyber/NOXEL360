import mapping from "../data/mapping.json";
const map = mapping;
export function resolveLanguage(options) {
    const { userLanguage, detectedLanguage, detectedCountry } = options;
    if (userLanguage)
        return userLanguage;
    if (detectedCountry && map[detectedCountry]) {
        const allowed = map[detectedCountry].languages;
        if (detectedLanguage && allowed.includes(detectedLanguage)) {
            return detectedLanguage;
        }
        return map[detectedCountry].priority[0] || "en";
    }
    if (detectedLanguage)
        return detectedLanguage;
    return "en";
}
