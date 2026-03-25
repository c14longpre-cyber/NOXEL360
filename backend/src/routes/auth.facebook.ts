import { Router } from "express";
import crypto from "crypto";

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
    secure: false,
    maxAge: 10 * 60 * 1000,
  });

  return res.redirect(url);
}

router.get("/facebook", (_req, res) => {
  try {
    return startFacebookAuth(res);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      provider: "facebook",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/facebook/start", (_req, res) => {
  try {
    return startFacebookAuth(res);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      provider: "facebook",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/facebook/callback", async (req, res) => {
  try {
    const code = String(req.query.code || "");
    const returnedState = String(req.query.state || "");
    const savedState = String(req.cookies?.fb_oauth_state || "");
    const errorReason = String(req.query.error_reason || "");
    const errorDescription = String(req.query.error_description || "");
    const frontendUrl = getFrontendUrl();

    if (errorReason || errorDescription) {
      const redirectParams = new URLSearchParams({
        provider: "facebook",
        error: errorReason || "facebook_login_failed",
        description:
          errorDescription || "User cancelled or provider returned an error.",
      });

      return res.redirect(`${frontendUrl}/auth/callback?${redirectParams.toString()}`);
    }

    if (!code) {
      const redirectParams = new URLSearchParams({
        provider: "facebook",
        error: "missing_code",
        description: "Missing Facebook code.",
      });

      return res.redirect(`${frontendUrl}/auth/callback?${redirectParams.toString()}`);
    }

    if (!returnedState || !savedState || returnedState !== savedState) {
      const redirectParams = new URLSearchParams({
        provider: "facebook",
        error: "invalid_state",
        description: "Facebook state validation failed.",
      });

      return res.redirect(`${frontendUrl}/auth/callback?${redirectParams.toString()}`);
    }

    res.clearCookie("fb_oauth_state");

    const clientId = process.env.FACEBOOK_CLIENT_ID;
    const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      const redirectParams = new URLSearchParams({
        provider: "facebook",
        error: "missing_env",
        description: "Missing Facebook environment variables.",
      });

      return res.redirect(`${frontendUrl}/auth/callback?${redirectParams.toString()}`);
    }

    const tokenParams = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    });

    const tokenRes = await fetch(
      `https://graph.facebook.com/v25.0/oauth/access_token?${tokenParams.toString()}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    const tokenJson = await readJsonSafe(tokenRes);

    if (!tokenRes.ok || !("access_token" in tokenJson)) {
      const redirectParams = new URLSearchParams({
        provider: "facebook",
        error: "token_exchange_failed",
        description: JSON.stringify(tokenJson),
      });

      return res.redirect(`${frontendUrl}/auth/callback?${redirectParams.toString()}`);
    }

    const meParams = new URLSearchParams({
      fields: "id,name,email,picture.type(large)",
      access_token: String(tokenJson.access_token),
    });

    const meRes = await fetch(
      `https://graph.facebook.com/me?${meParams.toString()}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    const meJson = await readJsonSafe(meRes);

    if (!meRes.ok || !("id" in meJson)) {
      const redirectParams = new URLSearchParams({
        provider: "facebook",
        error: "profile_fetch_failed",
        description: JSON.stringify(meJson),
      });

      return res.redirect(`${frontendUrl}/auth/callback?${redirectParams.toString()}`);
    }

    const redirectParams = new URLSearchParams({
      provider: "facebook",
      providerUserId: String(meJson.id || ""),
      name: "name" in meJson ? String(meJson.name || "") : "",
      email: "email" in meJson ? String(meJson.email || "") : "",
      avatarUrl:
        "picture" in meJson &&
        meJson.picture &&
        typeof meJson.picture === "object" &&
        "data" in meJson.picture &&
        meJson.picture.data &&
        typeof meJson.picture.data === "object" &&
        "url" in meJson.picture.data
          ? String(meJson.picture.data.url || "")
          : "",
    });

    return res.redirect(`${frontendUrl}/auth/callback?${redirectParams.toString()}`);
  } catch (error) {
    const frontendUrl = getFrontendUrl();

    const redirectParams = new URLSearchParams({
      provider: "facebook",
      error: "server_error",
      description: error instanceof Error ? error.message : "Unknown error",
    });

    return res.redirect(`${frontendUrl}/auth/callback?${redirectParams.toString()}`);
  }
});

export default router;