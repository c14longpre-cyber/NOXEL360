"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleProvider = void 0;
const clientId = process.env.GOOGLE_CLIENT_ID || "";
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
function getAuthorizeEndpoint() {
    return "https://accounts.google.com/o/oauth2/v2/auth";
}
function getTokenEndpoint() {
    return "https://oauth2.googleapis.com/token";
}
function getUserInfoEndpoint() {
    return "https://openidconnect.googleapis.com/v1/userinfo";
}
function buildScope() {
    return ["openid", "email", "profile"].join(" ");
}
exports.googleProvider = {
    provider: "google",
    getAuthorizationUrl(params) {
        if (!clientId) {
            throw new Error("GOOGLE_CLIENT_ID is missing");
        }
        const url = new URL(getAuthorizeEndpoint());
        url.searchParams.set("client_id", clientId);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("redirect_uri", params.redirectUri);
        url.searchParams.set("scope", buildScope());
        url.searchParams.set("state", params.state);
        url.searchParams.set("access_type", "offline");
        url.searchParams.set("prompt", "consent");
        if (params.codeChallenge) {
            url.searchParams.set("code_challenge", params.codeChallenge);
            url.searchParams.set("code_challenge_method", "S256");
        }
        return url.toString();
    },
    async exchangeCode(params) {
        if (!clientId) {
            throw new Error("GOOGLE_CLIENT_ID is missing");
        }
        if (!clientSecret) {
            throw new Error("GOOGLE_CLIENT_SECRET is missing");
        }
        const tokenBody = new URLSearchParams();
        tokenBody.set("client_id", clientId);
        tokenBody.set("client_secret", clientSecret);
        tokenBody.set("code", params.code);
        tokenBody.set("grant_type", "authorization_code");
        tokenBody.set("redirect_uri", params.redirectUri);
        if (params.codeVerifier) {
            tokenBody.set("code_verifier", params.codeVerifier);
        }
        const tokenRes = await fetch(getTokenEndpoint(), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: tokenBody.toString(),
        });
        if (!tokenRes.ok) {
            const text = await tokenRes.text();
            throw new Error(`Google token exchange failed: ${tokenRes.status} ${text}`);
        }
        const tokenJson = await tokenRes.json();
        const accessToken = tokenJson.access_token || null;
        const refreshToken = tokenJson.refresh_token || null;
        if (!accessToken) {
            throw new Error("Google did not return an access token");
        }
        const meRes = await fetch(getUserInfoEndpoint(), {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!meRes.ok) {
            const text = await meRes.text();
            throw new Error(`Google profile fetch failed: ${meRes.status} ${text}`);
        }
        const me = await meRes.json();
        const providerUserId = me.sub || "";
        if (!providerUserId) {
            throw new Error("Google profile missing sub");
        }
        let expiresAt = null;
        if (typeof tokenJson.expires_in === "number") {
            expiresAt = new Date(Date.now() + tokenJson.expires_in * 1000).toISOString();
        }
        return {
            provider: "google",
            providerUserId,
            email: me.email || null,
            emailVerified: typeof me.email_verified === "boolean" ? me.email_verified : null,
            displayName: me.name || null,
            givenName: me.given_name || null,
            familyName: me.family_name || null,
            avatarUrl: me.picture || null,
            accessToken,
            refreshToken,
            expiresAt,
            rawProfile: {
                token: tokenJson,
                me,
            },
        };
    },
};
