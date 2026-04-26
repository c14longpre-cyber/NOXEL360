import type { AuthProvider } from "../auth.types";
import type { OAuthProviderAdapter } from "./provider.types";

import { googleProvider } from "./google.provider";
import { microsoftProvider } from "./microsoft.provider";
import { facebookProvider } from "./facebook.provider";
import { linkedinProvider } from "./linkedin.provider";
import { tiktokProvider } from "./tiktok.provider";

export const providerRegistry: Partial<
  Record<AuthProvider, OAuthProviderAdapter>
> = {
  google: googleProvider,
  microsoft: microsoftProvider,
  facebook: facebookProvider,
  linkedin: linkedinProvider,
  tiktok: tiktokProvider,
};

export function getProviderAdapter(
  provider: AuthProvider
): OAuthProviderAdapter {
  const adapter = providerRegistry[provider];

  if (!adapter) {
    throw new Error(`Provider not configured: ${provider}`);
  }

  return adapter;
}

export function getProvider(name: string): OAuthProviderAdapter | null {
  if (!name) return null;
  return providerRegistry[name as AuthProvider] ?? null;
}

export function listEnabledProviders(): AuthProvider[] {
  return Object.keys(providerRegistry) as AuthProvider[];
}