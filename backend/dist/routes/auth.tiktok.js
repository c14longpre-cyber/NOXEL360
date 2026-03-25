"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const auth_frontend_url_1 = require("../auth/auth.frontend-url");
const router = (0, express_1.Router)();
function buildTikTokAuthorizeUrl() {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const redirectUri = process.env.TIKTOK_REDIRECT_URI;
    const scope = process.env.TIKTOK_SCOPE || "user.info.basic";
    if (!clientKey) {
        throw new Error("Missing TIKTOK_CLIENT_KEY");
    }
    if (!redirectUri) {
        throw new Error("Missing TIKTOK_REDIRECT_URI");
    }
    const state = crypto_1.default.randomBytes(24).toString("hex");
    const params = new URLSearchParams({
        client_key: clientKey,
        scope,
        response_type: "code",
        redirect_uri: redirectUri,
        state,
    });
    return {
        state,
        url: `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`,
    };
}
// STEP 1 — Redirect user to TikTok
router.get("/tiktok", (_req, res) => {
    try {
        const { url } = buildTikTokAuthorizeUrl();
        return res.redirect(url);
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            provider: "tiktok",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
// STEP 2 — Callback TikTok
router.get("/tiktok/callback", async (req, res) => {
    try {
        const code = String(req.query.code || "");
        const frontendUrl = (0, auth_frontend_url_1.getFrontendUrl)();
        if (!code) {
            return res.status(400).json({
                ok: false,
                provider: "tiktok",
                error: "Missing TikTok code.",
            });
        }
        const clientKey = process.env.TIKTOK_CLIENT_KEY;
        const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
        const redirectUri = process.env.TIKTOK_REDIRECT_URI;
        if (!clientKey || !clientSecret || !redirectUri) {
            return res.status(500).json({
                ok: false,
                provider: "tiktok",
                error: "Missing TikTok environment variables.",
            });
        }
        // Exchange code → token
        const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_key: clientKey,
                client_secret: clientSecret,
                code,
                grant_type: "authorization_code",
                redirect_uri: redirectUri,
            }).toString(),
        });
        const tokenJson = await tokenRes.json();
        if (!tokenRes.ok || !tokenJson.access_token) {
            return res.status(400).json({
                ok: false,
                provider: "tiktok",
                step: "token_exchange",
                details: tokenJson,
            });
        }
        // Optional: fetch user profile
        const userRes = await fetch("https://open.tiktokapis.com/v2/user/info/", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${tokenJson.access_token}`,
            },
        });
        const userJson = await userRes.json();
        const normalizedUser = {
            provider: "tiktok",
            accessToken: tokenJson.access_token,
            openId: tokenJson.open_id || null,
            expiresIn: tokenJson.expires_in || null,
            user: userJson?.data || null,
        };
        const payload = encodeURIComponent(JSON.stringify(normalizedUser));
        return res.redirect(`${frontendUrl}/auth/callback?provider=tiktok&data=${payload}`);
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            provider: "tiktok",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.default = router;
