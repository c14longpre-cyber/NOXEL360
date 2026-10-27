import { randomBytes } from "crypto";
import type { Request } from "express";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from "./auth.cookies";
import { db, toIso } from "../db/pool";

export type SessionRecord = {
  id: string;
  userId: string;
  createdAt: string;
  lastSeenAt: string;
};

// Repli en mémoire quand DATABASE_URL est absent (développement local).
const sessions = new Map<string, SessionRecord>();

function randomId(prefix: string): string {
  return `${prefix}_${randomBytes(32).toString("base64url")}`;
}

function fromRow(row: any): SessionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    createdAt: toIso(row.created_at) as string,
    lastSeenAt: toIso(row.last_seen_at) as string,
  };
}

export async function createSession(userId: string): Promise<SessionRecord> {
  const now = new Date().toISOString();

  const record: SessionRecord = {
    id: randomId("sess"),
    userId,
    createdAt: now,
    lastSeenAt: now,
  };

  if (!db) {
    sessions.set(record.id, record);
    return record;
  }

  await db.query(
    "INSERT INTO sessions (id, user_id, created_at, last_seen_at) VALUES ($1, $2, $3, $4)",
    [record.id, record.userId, record.createdAt, record.lastSeenAt]
  );
  return record;
}

/** Une session expire 7 jours après sa création, comme son cookie. */
export function isSessionExpired(session: SessionRecord, now = Date.now()): boolean {
  const created = Date.parse(session.createdAt);
  return !Number.isFinite(created) || now - created > SESSION_MAX_AGE_MS;
}

export async function findSessionById(sessionId: string): Promise<SessionRecord | null> {
  let session: SessionRecord | null;
  if (!db) {
    session = sessions.get(sessionId) || null;
  } else {
    const { rows } = await db.query("SELECT * FROM sessions WHERE id = $1", [sessionId]);
    session = rows[0] ? fromRow(rows[0]) : null;
  }
  if (session && isSessionExpired(session)) {
    // Un cookie volé ou conservé au-delà de sa durée ne rouvre plus rien.
    await deleteSession(session.id);
    return null;
  }
  return session;
}

const TOUCH_INTERVAL_MS = 5 * 60 * 1000;

export async function touchSession(sessionId: string, lastSeenAt?: string): Promise<void> {
  // Une écriture au plus toutes les 5 minutes par session, pas à chaque appel.
  if (lastSeenAt && Date.now() - Date.parse(lastSeenAt) < TOUCH_INTERVAL_MS) return;
  const now = new Date().toISOString();

  if (!db) {
    const current = sessions.get(sessionId);
    if (!current) return;
    sessions.set(sessionId, { ...current, lastSeenAt: now });
    return;
  }

  await db.query("UPDATE sessions SET last_seen_at = $2 WHERE id = $1", [sessionId, now]);
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  if (!db) return sessions.delete(sessionId);

  const result = await db.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
  return (result.rowCount ?? 0) > 0;
}

export function readSessionIdFromRequest(req: Request): string | null {
  const value = req.cookies?.[SESSION_COOKIE_NAME];
  return typeof value === "string" && value ? value : null;
}
