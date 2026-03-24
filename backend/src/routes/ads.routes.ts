import { Router } from "express";

export const router = Router();

// Noxel Ads Builder – création de pub textuelle basique
router.post("/generate", (req, res) => {
  const { platform, objective, productName, description } = req.body;

  // Plus tard: vraie IA + multi-langues + hooks, etc.
  const fakeAd = {
    headline: `Discover ${productName} today`,
    primaryText: `Looking for ${description}? This is your sign. Click to learn more.`,
    cta: "Learn More"
  };

  res.json({
    ok: true,
    module: "ads",
    platform,
    objective,
    ad: fakeAd
  });
});
