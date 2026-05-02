import { Router } from "express";
import { buildAppleAuthorizeUrl } from "../services/appleAuth";

const router = Router();

router.get("/apple", (_req, res) => {
  const { url } = buildAppleAuthorizeUrl();
  return res.redirect(url);
});

router.post("/apple/callback", async (req, res) => {
  const { code, id_token, user } = req.body || {};

  return res.json({
    ok: true,
    provider: "apple",
    received: {
      hasCode: !!code,
      hasIdToken: !!id_token,
      hasUserPayload: !!user,
    },
  });
});

export default router;
