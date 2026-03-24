"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserById = findUserById;
exports.findUserByEmail = findUserByEmail;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.touchUserLastLogin = touchUserLastLogin;
exports.dumpUsers = dumpUsers;
const users = new Map();
function randomId(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
}
function normalizeEmail(email) {
    const value = String(email || "").trim().toLowerCase();
    return value || null;
}
async function findUserById(userId) {
    return users.get(userId) || null;
}
async function findUserByEmail(email) {
    const normalized = normalizeEmail(email);
    if (!normalized)
        return null;
    for (const user of users.values()) {
        if (user.emailNormalized === normalized) {
            return user;
        }
    }
    return null;
}
async function createUser(input) {
    const now = new Date().toISOString();
    const user = {
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
    users.set(user.id, user);
    return user;
}
async function updateUser(userId, patch) {
    const current = users.get(userId);
    if (!current)
        return null;
    const next = {
        ...current,
        ...patch,
        emailNormalized: patch.emailPrimary !== undefined
            ? normalizeEmail(patch.emailPrimary)
            : current.emailNormalized,
        updatedAt: new Date().toISOString(),
    };
    users.set(userId, next);
    return next;
}
async function touchUserLastLogin(userId) {
    const current = users.get(userId);
    if (!current)
        return;
    users.set(userId, {
        ...current,
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
}
function dumpUsers() {
    return Array.from(users.values());
}
