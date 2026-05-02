export function detectBrowserLanguage(): string {
  if (typeof navigator === "undefined") return "en";

  const raw = navigator.language || "en";
  const short = raw.split("-")[0]?.toLowerCase();

  return short || "en";
}

export function detectBrowserCountry(): string | null {
  if (typeof navigator === "undefined") return null;

  const raw = navigator.language || "";
  const parts = raw.split("-");

  if (parts.length < 2) return null;

  return parts[1].toUpperCase();
}


