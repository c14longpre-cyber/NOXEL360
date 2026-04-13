export function fallbackLanguage(value?: string | null): string {
  return value && value.trim() ? value : "en";
}
