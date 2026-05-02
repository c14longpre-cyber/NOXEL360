import { Router } from "express";
import { requireHttpUrl } from "../shared/url";
import { startRun } from "../services/runEngine";
import { getLatestRunByUrl, listRunsByUrl } from "../runs/run.store";
import { toWebsiteVM } from "../viewmodels/website.vm";
import { toVersionVM } from "../viewmodels/version.vm";

const router = Router();

/**
 * UI-friendly endpoints (NOXEL Product Shell)
 * - GET /api/seo/vm/summary?url=...
 * - GET /api/seo/vm/versions?url=...
 * Note: We keep legacy /api/seo/summary and /api/seo/issues as-is.
 */

router.get("/summary", async (req, res) => {
  const url = requireHttpUrl(req.query.url);
  await startRun(url, "quick");

  const run = getLatestRunByUrl(url);
  if (!run) {
    return res.status(404).json({ ok: false, error: "No runs for url" });
  }

  return res.json({ ok: true, website: toWebsiteVM(run) });
});

router.get("/versions", async (req, res) => {
  const url = requireHttpUrl(req.query.url);

  await startRun(url, "quick");

  const runs = listRunsByUrl(url, 10);
  if (runs.length === 0) {
    return res.json({ ok: true, versions: [] });
  }

  const ordered = [...runs].reverse();
  const versions = ordered.map((r, idx) => {
    const prev = idx > 0 ? ordered[idx - 1] : null;
    return toVersionVM(r, prev, idx + 1);
  });

  return res.json({ ok: true, versions });
});

export default router;