import type { IssueItem } from "./scanStore";

export type ScanId =
  | "tech"
  | "content"
  | "lighthouse"
  | "media"
  | "security"
  | "crawl"
  | string;

export type ScanState = "idle" | "running" | "done" | "error";

export type ScanResult = {
  scanId: ScanId;
  state: ScanState;
  startedAt?: string;
  finishedAt?: string;
  error?: string;

  // normalized output
  summary?: Record<string, any>;
  issues?: {
    critical: IssueItem[];
    warning: IssueItem[];
    info: IssueItem[];
  };

  artifacts?: Record<string, any>;
};

export type UrlReport = {
  urlKey: string;
  updatedAt: string;
  results: Record<string, ScanResult>;
};

const store = new Map<string, UrlReport>();

export function getOrCreateReport(urlKey: string): UrlReport {
  const cur = store.get(urlKey);
  if (cur) return cur;
  const fresh: UrlReport = { urlKey, updatedAt: new Date().toISOString(), results: {} };
  store.set(urlKey, fresh);
  return fresh;
}

export function upsertScanResult(urlKey: string, scanId: ScanId, patch: Partial<ScanResult>) {
  const rep = getOrCreateReport(urlKey);
  const prev = rep.results[scanId] ?? { scanId, state: "idle" as ScanState };
  rep.results[scanId] = { ...prev, ...patch, scanId };
  rep.updatedAt = new Date().toISOString();
  store.set(urlKey, rep);
}

export function getReport(urlKey: string): UrlReport | null {
  return store.get(urlKey) ?? null;
}
