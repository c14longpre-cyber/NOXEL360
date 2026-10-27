import { Pool } from "pg";

/**
 * Connexion Postgres (Railway fournit DATABASE_URL quand la base est reliée
 * au service). Sans DATABASE_URL, `db` vaut null et les repos d'auth
 * retombent sur un stockage en mémoire : pratique en local, mais tout est
 * perdu au redémarrage — à ne jamais utiliser en production.
 */
const connectionString = process.env.DATABASE_URL;

// PGSSL=true pour une connexion via le proxy public de Railway (TLS) ;
// le réseau privé (*.railway.internal) n'utilise pas TLS.
const ssl = process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined;

export const db: Pool | null = connectionString
  ? new Pool({ connectionString, ssl, max: 10 })
  : null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id               TEXT PRIMARY KEY,
  email_primary    TEXT,
  email_normalized TEXT,
  email_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  display_name     TEXT,
  avatar_url       TEXT,
  created_at       TIMESTAMPTZ NOT NULL,
  updated_at       TIMESTAMPTZ NOT NULL,
  last_login_at    TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS users_email_normalized_idx ON users (email_normalized);

CREATE TABLE IF NOT EXISTS user_identities (
  id                      TEXT PRIMARY KEY,
  user_id                 TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  provider                TEXT NOT NULL,
  provider_user_id        TEXT NOT NULL,
  provider_email          TEXT,
  provider_email_verified BOOLEAN,
  provider_display_name   TEXT,
  provider_avatar_url     TEXT,
  access_token            TEXT,
  refresh_token           TEXT,
  expires_at              TEXT,
  raw_profile_json        JSONB,
  linked_at               TIMESTAMPTZ NOT NULL,
  last_used_at            TIMESTAMPTZ,
  UNIQUE (provider, provider_user_id)
);
CREATE INDEX IF NOT EXISTS user_identities_user_id_idx ON user_identities (user_id);

CREATE TABLE IF NOT EXISTS sessions (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS auth_tickets (
  id               TEXT PRIMARY KEY,
  type             TEXT NOT NULL,
  provider         TEXT NOT NULL,
  intent           TEXT NOT NULL,
  existing_user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  identity         JSONB NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL,
  expires_at       TIMESTAMPTZ NOT NULL
);
`;

/** Crée les tables si besoin. À appeler une fois avant d'accepter des requêtes. */
export async function ensureSchema(): Promise<void> {
  if (!db) {
    console.warn("[db] DATABASE_URL absent : comptes et sessions stockés en mémoire (perdus au redémarrage).");
    return;
  }
  await db.query(SCHEMA);
  // Jetons OAuth et profils bruts : plus jamais conservés, on vide ceux d'avant.
  const tokens = await db.query(
    `UPDATE user_identities
        SET access_token = NULL, refresh_token = NULL, expires_at = NULL, raw_profile_json = NULL
      WHERE access_token IS NOT NULL OR refresh_token IS NOT NULL
         OR (raw_profile_json IS NOT NULL AND raw_profile_json <> 'null'::jsonb)`
  );
  if (tokens.rowCount) console.log(`[db] Jetons OAuth effacés : ${tokens.rowCount} identité(s).`);
  // Sessions de plus de 7 jours (durée du cookie) : supprimées.
  const sessions = await db.query("DELETE FROM sessions WHERE created_at < now() - interval '7 days'");
  if (sessions.rowCount) console.log(`[db] Sessions expirées supprimées : ${sessions.rowCount}.`);
  await db.query("DELETE FROM auth_tickets WHERE expires_at < now()");
  console.log("[db] Postgres prêt.");
}

/** Convertit un timestamp Postgres (Date) en chaîne ISO, comme les repos en mémoire. */
export function toIso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}
