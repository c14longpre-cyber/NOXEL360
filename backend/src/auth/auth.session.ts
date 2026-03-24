import type { Request } from "express";
import { SESSION_COOKIE_NAME } from "./auth.cookies";

export type SessionRecord = {
  id: string;
  userId: string;
  createdAt: string;
  lastSeenAt: string;
};

const sessions = new Map<string, SessionRecord>();

function randomId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 18)}`;
}

export async function createSession(userId: string): Promise<SessionRecord> {
  const now = new Date().toISOString();

  const record: SessionRecord = {
    id: randomId("sess"),
    userId,
    createdAt: now,
    lastSeenAt: now,
  };

  sessions.set(record.id, record);
  return record;
}

export async function findSessionById(sessionId: string): Promise<SessionRecord | null> {
  return sessions.get(sessionId) || null;
}

export async function touchSession(sessionId: string): Promise<void> {
  const current = sessions.get(sessionId);
  if (!current) return;

  sessions.set(sessionId, {
    ...current,
    lastSeenAt: new Date().toISOString(),
  });
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  return sessions.delete(sessionId);
}

export function readSessionIdFromRequest(req: Request): string | null {
  const value = req.cookies?.[SESSION_COOKIE_NAME];
  return typeof value === "string" && value ? value : null;
}
