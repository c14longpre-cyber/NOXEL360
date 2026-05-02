export function requireHttpUrl(raw: unknown): string {
  if (!raw || typeof raw !== "string") {
    const err: any = new Error("url is required");
    err.code = "MISSING_URL";
    err.status = 400;
    err.details = { field: "url" };
    throw err;
  }

  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    const err: any = new Error("url must be a valid http/https URL");
    err.code = "INVALID_URL";
    err.status = 400;
    err.details = { field: "url" };
    throw err;
  }

  if (u.protocol !== "http:" && u.protocol !== "https:") {
    const err: any = new Error("url must start with http:// or https://");
    err.code = "INVALID_URL";
    err.status = 400;
    err.details = { field: "url" };
    throw err;
  }

  return u.toString();
}
