import type { Request, Response } from "express";
import { normalizeUrlKey } from "../utils/normalizeUrlKey";
import { getScanRecord } from "../services/scanStore";

export function getSeoSummary(req: Request, res: Response) {
  const raw = String(req.query.url || "").trim();
  if (!raw) return res.status(400).json({ ok: false, error: "Missing ?url=" });

  const urlKey = normalizeUrlKey(raw);
  if (!urlKey) return res.status(400).json({ ok: false, error: "Invalid url" });

  const record = getScanRecord(urlKey);

  if (!record) {
    return res.status(200).json({
      ok: true,
      url: urlKey,
      globalScore: null,
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0,
      issues: { critical: 0, warning: 0, info: 0 },
      lastScan: null,
      note: "No scan found for this url yet. Run /scan first.",
    });
  }

  return res.status(200).json(record);
}
