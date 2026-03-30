"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiktokProvider = void 0;
const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || "";
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || "";
async function fetchJson(input, init) {
    const response = await fetch(input, init);
    const text = await response.text();
    let data = null;
    try {
        data = text ? JSON.parse(text) : null;
    }
    catch {
        throw new Error(`TikTok returned non-JSON response (${response.status})`);
    }
    if (!response.ok) {
        throw new Error(`TikTok API error (${response.status}): ${JSON.stringify(data)}`);
    }
    return data;
}
exports.tiktokProvider = {
    getAuthorizationUrl({ intent: _intent, state, redirectUri, }) {
        if (!TIKTOK_CLIENT_KEY) {
            throw new Error("TIKTOK_CLIENT_KEY is missing in environment");
        }
        const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
        url.searchParams.set("client_key", TIKTOK_CLIENT_KEY);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("scope", "user.info.basic");
        url.searchParams.set("redirect_uri", redirectUri);
        url.searchParams.set("state", state);
        return url.toString();
    },
    async exchangeCode({ code, redirectUri, }) {
        if (!TIKTOK_CLIENT_KEY) {
            throw new Error("TIKTOK_CLIENT_KEY is missing in environment");
        }
        if (!TIKTOK_CLIENT_SECRET) {
            throw new Error("TIKTOK_CLIENT_SECRET is missing in environment");
        }
        const tokenBody = new URLSearchParams({
            client_key: TIKTOK_CLIENT_KEY,
            client_secret: TIKTOK_CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
        });
        const token = await fetchJson("https://open.tiktokapis.com/v2/oauth/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: tokenBody.toString(),
        });
        const userInfo = await fetchJson("https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token.access_token}`,
            },
        });
        const user = userInfo?.data?.user;
        const providerUserId = user?.open_id || token.open_id || "";
        if (!providerUserId) {
            throw new Error("TikTok did not return an open_id");
        }
        return {
            provider: "tiktok",
            providerUserId,
            email: null,
            emailVerified: false,
            displayName: user?.display_name || null,
            avatarUrl: user?.avatar_url || null,
            accessToken: token.access_token || null,
            refreshToken: token.refresh_token || null,
            raw: {
                token,
                userInfo,
            },
        };
    },
};
