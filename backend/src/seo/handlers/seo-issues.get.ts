import type { Request, Response } from "express";
import { normalizeUrlKey } from "../utils/normalizeUrlKey";
import { getLatestRunByUrl } from "../runs/run.store";

export function getSeoIssues(req: Request, res: Response) {
  const raw = String(req.query.url || "").trim();
  if (!raw) {
    return res.status(400).json({ ok: false, error: "Missing ?url=" });
  }

  const urlKey = normalizeUrlKey(raw);
  if (!urlKey) {
    return res.status(400).json({ ok: false, error: "Invalid url" });
  }

  const run = getLatestRunByUrl(urlKey);

  if (!run) {
    return res.status(200).json({
      ok: true,
      url: urlKey,
      counts: { critical: 0, warning: 0, info: 0 },
      issues: { critical: [], warning: [], info: [] },
      lastScan: null,
      note: "No scan found for this url yet.",
    });
  }

  const issues = run.issues ?? {
    critical: [],
    warning: [],
    info: [],
  };

  return res.status(200).json({
    ok: true,
    url: urlKey,
    counts: {
      critical: issues.critical?.length ?? 0,
      warning: issues.warning?.length ?? 0,
      info: issues.info?.length ?? 0,
    },
    issues: {
      critical: issues.critical ?? [],
      warning: issues.warning ?? [],
      info: issues.info ?? [],
    },
    lastScan: run.finishedAt ?? run.createdAt ?? null,
    runId: run.runId,
    status: run.status,
  });
}