import type { NormalizedOAuthIdentity } from "../auth.types";
import type {
  ExchangeCodeParams,
  OAuthProviderAdapter,
  StartAuthParams,
} from "./provider.types";

const clientId = process.env.FACEBOOK_CLIENT_ID || "";
const clientSecret = process.env.FACEBOOK_CLIENT_SECRET || "";

function getAuthorizeEndpoint(): string {
  return "https://www.facebook.com/v25.0/dialog/oauth";
}

function getTokenEndpoint(): string {
  return "https://graph.facebook.com/v25.0/oauth/access_token";
}

function getUserInfoEndpoint(): string {
  return "https://graph.facebook.com/me";
}

function buildScope(): string {
  return ["public_profile", "email"].join(",");
}

export const facebookProvider: OAuthProviderAdapter = {
  provider: "facebook",

  getAuthorizationUrl(params: StartAuthParams): string {
    if (!clientId) {
      throw new Error("FACEBOOK_CLIENT_ID is missing");
    }

    const url = new URL(getAuthorizeEndpoint());

    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", params.redirectUri);
    url.searchParams.set("state", params.state);
    url.searchParams.set("scope", buildScope());
    url.searchParams.set("response_type", "code");

    return url.toString();
  },

  async exchangeCode(
    params: ExchangeCodeParams
  ): Promise<NormalizedOAuthIdentity> {
    if (!clientId) {
      throw new Error("FACEBOOK_CLIENT_ID is missing");
    }

    if (!clientSecret) {
      throw new Error("FACEBOOK_CLIENT_SECRET is missing");
    }

    const tokenUrl = new URL(getTokenEndpoint());
    tokenUrl.searchParams.set("client_id", clientId);
    tokenUrl.searchParams.set("client_secret", clientSecret);
    tokenUrl.searchParams.set("redirect_uri", params.redirectUri);
    tokenUrl.searchParams.set("code", params.code);

    const tokenRes = await fetch(tokenUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      throw new Error(
        `Facebook token exchange failed: ${tokenRes.status} ${text}`
      );
    }

    const tokenJson = (await tokenRes.json()) as {
      access_token?: string;
      token_type?: string;
      expires_in?: number;
    };

    const accessToken = tokenJson.access_token || null;
    if (!accessToken) {
      throw new Error("Facebook did not return an access token");
    }

    const meUrl = new URL(getUserInfoEndpoint());
    meUrl.searchParams.set("fields", "id,name,email,first_name,last_name,picture.type(large)");
    meUrl.searchParams.set("access_token", accessToken);

    const meRes = await fetch(meUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!meRes.ok) {
      const text = await meRes.text();
      throw new Error(
        `Facebook profile fetch failed: ${meRes.status} ${text}`
      );
    }

    const me = (await meRes.json()) as {
      id?: string;
      name?: string | null;
      email?: string | null;
      first_name?: string | null;
      last_name?: string | null;
      picture?: {
        data?: {
          url?: string | null;
        };
      };
    };

    const providerUserId = me.id || "";
    if (!providerUserId) {
      throw new Error("Facebook profile missing id");
    }

    let expiresAt: string | null = null;
    if (typeof tokenJson.expires_in === "number") {
      expiresAt = new Date(
        Date.now() + tokenJson.expires_in * 1000
      ).toISOString();
    }

    return {
      provider: "facebook",
      providerUserId,
      email: me.email || null,
      emailVerified: me.email ? true : null,
      displayName: me.name || null,
      givenName: me.first_name || null,
      familyName: me.last_name || null,
      avatarUrl: me.picture?.data?.url || null,
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
