import { HttpError } from "../../utils/http";

export function requireHttpUrl(raw: unknown): string {
  const s = String(raw ?? "").trim();
  if (!s) throw new HttpError(400, "Missing url");
  let u: URL;
  try { u = new URL(s); } catch { throw new HttpError(400, "Invalid url"); }
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new HttpError(400, "URL must be http/https");
  return u.toString();
}
