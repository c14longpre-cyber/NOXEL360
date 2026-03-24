"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLinkExistingEmailTicket = createLinkExistingEmailTicket;
exports.findTicketById = findTicketById;
exports.deleteTicket = deleteTicket;
const tickets = new Map();
function randomId(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
}
async function createLinkExistingEmailTicket(input) {
    const now = Date.now();
    const ttlMinutes = input.ttlMinutes ?? 15;
    const record = {
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
async function findTicketById(ticketId) {
    const ticket = tickets.get(ticketId) || null;
    if (!ticket)
        return null;
    if (Date.now() > Date.parse(ticket.expiresAt)) {
        tickets.delete(ticketId);
        return null;
    }
    return ticket;
}
async function deleteTicket(ticketId) {
    return tickets.delete(ticketId);
}
