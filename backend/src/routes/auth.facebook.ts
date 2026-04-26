import { Router } from "express";
import crypto from "crypto";
import { getFrontendUrl } from "../auth/auth.frontend-url";

const router = Router();

function buildFacebookAuthorizeUrl() {
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI;
  const scope = process.env.FACEBOOK_SCOPE || "public_profile,email";

  if (!clientId) throw new Error("Missing FACEBOOK_CLIENT_ID");
  if (!redirectUri) throw new Error("Missing FACEBOOK_REDIRECT_URI");

  const state = crypto.randomBytes(24).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope,
    response_type: "code",
  });

  return {
    state,
    url: `https://www.facebook.com/v25.0/dialog/oauth?${params.toString()}`,
  };
}

async function readJsonSafe(res: globalThis.Response) {
  const raw = await res.text();

  try {
    return JSON.parse(raw);
  } catch {
    return { raw };
  }
}

function startFacebookAuth(res: import("express").Response) {
  const { url, state } = buildFacebookAuthorizeUrl();

  res.cookie("fb_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: true, // 🔥 IMPORTANT en prod
    maxAge: 10 * 60 * 1000,
  });

  return res.redirect(url);
}

// ================= START =================

router.get("/facebook", (_req, res) => {
  return startFacebookAuth(res);
});

router.get("/facebook/start", (_req, res) => {
  return startFacebookAuth(res);
});

// ================= CALLBACK =================

router.get("/facebook/callback", async (req, res) => {
  const frontendUrl = getFrontendUrl();

  try {
    const code = String(req.query.code || "");
    const returnedState = String(req.query.state || "");
    const savedState = String(req.cookies?.fb_oauth_state || "");

    // ❌ erreur Facebook
    if (req.query.error) {
      return res.redirect(`${frontendUrl}/app/account?error=facebook_cancelled`);
    }

    // ❌ pas de code
    if (!code) {
      return res.redirect(`${frontendUrl}/app/account?error=missing_code`);
    }

    // ❌ state invalide
    if (!returnedState || returnedState !== savedState) {
      return res.redirect(`${frontendUrl}/app/account?error=invalid_state`);
    }

    res.clearCookie("fb_oauth_state");

    const clientId = process.env.FACEBOOK_CLIENT_ID;
    const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return res.redirect(`${frontendUrl}/app/account?error=missing_env`);
    }

    // ================= TOKEN =================

    const tokenParams = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    });

    const tokenRes = await fetch(
      `https://graph.facebook.com/v25.0/oauth/access_token?${tokenParams.toString()}`
    );

    const tokenJson = await readJsonSafe(tokenRes);

    if (!tokenRes.ok || !("access_token" in tokenJson)) {
      return res.redirect(`${frontendUrl}/app/account?error=token_failed`);
    }

    // ================= USER =================

    const meParams = new URLSearchParams({
      fields: "id,name,email,picture.type(large)",
      access_token: String(tokenJson.access_token),
    });

    const meRes = await fetch(
      `https://graph.facebook.com/me?${meParams.toString()}`
    );

    const meJson = await readJsonSafe(meRes);

    if (!meRes.ok || !("id" in meJson)) {
      return res.redirect(`${frontendUrl}/app/account?error=profile_failed`);
    }

    // ================= SUCCESS =================

    const redirectParams = new URLSearchParams({
      provider: "facebook",
      providerUserId: String(meJson.id || ""),
      name: String(meJson.name || ""),
      email: String(meJson.email || ""),
      avatarUrl:
        meJson?.picture?.data?.url || "",
    });

    return res.redirect(`${frontendUrl}/app/account?${redirectParams.toString()}`);

  } catch (error) {
    return res.redirect(`${frontendUrl}/app/account?error=server_error`);
  }
});

export default router;
