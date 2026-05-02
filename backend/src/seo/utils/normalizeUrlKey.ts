export function normalizeUrlKey(input: string): string {
  const raw = String(input || "").trim();
  if (!raw) return "";

  try {
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const u = new URL(withScheme);
    u.hash = "";
    u.search = "";
    u.pathname = "/";
    return `${u.origin}/`;
  } catch {
    return "";
  }
}
