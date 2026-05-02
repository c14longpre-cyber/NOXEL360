import { Router } from "express";

const router = Router();

function getGoogleAuthorizeUrl() {
  const base = "https://accounts.google.com/o/oauth2/v2/auth";

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  return `${base}?${params.toString()}`;
}

router.get("/google", (_req, res) => {
  const url = getGoogleAuthorizeUrl();
  return res.redirect(url);
});

export default router;