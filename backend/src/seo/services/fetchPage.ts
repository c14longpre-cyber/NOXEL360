// backend/src/services/fetchPage.ts
// Lightweight fetch helper (Node 18+ has global fetch)
export type FetchPageResult = {
  url: string;
  finalUrl: string;
  status: number;
  contentType: string;
  html: string;
  ttfbMs: number;
  totalMs: number;
  bytes: number;
};

export async function fetchPage(url: string): Promise<FetchPageResult> {
  const started = Date.now();
  const res = await fetch(url, { redirect: "follow" });
  const ttfbMs = Date.now() - started;

  const finalUrl = (res as any).url || url;
  const status = res.status;
  const contentType = res.headers.get("content-type") || "";
  const html = await res.text();
  const totalMs = Date.now() - started;

  const bytes = Buffer.byteLength(html, "utf8");

  return { url, finalUrl, status, contentType, html, ttfbMs, totalMs, bytes };
}
