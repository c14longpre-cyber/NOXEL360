import { Router } from "express";
import { requireHttpUrl } from "../shared/url";
import { getScanRecord, getIssuesRecord } from "../services/scanStore";

const router = Router();

/**
 * Compatibility routes for legacy frontend calls:
 * - /api/seo/summary?url=...
 * - /api/seo/issues?url=...
 *
 * Mounted at: /api/seo
 */

router.get("/summary", (req, res) => {
  const url = requireHttpUrl(req.query.url);

  const summary = getScanRecord(url);
  if (!summary) {
    return res.status(404).json({ ok: false, error: "No scan summary yet" });
  }

  return res.json(summary);
});

router.get("/issues", (req, res) => {
  const url = requireHttpUrl(req.query.url);

  const issues = getIssuesRecord(url);
  if (!issues) {
    return res.status(404).json({ ok: false, error: "No issues yet" });
  }

  return res.json(issues);
});

export default router;
