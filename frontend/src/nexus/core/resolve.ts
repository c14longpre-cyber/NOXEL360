import mapping from "../data/mapping.json";

type MappingEntry = {
  languages: string[];
  priority: string[];
};

type MappingFile = Record<string, MappingEntry>;

const map = mapping as MappingFile;

export function resolveLanguage(options: {
  userLanguage?: string | null;
  detectedLanguage?: string | null;
  detectedCountry?: string | null;
}): string {
  const { userLanguage, detectedLanguage, detectedCountry } = options;

  if (userLanguage) return userLanguage;

  if (detectedCountry && map[detectedCountry]) {
    const allowed = map[detectedCountry].languages;
    if (detectedLanguage && allowed.includes(detectedLanguage)) {
      return detectedLanguage;
    }
    return map[detectedCountry].priority[0] || "en";
  }

  if (detectedLanguage) return detectedLanguage;

  return "en";
}
