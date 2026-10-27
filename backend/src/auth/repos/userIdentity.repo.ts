import { randomBytes } from "crypto";
import type { AuthProvider } from "../auth.types";
import { db, toIso } from "../../db/pool";

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

// Repli en mémoire quand DATABASE_URL est absent (développement local).
const identities = new Map<string, UserIdentityRecord>();

function randomId(prefix: string): string {
  return `${prefix}_${randomBytes(16).toString("base64url")}`;
}

function makeKey(provider: AuthProvider, providerUserId: string): string {
  return `${provider}:${providerUserId}`;
}

function fromRow(row: any): UserIdentityRecord {
  return {
    id: row.id,
    userId: row.user_id,
    provider: row.provider,
    providerUserId: row.provider_user_id,
    providerEmail: row.provider_email,
    providerEmailVerified: row.provider_email_verified,
    providerDisplayName: row.provider_display_name,
    providerAvatarUrl: row.provider_avatar_url,
    accessToken: row.access_token,
    refreshToken: row.refresh_token,
    expiresAt: row.expires_at,
    rawProfileJson: row.raw_profile_json,
    linkedAt: toIso(row.linked_at) as string,
    lastUsedAt: toIso(row.last_used_at),
  };
}

async function upsert(input: UserIdentityRecord): Promise<void> {
  // Les jetons OAuth et le profil brut ne servent qu'à la connexion : on ne les
  // garde jamais (Loi 25 : ne conserver que le nécessaire ; une fuite de la base
  // ne doit pas donner accès aux comptes Google, GitHub… des membres).
  const record: UserIdentityRecord = {
    ...input,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    rawProfileJson: null,
  };
  if (!db) {
    identities.set(makeKey(record.provider, record.providerUserId), record);
    return;
  }
  await db.query(
    `INSERT INTO user_identities (id, user_id, provider, provider_user_id, provider_email,
       provider_email_verified, provider_display_name, provider_avatar_url, access_token,
       refresh_token, expires_at, raw_profile_json, linked_at, last_used_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     ON CONFLICT (id) DO UPDATE SET
       user_id = EXCLUDED.user_id,
       provider_email = EXCLUDED.provider_email,
       provider_email_verified = EXCLUDED.provider_email_verified,
       provider_display_name = EXCLUDED.provider_display_name,
       provider_avatar_url = EXCLUDED.provider_avatar_url,
       access_token = EXCLUDED.access_token,
       refresh_token = EXCLUDED.refresh_token,
       expires_at = EXCLUDED.expires_at,
       raw_profile_json = EXCLUDED.raw_profile_json,
       last_used_at = EXCLUDED.last_used_at`,
    [
      record.id,
      record.userId,
      record.provider,
      record.providerUserId,
      record.providerEmail,
      record.providerEmailVerified,
      record.providerDisplayName,
      record.providerAvatarUrl,
      record.accessToken,
      record.refreshToken,
      record.expiresAt,
      JSON.stringify(record.rawProfileJson ?? null),
      record.linkedAt,
      record.lastUsedAt,
    ]
  );
}

export async function findIdentityByProvider(
  provider: AuthProvider,
  providerUserId: string
): Promise<UserIdentityRecord | null> {
  if (!db) return identities.get(makeKey(provider, providerUserId)) || null;

  const { rows } = await db.query(
    "SELECT * FROM user_identities WHERE provider = $1 AND provider_user_id = $2",
    [provider, providerUserId]
  );
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function findIdentitiesByUserId(userId: string): Promise<UserIdentityRecord[]> {
  if (!db) return Array.from(identities.values()).filter((item) => item.userId === userId);

  const { rows } = await db.query(
    "SELECT * FROM user_identities WHERE user_id = $1 ORDER BY linked_at",
    [userId]
  );
  return rows.map(fromRow);
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
  if (await findIdentityByProvider(input.provider, input.providerUserId)) {
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

  // En base, la contrainte UNIQUE (provider, provider_user_id) bloque aussi
  // deux créations simultanées pour la même identité.
  await upsert(record);
  return record;
}

export async function updateIdentity(
  provider: AuthProvider,
  providerUserId: string,
  patch: Partial<UserIdentityRecord>
): Promise<UserIdentityRecord | null> {
  const current = await findIdentityByProvider(provider, providerUserId);
  if (!current) return null;

  const next: UserIdentityRecord = {
    ...current,
    ...patch,
    id: current.id,
    provider: current.provider,
    providerUserId: current.providerUserId,
  };

  await upsert(next);
  return next;
}

export async function touchIdentityLastUsed(
  provider: AuthProvider,
  providerUserId: string
): Promise<void> {
  const now = new Date().toISOString();

  if (!db) {
    const key = makeKey(provider, providerUserId);
    const current = identities.get(key);
    if (!current) return;
    identities.set(key, { ...current, lastUsedAt: now });
    return;
  }

  await db.query(
    "UPDATE user_identities SET last_used_at = $3 WHERE provider = $1 AND provider_user_id = $2",
    [provider, providerUserId, now]
  );
}

export async function deleteIdentity(
  provider: AuthProvider,
  providerUserId: string
): Promise<boolean> {
  if (!db) return identities.delete(makeKey(provider, providerUserId));

  const result = await db.query(
    "DELETE FROM user_identities WHERE provider = $1 AND provider_user_id = $2",
    [provider, providerUserId]
  );
  return (result.rowCount ?? 0) > 0;
}
