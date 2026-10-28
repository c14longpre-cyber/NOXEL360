// Connexion NOXEL360 — lancé par `npm test` (compile d'abord), sans base : repli en mémoire.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

delete process.env.DATABASE_URL;
const require = createRequire(import.meta.url);
const { authenticateWithOAuthIdentity, listConnectedProviders } = require("../dist/auth/auth.service.js");
const { createSession, findSessionById, isSessionExpired } = require("../dist/auth/auth.session.js");
const { findIdentityByProvider } = require("../dist/auth/repos/userIdentity.repo.js");
const { findTicketById } = require("../dist/auth/repos/authTicket.repo.js");
const { SESSION_MAX_AGE_MS } = require("../dist/auth/auth.cookies.js");

let n = 0;
const identity = (provider, email, emailVerified) => ({
  provider,
  providerUserId: `${provider}-${++n}`,
  email,
  emailVerified,
  displayName: "Test",
  givenName: null,
  familyName: null,
  avatarUrl: null,
  accessToken: "secret-access",
  refreshToken: "secret-refresh",
  expiresAt: "2030-01-01T00:00:00.000Z",
  rawProfile: { id: "raw" },
});

test("OAuth tokens and raw profiles are never stored", async () => {
  const id = identity("google", "a@exemple.ca", true);
  const r = await authenticateWithOAuthIdentity({ intent: "signin", currentUserId: null, identity: id });
  assert.equal(r.kind, "authenticated");
  const stored = await findIdentityByProvider("google", id.providerUserId);
  assert.equal(stored.accessToken, null);
  assert.equal(stored.refreshToken, null);
  assert.equal(stored.rawProfileJson, null);
  const listed = await listConnectedProviders(r.user.id);
  assert.equal(listed[0].accessToken, null);
});

test("an unverified e-mail cannot squat an address: the real owner gets a new account, not a lock-out", async () => {
  const squat = await authenticateWithOAuthIdentity({ intent: "signin", currentUserId: null, identity: identity("microsoft", "owner@exemple.ca", null) });
  assert.equal(squat.kind, "authenticated");
  const owner = await authenticateWithOAuthIdentity({ intent: "signin", currentUserId: null, identity: identity("google", "owner@exemple.ca", true) });
  assert.equal(owner.kind, "authenticated", "the verified owner is not asked to sign in to the squatter's account");
  assert.notEqual(owner.user.id, squat.user.id);
});

test("a verified account with the same e-mail is never opened without its owner: link ticket without tokens", async () => {
  const first = await authenticateWithOAuthIdentity({ intent: "signin", currentUserId: null, identity: identity("google", "b@exemple.ca", true) });
  const second = await authenticateWithOAuthIdentity({ intent: "signin", currentUserId: null, identity: identity("github", "b@exemple.ca", true) });
  assert.equal(second.kind, "link_required");
  assert.equal(second.existingUserId, first.user.id);
  const ticket = await findTicketById(second.ticketId);
  assert.equal(ticket.identity.accessToken, null);
  assert.equal(ticket.identity.rawProfile, null);
});

test("sessions expire after 7 days on the server, like the cookie", async () => {
  const s = await createSession("usr_x");
  assert.ok(await findSessionById(s.id));
  assert.equal(isSessionExpired(s), false);
  const old = { ...s, createdAt: new Date(Date.now() - SESSION_MAX_AGE_MS - 1000).toISOString() };
  assert.equal(isSessionExpired(old), true);
  assert.equal(isSessionExpired({ ...s, createdAt: "not a date" }), true);
});
