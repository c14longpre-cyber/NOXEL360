import type { AuthProvider } from "../auth.types";

export type UserIdentityRecord = {
  id: string;
  userId: string;
  provider: AuthProvider;
  providerUserId: string;
  providerEmail: string | null;
  providerEmailVerified: boolean | null;
  providerDisplayName: string | null;
  providerAvatarUrl: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  rawProfileJson: unknown;
  linkedAt: string;
  lastUsedAt: string | null;
};

const identities = new Map<string, UserIdentityRecord>();

function randomId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
}

function makeKey(provider: AuthProvider, providerUserId: string): string {
  return `${provider}:${providerUserId}`;
}

export async function findIdentityByProvider(
  provider: AuthProvider,
  providerUserId: string
): Promise<UserIdentityRecord | null> {
  return identities.get(makeKey(provider, providerUserId)) || null;
}

export async function findIdentitiesByUserId(userId: string): Promise<UserIdentityRecord[]> {
  return Array.from(identities.values()).filter((item) => item.userId === userId);
}

export async function createIdentity(input: {
  userId: string;
  provider: AuthProvider;
  providerUserId: string;
  providerEmail?: string | null;
  providerEmailVerified?: boolean | null;
  providerDisplayName?: string | null;
  providerAvatarUrl?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  expiresAt?: string | null;
  rawProfileJson?: unknown;
}): Promise<UserIdentityRecord> {
  const key = makeKey(input.provider, input.providerUserId);

  if (identities.has(key)) {
    throw new Error("Identity already exists");
  }

  const now = new Date().toISOString();

  const record: UserIdentityRecord = {
    id: randomId("iden"),
    userId: input.userId,
    provider: input.provider,
    providerUserId: input.providerUserId,
    providerEmail: input.providerEmail || null,
    providerEmailVerified: input.providerEmailVerified ?? null,
    providerDisplayName: input.providerDisplayName || null,
    providerAvatarUrl: input.providerAvatarUrl || null,
    accessToken: input.accessToken || null,
    refreshToken: input.refreshToken || null,
    expiresAt: input.expiresAt || null,
    rawProfileJson: input.rawProfileJson ?? null,
    linkedAt: now,
    lastUsedAt: now,
  };

  identities.set(key, record);
  return record;
}

export async function updateIdentity(
  provider: AuthProvider,
  providerUserId: string,
  patch: Partial<UserIdentityRecord>
): Promise<UserIdentityRecord | null> {
  const key = makeKey(provider, providerUserId);
  const current = identities.get(key);
  if (!current) return null;

  const next: UserIdentityRecord = {
    ...current,
    ...patch,
  };

  identities.set(key, next);
  return next;
}

export async function touchIdentityLastUsed(
  provider: AuthProvider,
  providerUserId: string
): Promise<void> {
  const key = makeKey(provider, providerUserId);
  const current = identities.get(key);
  if (!current) return;

  identities.set(key, {
    ...current,
    lastUsedAt: new Date().toISOString(),
  });
}

export async function deleteIdentity(
  provider: AuthProvider,
  providerUserId: string
): Promise<boolean> {
  return identities.delete(makeKey(provider, providerUserId));
}

export function dumpIdentities(): UserIdentityRecord[] {
  return Array.from(identities.values());
}
