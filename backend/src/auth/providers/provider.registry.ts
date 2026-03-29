import type { AuthProvider, OAuthProviderAdapter } from "../auth.types";

import { googleProvider } from "./google.provider";
import { microsoftProvider } from "./microsoft.provider";
import { facebookProvider } from "./facebook.provider";
import { linkedinProvider } from "./linkedin.provider";
import { tiktokProvider } from "./tiktok.provider";

export const providerRegistry: Record<AuthProvider, OAuthProviderAdapter> = {
  google: googleProvider,
  microsoft: microsoftProvider,
  facebook: facebookProvider,
  linkedin: linkedinProvider,
  tiktok: tiktokProvider,
};

export function getProviderAdapter(name: AuthProvider): OAuthProviderAdapter {
  const provider = providerRegistry[name];

  if (!provider) {
    throw new Error(`Unsupported provider adapter: ${name}`);
  }

  return provider;
}

export function getProvider(name: string): OAuthProviderAdapter | null {
  if (!name) return null;
  return providerRegistry[name as AuthProvider] ?? null;
}

export function listEnabledProviders(): AuthProvider[] {
  return Object.keys(providerRegistry) as AuthProvider[];
}