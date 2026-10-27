import { randomBytes } from "crypto";
import type { AuthIntent, AuthProvider, NormalizedOAuthIdentity } from "../auth.types";
import { db, toIso } from "../../db/pool";

export type AuthTicketRecord = {
  id: string;
  type: "link_existing_email";
  provider: AuthProvider;
  intent: AuthIntent;
  existingUserId: string;
  identity: NormalizedOAuthIdentity;
  createdAt: string;
  expiresAt: string;
};

// Repli en mémoire quand DATABASE_URL est absent (développement local).
const tickets = new Map<string, AuthTicketRecord>();

function randomId(prefix: string): string {
  return `${prefix}_${randomBytes(24).toString("base64url")}`;
}

function fromRow(row: any): AuthTicketRecord {
  return {
    id: row.id,
    type: row.type,
    provider: row.provider,
    intent: row.intent,
    existingUserId: row.existing_user_id,
    identity: row.identity,
    createdAt: toIso(row.created_at) as string,
    expiresAt: toIso(row.expires_at) as string,
  };
}

export async function createLinkExistingEmailTicket(input: {
  provider: AuthProvider;
  intent: AuthIntent;
  existingUserId: string;
  identity: NormalizedOAuthIdentity;
  ttlMinutes?: number;
}): Promise<AuthTicketRecord> {
  const now = Date.now();
  const ttlMinutes = input.ttlMinutes ?? 15;

  const record: AuthTicketRecord = {
    id: randomId("ticket"),
    type: "link_existing_email",
    provider: input.provider,
    intent: input.intent,
    existingUserId: input.existingUserId,
    // Le ticket ne garde que ce qu'il faut pour relier le compte : pas de jetons.
    identity: {
      ...input.identity,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      rawProfile: null,
    },
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + ttlMinutes * 60 * 1000).toISOString(),
  };

  if (!db) {
    tickets.set(record.id, record);
    return record;
  }

  // Ménage opportuniste des tickets expirés.
  await db.query("DELETE FROM auth_tickets WHERE expires_at < now()");
  await db.query(
    `INSERT INTO auth_tickets (id, type, provider, intent, existing_user_id, identity, created_at, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      record.id,
      record.type,
      record.provider,
      record.intent,
      record.existingUserId,
      JSON.stringify(record.identity),
      record.createdAt,
      record.expiresAt,
    ]
  );
  return record;
}

export async function findTicketById(ticketId: string): Promise<AuthTicketRecord | null> {
  let ticket: AuthTicketRecord | null;

  if (!db) {
    ticket = tickets.get(ticketId) || null;
  } else {
    const { rows } = await db.query("SELECT * FROM auth_tickets WHERE id = $1", [ticketId]);
    ticket = rows[0] ? fromRow(rows[0]) : null;
  }

  if (!ticket) return null;

  if (Date.now() > Date.parse(ticket.expiresAt)) {
    await deleteTicket(ticketId);
    return null;
  }

  return ticket;
}

export async function deleteTicket(ticketId: string): Promise<boolean> {
  if (!db) return tickets.delete(ticketId);

  const result = await db.query("DELETE FROM auth_tickets WHERE id = $1", [ticketId]);
  return (result.rowCount ?? 0) > 0;
}
