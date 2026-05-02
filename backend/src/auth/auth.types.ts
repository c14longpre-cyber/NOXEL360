export type AuthIntent = "signin" | "link";

export type AuthProvider =
  | "google"
  | "microsoft"
  | "facebook"
  | "linkedin"
  | "tiktok"
  | "apple";

export type NormalizedOAuthIdentity = {
  provider: AuthProvider;
  providerUserId: string;
  email: string | null;
  emailVerified: boolean | null;
  displayName: string | null;
  givenName: string | null;
  familyName: string | null;
  avatarUrl: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  rawProfile?: unknown;
};