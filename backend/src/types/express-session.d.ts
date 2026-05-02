import "express-session";

declare module "express-session" {
  interface SessionData {
    facebookOAuthState?: string;
    user?: {
      provider: string;
      providerUserId: string;
      emailPrimary: string | null;
      emailVerified: boolean;
      displayName: string;
      avatarUrl: string | null;
    };
  }
}
