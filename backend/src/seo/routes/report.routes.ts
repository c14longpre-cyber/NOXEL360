import { Router } from "express";

const router = Router();

// V1: placeholder endpoints (later: read report by id, PDF download)
router.get("/:id", async (_req, res) => {
  res.json({ message: "Report fetch endpoint (V2 storage)" });
});

router.get("/:id/pdf", async (_req, res) => {
  res.json({ message: "PDF download endpoint (V2 puppeteer)" });
});

export default router;
