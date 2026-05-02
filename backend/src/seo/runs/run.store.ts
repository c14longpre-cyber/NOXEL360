import { sha1 } from "../shared/hash";
import { normalizeUrlKey } from "../utils/normalizeUrlKey";
import type { RunRecord, RunStatus } from "./run.types";

const store = new Map<string, RunRecord>();

export function createRun(url: string): RunRecord {
  const normalizedUrl = normalizeUrlKey(url) || url;
  const runId = sha1(
    normalizedUrl + "::" + Date.now().toString() + "::" + Math.random().toString(16)
  );

  const rec: RunRecord = {
    runId,
    url: normalizedUrl,
    status: "queued",
    createdAt: new Date().toISOString(),
  };

  store.set(runId, rec);
  return rec;
}

export function updateRun(runId: string, patch: Partial<RunRecord>): RunRecord {
  const cur = store.get(runId);
  if (!cur) throw new Error("Run not found");

  const next: RunRecord = {
    ...cur,
    ...patch,
    url: patch.url ? normalizeUrlKey(patch.url) || patch.url : cur.url,
  };

  store.set(runId, next);
  return next;
}

export function setRunStatus(runId: string, status: RunStatus): RunRecord {
  const patch: Partial<RunRecord> = { status };
  if (status === "running") patch.startedAt = new Date().toISOString();
  if (status === "done" || status === "error") patch.finishedAt = new Date().toISOString();
  return updateRun(runId, patch);
}

export function getRun(runId: string): RunRecord | null {
  return store.get(runId) ?? null;
}

export function listRuns(limit = 25): RunRecord[] {
  return Array.from(store.values()).slice(-limit).reverse();
}

export function getLatestRunByUrl(url: string): RunRecord | null {
  const key = normalizeUrlKey(url) || url;

  const runs = Array.from(store.values()).filter(
    (r) => (normalizeUrlKey(r.url) || r.url) === key
  );

  if (runs.length === 0) return null;

  runs.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return runs[0] ?? null;
}

export function listRunsByUrl(url: string, limit = 10): RunRecord[] {
  const key = normalizeUrlKey(url) || url;

  const runs = Array.from(store.values()).filter(
    (r) => (normalizeUrlKey(r.url) || r.url) === key
  );

  runs.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const seen = new Set<string>();
  const out: RunRecord[] = [];

  for (const r of runs) {
    const c = r.issues?.critical.length ?? 0;
    const w = r.issues?.warning.length ?? 0;
    const i = r.issues?.info.length ?? 0;
    const key = `${c}-${w}-${i}-${r.status}`;

    if (!seen.has(key)) {
      seen.add(key);
      out.push(r);
    }

    if (out.length >= limit) break;
  }

  return out;
}