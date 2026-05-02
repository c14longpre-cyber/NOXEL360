import { Router } from "express";

export const router = Router();

// Training Center – liste des cours dispos
router.get("/modules", (_req, res) => {
  res.json({
    ok: true,
    module: "training",
    modules: [
      { id: "html-basics", title: "HTML Basics for Web Owners" },
      { id: "seo-intro", title: "SEO 101 – Understand Search Engines" }
    ]
  });
});
