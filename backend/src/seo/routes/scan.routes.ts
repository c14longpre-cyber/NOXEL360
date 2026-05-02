import { Router } from "express";
import { getScan } from "../scans";
import { normalizeUrlKey } from "../utils/normalizeUrlKey";

const router = Router();

router.get("/scan/:scanId", async (req, res) => {
  const scanId = String(req.params.scanId || "").trim();
  const rawUrl = String(req.query.url || "").trim();

  if (!rawUrl) {
    return res.status(400).json({ ok: false, error: "Missing ?url=" });
  }

  const url = normalizeUrlKey(rawUrl);
  if (!url) {
    return res.status(400).json({ ok: false, error: "Invalid url" });
  }

  const plugin = getScan(scanId);
  if (!plugin) {
    return res.status(404).json({ ok: false, error: `Unknown scan: ${scanId}` });
  }

  try {
    const out = await plugin.run({
      url,
      mode: "quick",
      nowIso: new Date().toISOString(),
    });

    return res.status(200).json({
      ok: true,
      scanId,
      result: out,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({
      ok: false,
      error: "Scan failed",
      details: message,
    });
  }
});

export default router;