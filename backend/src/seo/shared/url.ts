export function requireHttpUrl(raw: unknown): string {
  const s = String(raw ?? "").trim();
  if (!s) throw new Error("Missing url");
  let u: URL;
  try { u = new URL(s); } catch { throw new Error("Invalid url"); }
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("URL must be http/https");
  return u.toString();
}
