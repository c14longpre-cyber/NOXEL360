import { randomBytes } from "crypto";
import { db, toIso } from "../../db/pool";

export type UserRecord = {
  id: string;
  emailPrimary: string | null;
  emailNormalized: string | null;
  emailVerified: boolean;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

// Repli en mémoire quand DATABASE_URL est absent (développement local).
const users = new Map<string, UserRecord>();

function randomId(prefix: string): string {
  return `${prefix}_${randomBytes(16).toString("base64url")}`;
}

function normalizeEmail(email: string | null | undefined): string | null {
  const value = String(email || "").trim().toLowerCase();
  return value || null;
}

function fromRow(row: any): UserRecord {
  return {
    id: row.id,
    emailPrimary: row.email_primary,
    emailNormalized: row.email_normalized,
    emailVerified: row.email_verified,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    createdAt: toIso(row.created_at) as string,
    updatedAt: toIso(row.updated_at) as string,
    lastLoginAt: toIso(row.last_login_at),
  };
}

async function save(user: UserRecord): Promise<void> {
  if (!db) {
    users.set(user.id, user);
    return;
  }
  await db.query(
    `INSERT INTO users (id, email_primary, email_normalized, email_verified, display_name,
                        avatar_url, created_at, updated_at, last_login_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (id) DO UPDATE SET
       email_primary = EXCLUDED.email_primary,
       email_normalized = EXCLUDED.email_normalized,
       email_verified = EXCLUDED.email_verified,
       display_name = EXCLUDED.display_name,
       avatar_url = EXCLUDED.avatar_url,
       updated_at = EXCLUDED.updated_at,
       last_login_at = EXCLUDED.last_login_at`,
    [
      user.id,
      user.emailPrimary,
      user.emailNormalized,
      user.emailVerified,
      user.displayName,
      user.avatarUrl,
      user.createdAt,
      user.updatedAt,
      user.lastLoginAt,
    ]
  );
}

export async function findUserById(userId: string): Promise<UserRecord | null> {
  if (!db) return users.get(userId) || null;

  const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function findUserByEmail(email: string | null | undefined): Promise<UserRecord | null> {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  if (!db) {
    for (const user of users.values()) {
      if (user.emailNormalized === normalized) {
        return user;
      }
    }
    return null;
  }

  const { rows } = await db.query(
    "SELECT * FROM users WHERE email_normalized = $1 ORDER BY created_at LIMIT 1",
    [normalized]
  );
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function createUser(input: {
  emailPrimary?: string | null;
  emailVerified?: boolean;
  displayName?: string | null;
  avatarUrl?: string | null;
}): Promise<UserRecord> {
  const now = new Date().toISOString();

  const user: UserRecord = {
    id: randomId("usr"),
    emailPrimary: input.emailPrimary || null,
    emailNormalized: normalizeEmail(input.emailPrimary),
    emailVerified: Boolean(input.emailVerified),
    displayName: input.displayName || null,
    avatarUrl: input.avatarUrl || null,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: null,
  };

  await save(user);
  return user;
}

export async function updateUser(userId: string, patch: Partial<UserRecord>): Promise<UserRecord | null> {
  const current = await findUserById(userId);
  if (!current) return null;

  const next: UserRecord = {
    ...current,
    ...patch,
    id: current.id,
    createdAt: current.createdAt,
    emailNormalized:
      patch.emailPrimary !== undefined
        ? normalizeEmail(patch.emailPrimary)
        : current.emailNormalized,
    updatedAt: new Date().toISOString(),
  };

  await save(next);
  return next;
}

export async function touchUserLastLogin(userId: string): Promise<void> {
  const now = new Date().toISOString();

  if (!db) {
    const current = users.get(userId);
    if (!current) return;
    users.set(userId, { ...current, lastLoginAt: now, updatedAt: now });
    return;
  }

  await db.query("UPDATE users SET last_login_at = $2, updated_at = $2 WHERE id = $1", [userId, now]);
}
