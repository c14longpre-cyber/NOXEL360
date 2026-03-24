import type { AuthProvider } from "../auth.types";
import type { OAuthProviderAdapter } from "./provider.types";
import { googleProvider } from "./google.provider";
import { microsoftProvider } from "./microsoft.provider";

const providers: Partial<Record<AuthProvider, OAuthProviderAdapter>> = {
  google: googleProvider,
  microsoft: microsoftProvider,
};

export function getProviderAdapter(provider: AuthProvider): OAuthProviderAdapter {
  const adapter = providers[provider];
  if (!adapter) {
    throw new Error(`Provider not configured: ${provider}`);
  }
  return adapter;
}
