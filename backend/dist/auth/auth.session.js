"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = createSession;
exports.findSessionById = findSessionById;
exports.touchSession = touchSession;
exports.deleteSession = deleteSession;
exports.readSessionIdFromRequest = readSessionIdFromRequest;
const auth_cookies_1 = require("./auth.cookies");
const sessions = new Map();
function randomId(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 18)}`;
}
async function createSession(userId) {
    const now = new Date().toISOString();
    const record = {
        id: randomId("sess"),
        userId,
        createdAt: now,
        lastSeenAt: now,
    };
    sessions.set(record.id, record);
    return record;
}
async function findSessionById(sessionId) {
    return sessions.get(sessionId) || null;
}
async function touchSession(sessionId) {
    const current = sessions.get(sessionId);
    if (!current)
        return;
    sessions.set(sessionId, {
        ...current,
        lastSeenAt: new Date().toISOString(),
    });
}
async function deleteSession(sessionId) {
    return sessions.delete(sessionId);
}
function readSessionIdFromRequest(req) {
    const value = req.cookies?.[auth_cookies_1.SESSION_COOKIE_NAME];
    return typeof value === "string" && value ? value : null;
}
