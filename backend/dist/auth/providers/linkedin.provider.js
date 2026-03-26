"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkedinProvider = void 0;
const clientId = process.env.LINKEDIN_CLIENT_ID || "";
const clientSecret = process.env.LINKEDIN_CLIENT_SECRET || "";
function getAuthorizeEndpoint() {
    return "https://www.linkedin.com/oauth/v2/authorization";
}
function getTokenEndpoint() {
    return "https://www.linkedin.com/oauth/v2/accessToken";
}
function getUserInfoEndpoint() {
    return "https://api.linkedin.com/v2/userinfo";
}
function buildScope() {
    return ["openid", "profile", "email"].join(" ");
}
exports.linkedinProvider = {
    provider: "linkedin",
    getAuthorizationUrl(params) {
        if (!clientId) {
            throw new Error("LINKEDIN_CLIENT_ID is missing");
        }
        const url = new URL(getAuthorizeEndpoint());
        url.searchParams.set("response_type", "code");
        url.searchParams.set("client_id", clientId);
        url.searchParams.set("redirect_uri", params.redirectUri);
        url.searchParams.set("state", params.state);
        url.searchParams.set("scope", buildScope());
        return url.toString();
    },
    async exchangeCode(params) {
        if (!clientId) {
            throw new Error("LINKEDIN_CLIENT_ID is missing");
        }
        if (!clientSecret) {
            throw new Error("LINKEDIN_CLIENT_SECRET is missing");
        }
        const tokenBody = new URLSearchParams();
        tokenBody.set("grant_type", "authorization_code");
        tokenBody.set("code", params.code);
        tokenBody.set("client_id", clientId);
        tokenBody.set("client_secret", clientSecret);
        tokenBody.set("redirect_uri", params.redirectUri);
        const tokenRes = await fetch(getTokenEndpoint(), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: tokenBody.toString(),
        });
        if (!tokenRes.ok) {
            const text = await tokenRes.text();
            throw new Error(`LinkedIn token exchange failed: ${tokenRes.status} ${text}`);
        }
        const tokenJson = (await tokenRes.json());
        const accessToken = tokenJson.access_token || null;
        if (!accessToken) {
            throw new Error("LinkedIn did not return an access token");
        }
        const meRes = await fetch(getUserInfoEndpoint(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
            },
        });
        if (!meRes.ok) {
            const text = await meRes.text();
            throw new Error(`LinkedIn profile fetch failed: ${meRes.status} ${text}`);
        }
        const me = (await meRes.json());
        const providerUserId = me.sub || "";
        if (!providerUserId) {
            throw new Error("LinkedIn profile missing sub");
        }
        let expiresAt = null;
        if (typeof tokenJson.expires_in === "number") {
            expiresAt = new Date(Date.now() + tokenJson.expires_in * 1000).toISOString();
        }
        return {
            provider: "linkedin",
            providerUserId,
            email: me.email || null,
            emailVerified: typeof me.email_verified === "boolean" ? me.email_verified : null,
            displayName: me.name || null,
            givenName: me.given_name || null,
            familyName: me.family_name || null,
            avatarUrl: me.picture || null,
            accessToken,
            refreshToken: null,
            expiresAt,
            rawProfile: {
                token: tokenJson,
                me,
            },
        };
    },
};
