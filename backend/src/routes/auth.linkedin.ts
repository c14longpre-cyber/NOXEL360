import { Router } from "express";
import crypto from "crypto";
import { buildLinkedInAuthorizeUrl } from "../services/linkedinAuth";

const router = Router();

async function readJsonSafe(res: globalThis.Response) {
  const raw = await res.text();

  try {
    return JSON.parse(raw);
  } catch {
    return { raw };
  }
}

function startLinkedInAuth(res: import("express").Response) {
  const state = crypto.randomBytes(24).toString("hex");

  const { url } = buildLinkedInAuthorizeUrl(state);

  res.cookie("linkedin_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 10 * 60 * 1000,
  });

  return res.redirect(url);
}

router.get("/linkedin", (_req, res) => {
  try {
    return startLinkedInAuth(res);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      provider: "linkedin",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/linkedin/start", (_req, res) => {
  try {
    return startLinkedInAuth(res);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      provider: "linkedin",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/linkedin/callback", async (req, res) => {
  try {
    const code = String(req.query.code || "");
    const returnedState = String(req.query.state || "");
    const savedState = String(req.cookies?.linkedin_oauth_state || "");
    const errorParam = String(req.query.error || "");
    const errorDescription = String(req.query.error_description || "");
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    if (errorParam || errorDescription) {
      const redirectParams = new URLSearchParams({
        provider: "linkedin",
        error: errorParam || "linkedin_login_failed",
        description:
          errorDescription || "User cancelled or provider returned an error.",
      });

      return res.redirect(`${frontendUrl}/auth/callback?${redirectParams.toString()}`);
    }

    if (!code) {
      const redirectParams = new URLSearchParams({
        provider: "linkedin",
        error: "missing_code",
        description: "Missing LinkedIn code.",
      });

      return res.redirect(`${frontendUrl}/auth/callback?${redirectParams.toString()}`);
    }

    if (!returnedState || !savedState || returnedState !== savedState) {
      const redirectParams = new URLSearchParams({
        provider: "linkedin",
        error: "invalid_state",
        description: "LinkedIn state validation failed.",
      });

      return res.redirect(`${frontendUrl}/auth/callback?${redirectParams.toString()}`);
    }

    res.clearCookie("linkedin_oauth_state");

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      const redirectParams = new URLSearchParams({
        provider: "linkedin",
        error: "missing_env",
        description: "Missing LinkedIn environment variables.",
      });

      return res.redirect(`${frontendUrl}/auth/callback?${redirectParams.toString()}`);
    }

    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    });

    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: tokenParams.toString(),
    });

    const tokenJson = await readJsonSafe(tokenRes);

    if (!tokenRes.ok || !("access_token" in tokenJson)) {
      const redirectParams = new URLSearchParams({
        provider: "linkedin",
        error: "token_exchange_failed",
        description: JSON.stringify(tokenJson),
      });

      return res.redirect(`${frontendUrl}/auth/callback?${redirectParams.toString()}`);
    }

    const accessToken = String(tokenJson.access_token);

    const userInfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    const userInfoJson = await readJsonSafe(userInfoRes);

    if (!userInfoRes.ok || !("sub" in userInfoJson)) {
      const redirectParams = new URLSearchParams({
        provider: "linkedin",
        error: "profile_fetch_failed",
        description: JSON.stringify(userInfoJson),
      });

      return res.redirect(`${frontendUrl}/auth/callback?${redirectParams.toString()}`);
    }

    const redirectParams = new URLSearchParams({
      provider: "linkedin",
      providerUserId: String(userInfoJson.sub || ""),
      name:
        "name" in userInfoJson
          ? String(userInfoJson.name || "")
          : [
              "given_name" in userInfoJson ? String(userInfoJson.given_name || "") : "",
              "family_name" in userInfoJson ? String(userInfoJson.family_name || "") : "",
            ]
              .join(" ")
              .trim(),
      email: "email" in userInfoJson ? String(userInfoJson.email || "") : "",
      avatarUrl:
        "picture" in userInfoJson ? String(userInfoJson.picture || "") : "",
    });

    return res.redirect(`${frontendUrl}/auth/callback?${redirectParams.toString()}`);
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const redirectParams = new URLSearchParams({
      provider: "linkedin",
      error: "server_error",
      description: error instanceof Error ? error.message : "Unknown error",
    });

    return res.redirect(`${frontendUrl}/auth/callback?${redirectParams.toString()}`);
  }
});

export default router;