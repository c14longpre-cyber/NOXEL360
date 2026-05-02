export function requireHttpUrl(value: any): string {
  if (!value || typeof value !== "string") {
    throw new Error("URL is required");
  }

  const url = value.trim();

  if (!/^https?:\/\//i.test(url)) {
    throw new Error("Invalid URL format");
  }

  return url;
}