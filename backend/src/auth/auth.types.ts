export type AuthProvider = "google" | "microsoft" | "facebook" | "apple";

export type AuthIntent = "signin" | "link";

export type NormalizedOAuthIdentity = {
  provider: AuthProvider;
  providerUserId: string;
  email: string | null;
  emailVerified: boolean | null;
  displayName: string | null;
  givenName: string | null;
  familyName: string | null;
  avatarUrl: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  expiresAt?: string | null;
  rawProfile?: unknown;
};

export type AuthStatePayload = {
  provider: AuthProvider;
  intent: AuthIntent;
  returnTo?: string;
  userId?: string;
  codeVerifier?: string;
};
