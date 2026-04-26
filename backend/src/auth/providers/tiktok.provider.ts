import type { NormalizedOAuthIdentity } from "../auth.types";
import type {
  ExchangeCodeParams,
  OAuthProviderAdapter,
  StartAuthParams,
} from "./provider.types";

const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || "";
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || "";

type TikTokTokenResponse = {
  access_token: string;
  expires_in: number;
  open_id?: string;
  refresh_expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
};

type TikTokUserResponse = {
  data?: {
    user?: {
      open_id?: string;
      union_id?: string;
      avatar_url?: string;
      display_name?: string;
    };
  };
  error?: {
    code?: string;
    message?: string;
    log_id?: string;
  };
};

async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, init);
  const text = await response.text();

  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`TikTok returned non-JSON response (${response.status})`);
  }

  if (!response.ok) {
    throw new Error(
      `TikTok API error (${response.status}): ${JSON.stringify(data)}`
    );
  }

  return data as T;
}

export const tiktokProvider: OAuthProviderAdapter = {
  provider: "tiktok",

  getAuthorizationUrl(params: StartAuthParams): string {
    if (!TIKTOK_CLIENT_KEY) {
      throw new Error("TIKTOK_CLIENT_KEY is missing in environment");
    }

    const url = new URL("https://www.tiktok.com/v2/auth/authorize/");

    url.searchParams.set("client_key", TIKTOK_CLIENT_KEY);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "user.info.basic");
    url.searchParams.set("redirect_uri", params.redirectUri);
    url.searchParams.set("state", params.state);

    return url.toString();
  },

  async exchangeCode(
    params: ExchangeCodeParams
  ): Promise<NormalizedOAuthIdentity> {
    if (!TIKTOK_CLIENT_KEY) {
      throw new Error("TIKTOK_CLIENT_KEY is missing in environment");
    }

    if (!TIKTOK_CLIENT_SECRET) {
      throw new Error("TIKTOK_CLIENT_SECRET is missing in environment");
    }

    const tokenBody = new URLSearchParams({
      client_key: TIKTOK_CLIENT_KEY,
      client_secret: TIKTOK_CLIENT_SECRET,
      code: params.code,
      grant_type: "authorization_code",
      redirect_uri: params.redirectUri,
    });

    const token = await fetchJson<TikTokTokenResponse>(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: tokenBody.toString(),
      }
    );

    const userInfo = await fetchJson<TikTokUserResponse>(
      "https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );

    const user = userInfo?.data?.user;
    const providerUserId = user?.open_id || token.open_id || "";

    if (!providerUserId) {
      throw new Error("TikTok did not return an open_id");
    }

    let expiresAt: string | null = null;
    if (typeof token.expires_in === "number") {
      expiresAt = new Date(
        Date.now() + token.expires_in * 1000
      ).toISOString();
    }

    return {
      provider: "tiktok",
      providerUserId,
      email: null,
      emailVerified: false,
      displayName: user?.display_name || null,
      givenName: null,
      familyName: null,
      avatarUrl: user?.avatar_url || null,
      accessToken: token.access_token || null,
      refreshToken: token.refresh_token || null,
      expiresAt,
      rawProfile: {
        token,
        userInfo,
      },
    };
  },
};