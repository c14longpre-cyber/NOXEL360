// backend/src/services/scanStore.ts

export type IssueSeverity = "critical" | "warning" | "info";

export type IssueCategory =
  | "tech"
  | "content"
  | "onpage"
  | "images"
  | "links"
  | "trust"
  | "ux"
  | "performance";

export type IssueConfidence = "measured" | "heuristic" | "inferred";

export type IssueItem = {
  id: string;
  title: string;
  why: string;
  fix: string;
  impact: string;
  severity: IssueSeverity;
  category?: IssueCategory;
  confidence?: IssueConfidence;
  scoreImpact?: number;
};

export type IssuesPayload = {
  critical: IssueItem[];
  warning: IssueItem[];
  info: IssueItem[];
  lastScan?: string;
};

export type SummaryPayload = {
  ok: boolean;
  url: string;
  globalScore: number | null;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  issues: { critical: number; warning: number; info: number };
  lastScan: string;
};

export function emptyIssues(): IssuesPayload {
  return {
    critical: [],
    warning: [],
    info: [],
    lastScan: new Date().toISOString(),
  };
}

const summaryStore = new Map<string, SummaryPayload>();
const issuesStore = new Map<string, IssuesPayload>();

function nowIso() {
  return new Date().toISOString();
}

function counts(p: IssuesPayload) {
  return {
    critical: p.critical.length,
    warning: p.warning.length,
    info: p.info.length,
  };
}

function scoreFromIssues(p: IssuesPayload) {
  const c = p.critical.length;
  const w = p.warning.length;
  const i = p.info.length;

  const raw = 100 - c * 18 - w * 6 - i * 2;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function saveSummary(urlKey: string, summary: SummaryPayload) {
  summaryStore.set(urlKey, summary);
}

export function getScanRecord(urlKey: string): SummaryPayload | null {
  return summaryStore.get(urlKey) ?? null;
}

export function saveIssues(urlKey: string, payload: IssuesPayload) {
  if (!payload.lastScan) payload.lastScan = nowIso();
  issuesStore.set(urlKey, payload);

  const existing = summaryStore.get(urlKey);
  if (!existing) {
    const base = scoreFromIssues(payload);
    const c = counts(payload);

    const summary: SummaryPayload = {
      ok: true,
      url: urlKey,
      globalScore: base,
      performance: base,
      accessibility: base,
      bestPractices: base,
      seo: base,
      issues: c,
      lastScan: payload.lastScan!,
    };

    summaryStore.set(urlKey, summary);
  }
}

export function getIssuesRecord(urlKey: string): IssuesPayload | null {
  return issuesStore.get(urlKey) ?? null;
}