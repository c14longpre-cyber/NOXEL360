import { Router } from "express";
import { requireHttpUrl } from "../shared/url";
import { startRun } from "../services/runEngine";
import { getRun, listRuns } from "../runs/run.store";

const router = Router();

// GET /api/noxel/health
router.get("/health", (_req, res) => res.json({ ok: true, service: "noxel-core", ts: new Date().toISOString() }));

// POST /api/noxel/run  { url, mode? }
router.post("/run", async (req, res) => {
  const url = requireHttpUrl(req.body?.url);
  const mode = (String(req.body?.mode || "quick") as any);
  const out = await startRun(url, mode);
  res.json(out);
});

// GET /api/noxel/run/:runId
router.get("/run/:runId", (req, res) => {
  const r = getRun(String(req.params.runId));
  if (!r) return res.status(404).json({ ok: false, error: "Run not found" });
  res.json({ ok: true, run: r });
});

// GET /api/noxel/runs
router.get("/runs", (_req, res) => res.json({ ok: true, runs: listRuns(25) }));

export default router;
