"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findIdentityByProvider = findIdentityByProvider;
exports.findIdentitiesByUserId = findIdentitiesByUserId;
exports.createIdentity = createIdentity;
exports.updateIdentity = updateIdentity;
exports.touchIdentityLastUsed = touchIdentityLastUsed;
exports.deleteIdentity = deleteIdentity;
exports.dumpIdentities = dumpIdentities;
const identities = new Map();
function randomId(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
}
function makeKey(provider, providerUserId) {
    return `${provider}:${providerUserId}`;
}
async function findIdentityByProvider(provider, providerUserId) {
    return identities.get(makeKey(provider, providerUserId)) || null;
}
async function findIdentitiesByUserId(userId) {
    return Array.from(identities.values()).filter((item) => item.userId === userId);
}
async function createIdentity(input) {
    const key = makeKey(input.provider, input.providerUserId);
    if (identities.has(key)) {
        throw new Error("Identity already exists");
    }
    const now = new Date().toISOString();
    const record = {
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
    identities.set(key, record);
    return record;
}
async function updateIdentity(provider, providerUserId, patch) {
    const key = makeKey(provider, providerUserId);
    const current = identities.get(key);
    if (!current)
        return null;
    const next = {
        ...current,
        ...patch,
    };
    identities.set(key, next);
    return next;
}
async function touchIdentityLastUsed(provider, providerUserId) {
    const key = makeKey(provider, providerUserId);
    const current = identities.get(key);
    if (!current)
        return;
    identities.set(key, {
        ...current,
        lastUsedAt: new Date().toISOString(),
    });
}
async function deleteIdentity(provider, providerUserId) {
    return identities.delete(makeKey(provider, providerUserId));
}
function dumpIdentities() {
    return Array.from(identities.values());
}
