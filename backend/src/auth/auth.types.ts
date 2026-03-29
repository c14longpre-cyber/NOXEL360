export type AuthProvider =
  | "google"
  | "microsoft"
  | "facebook"
  | "linkedin"
  | "tiktok";

export type AuthProviderName = AuthProvider;

export type AuthIntent = "signin" | "link";

export type OAuthIdentity = {
  provider: AuthProvider;
  providerUserId: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  avatarUrl: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  raw?: unknown;
};

export type OAuthProviderAdapter = {
  getAuthorizationUrl(args: {
    intent: AuthIntent;
    state: string;
    redirectUri: string;
  }): string;
  exchangeCode(args: {
    code: string;
    redirectUri: string;
    codeVerifier?: string;
  }): Promise<OAuthIdentity>;
};

export type OAuthProvider = {
  name: AuthProvider;
  enabled: boolean;
} & OAuthProviderAdapter;