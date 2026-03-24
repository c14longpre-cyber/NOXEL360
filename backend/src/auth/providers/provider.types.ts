import type { AuthIntent, AuthProvider, NormalizedOAuthIdentity } from "../auth.types";

export type StartAuthParams = {
  intent: AuthIntent;
  state: string;
  codeChallenge?: string;
  redirectUri: string;
};

export type ExchangeCodeParams = {
  code: string;
  codeVerifier?: string;
  redirectUri: string;
};

export interface OAuthProviderAdapter {
  provider: AuthProvider;
  getAuthorizationUrl(params: StartAuthParams): string;
  exchangeCode(params: ExchangeCodeParams): Promise<NormalizedOAuthIdentity>;
}
