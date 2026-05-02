// routes/pdf.routes.ts
import { Router } from "express";
import { getLastScan } from "../services/scanOrchestrator";
import { buildGlobalPdf } from "../services/pdfExport";

const router = Router();

router.get("/export/pdf", (_req, res) => {
  const last = getLastScan();
  if (!last) return res.status(404).json({ error: "No scan to export" });

  const pdf = buildGlobalPdf(last);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="noxel-report.pdf"`);
  res.send(pdf);
});

export default router;
