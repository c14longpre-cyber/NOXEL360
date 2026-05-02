import type { AuthIntent, AuthProvider, NormalizedOAuthIdentity } from "../auth.types";

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

const tickets = new Map<string, AuthTicketRecord>();

function randomId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
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
    identity: input.identity,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + ttlMinutes * 60 * 1000).toISOString(),
  };

  tickets.set(record.id, record);
  return record;
}

export async function findTicketById(ticketId: string): Promise<AuthTicketRecord | null> {
  const ticket = tickets.get(ticketId) || null;
  if (!ticket) return null;

  if (Date.now() > Date.parse(ticket.expiresAt)) {
    tickets.delete(ticketId);
    return null;
  }

  return ticket;
}

export async function deleteTicket(ticketId: string): Promise<boolean> {
  return tickets.delete(ticketId);
}
