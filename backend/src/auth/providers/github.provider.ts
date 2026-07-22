import type { NormalizedOAuthIdentity } from "../auth.types";
import type { ExchangeCodeParams, OAuthProviderAdapter, StartAuthParams } from "./provider.types";

const clientId = process.env.GITHUB_CLIENT_ID || "";
const clientSecret = process.env.GITHUB_CLIENT_SECRET || "";

function buildScope(): string {
  return "user:email read:user";
}

export const githubProvider: OAuthProviderAdapter = {
  provider: "github",

  getAuthorizationUrl(params: StartAuthParams): string {
    if (!clientId) {
      throw new Error("GITHUB_CLIENT_ID is missing");
    }

    const url = new URL("https://github.com/login/oauth/authorize");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", params.redirectUri);
    url.searchParams.set("scope", buildScope());
    url.searchParams.set("state", params.state);

    return url.toString();
  },

  async exchangeCode(params: ExchangeCodeParams): Promise<NormalizedOAuthIdentity> {
    if (!clientId) {
      throw new Error("GITHUB_CLIENT_ID is missing");
    }
    if (!clientSecret) {
      throw new Error("GITHUB_CLIENT_SECRET is missing");
    }

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: params.code,
        redirect_uri: params.redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      throw new Error(`GitHub token exchange failed: ${tokenRes.status} ${text}`);
    }

    const tokenJson = await tokenRes.json() as {
      access_token?: string;
      scope?: string;
      token_type?: string;
    };

    const accessToken = tokenJson.access_token || null;
    if (!accessToken) {
      throw new Error("GitHub did not return an access token");
    }

    const meRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
    });

    if (!meRes.ok) {
      const text = await meRes.text();
      throw new Error(`GitHub profile fetch failed: ${meRes.status} ${text}`);
    }

    const me = await meRes.json() as {
      id?: number;
      login?: string;
      name?: string | null;
      email?: string | null;
      avatar_url?: string | null;
    };

    const providerUserId = me.id ? String(me.id) : "";
    if (!providerUserId) {
      throw new Error("GitHub profile missing id");
    }

    let email = me.email || null;
    if (!email) {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
      });
      if (emailRes.ok) {
        const emails = await emailRes.json() as Array<{ email: string; primary: boolean; verified: boolean }>;
        if (Array.isArray(emails)) {
          const primary = emails.find((e) => e.primary && e.verified);
          email = primary?.email || emails[0]?.email || null;
        }
      }
    }

    return {
      provider: "github",
      providerUserId,
      email,
      emailVerified: null,
      displayName: me.name || me.login || null,
      givenName: null,
      familyName: null,
      avatarUrl: me.avatar_url || null,
      accessToken,
      refreshToken: null,
      expiresAt: null,
      rawProfile: { token: tokenJson, me },
    };
  },
};
