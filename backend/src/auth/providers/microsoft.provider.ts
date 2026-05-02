import type { NormalizedOAuthIdentity } from "../auth.types";
import type { ExchangeCodeParams, OAuthProviderAdapter, StartAuthParams } from "./provider.types";

const tenant = process.env.MICROSOFT_TENANT_ID || "common";
const clientId = process.env.MICROSOFT_CLIENT_ID || "";
const clientSecret = process.env.MICROSOFT_CLIENT_SECRET || "";

function getAuthorizeEndpoint(): string {
  return `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`;
}

function getTokenEndpoint(): string {
  return `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
}

function buildScope(): string {
  return ["openid", "profile", "email", "User.Read"].join(" ");
}

export const microsoftProvider: OAuthProviderAdapter = {
  provider: "microsoft",

  getAuthorizationUrl(params: StartAuthParams): string {
    const url = new URL(getAuthorizeEndpoint());

    url.searchParams.set("client_id", clientId);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("redirect_uri", params.redirectUri);
    url.searchParams.set("response_mode", "query");
    url.searchParams.set("scope", buildScope());
    url.searchParams.set("state", params.state);

    if (params.codeChallenge) {
      url.searchParams.set("code_challenge", params.codeChallenge);
      url.searchParams.set("code_challenge_method", "S256");
    }

    return url.toString();
  },

  async exchangeCode(params: ExchangeCodeParams): Promise<NormalizedOAuthIdentity> {
    if (!clientId) {
      throw new Error("MICROSOFT_CLIENT_ID is missing");
    }

    const tokenBody = new URLSearchParams();
    tokenBody.set("client_id", clientId);
    tokenBody.set("client_secret", clientSecret);
    tokenBody.set("code", params.code);
    tokenBody.set("grant_type", "authorization_code");
    tokenBody.set("redirect_uri", params.redirectUri);
    tokenBody.set("scope", buildScope());

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
      throw new Error(`Microsoft token exchange failed: ${tokenRes.status} ${text}`);
    }

    const tokenJson = await tokenRes.json() as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      id_token?: string;
    };

    const accessToken = tokenJson.access_token || null;
    const refreshToken = tokenJson.refresh_token || null;

    if (!accessToken) {
      throw new Error("Microsoft did not return an access token");
    }

    const meRes = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!meRes.ok) {
      const text = await meRes.text();
      throw new Error(`Microsoft profile fetch failed: ${meRes.status} ${text}`);
    }

    const me = await meRes.json() as {
      id?: string;
      displayName?: string;
      givenName?: string;
      surname?: string;
      mail?: string | null;
      userPrincipalName?: string | null;
    };

    const providerUserId = me.id || "";
    if (!providerUserId) {
      throw new Error("Microsoft profile missing id");
    }

    const email = me.mail || me.userPrincipalName || null;

    let expiresAt: string | null = null;
    if (typeof tokenJson.expires_in === "number") {
      expiresAt = new Date(Date.now() + tokenJson.expires_in * 1000).toISOString();
    }

    return {
      provider: "microsoft",
      providerUserId,
      email,
      emailVerified: null,
      displayName: me.displayName || null,
      givenName: me.givenName || null,
      familyName: me.surname || null,
      avatarUrl: null,
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
