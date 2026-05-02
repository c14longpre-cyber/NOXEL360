import { Router } from "express";

export const router = Router();

// Noxel Market – liste des items (placeholder)
router.get("/items", (_req, res) => {
  res.json({
    ok: true,
    module: "market",
    items: [
      { id: "tpl-home-pro", type: "template", name: "Home Page Pro Template" },
      { id: "pack-ads-cosmetics", type: "pack", name: "Cosmetics Ads Pack" }
    ]
  });
});
