import type { AuthIntent, NormalizedOAuthIdentity } from "./auth.types";
import { createLinkExistingEmailTicket } from "./repos/authTicket.repo";
import {
  createUser,
  findUserByEmail,
  findUserById,
  touchUserLastLogin,
  updateUser,
  type UserRecord,
} from "./repos/user.repo";
import {
  createIdentity,
  findIdentityByProvider,
  findIdentitiesByUserId,
  touchIdentityLastUsed,
  updateIdentity,
} from "./repos/userIdentity.repo";
import { createSession } from "./auth.session";

export type AuthSuccessResult = {
  kind: "authenticated";
  user: UserRecord;
  sessionId: string;
  isNewUser: boolean;
};

export type AuthLinkRequiredResult = {
  kind: "link_required";
  ticketId: string;
  existingUserId: string;
  email: string | null;
};

export type AuthResult = AuthSuccessResult | AuthLinkRequiredResult;

export async function authenticateWithOAuthIdentity(input: {
  intent: AuthIntent;
  currentUserId?: string | null;
  identity: NormalizedOAuthIdentity;
}): Promise<AuthResult> {
  const { intent, currentUserId, identity } = input;

  const existingIdentity = await findIdentityByProvider(
    identity.provider,
    identity.providerUserId
  );

  if (intent === "link") {
    if (!currentUserId) {
      throw new Error("Cannot link provider without active user session");
    }

    const currentUser = await findUserById(currentUserId);
    if (!currentUser) {
      throw new Error("Current user not found");
    }

    if (existingIdentity && existingIdentity.userId !== currentUserId) {
      throw new Error("This provider account is already linked to another user");
    }

    if (!existingIdentity) {
      await createIdentity({
        userId: currentUserId,
        provider: identity.provider,
        providerUserId: identity.providerUserId,
        providerEmail: identity.email,
        providerEmailVerified: identity.emailVerified,
        providerDisplayName: identity.displayName,
        providerAvatarUrl: identity.avatarUrl,
        accessToken: identity.accessToken || null,
        refreshToken: identity.refreshToken || null,
        expiresAt: identity.expiresAt || null,
        rawProfileJson: identity.rawProfile || null,
      });
    } else {
      await updateIdentity(identity.provider, identity.providerUserId, {
        providerEmail: identity.email,
        providerEmailVerified: identity.emailVerified,
        providerDisplayName: identity.displayName,
        providerAvatarUrl: identity.avatarUrl,
        accessToken: identity.accessToken || null,
        refreshToken: identity.refreshToken || null,
        expiresAt: identity.expiresAt || null,
        rawProfileJson: identity.rawProfile || null,
      });
    }

    await touchIdentityLastUsed(identity.provider, identity.providerUserId);
    await touchUserLastLogin(currentUserId);

    const session = await createSession(currentUserId);

    return {
      kind: "authenticated",
      user: currentUser,
      sessionId: session.id,
      isNewUser: false,
    };
  }

  if (existingIdentity) {
    const user = await findUserById(existingIdentity.userId);
    if (!user) {
      throw new Error("Linked user not found");
    }

    await updateIdentity(identity.provider, identity.providerUserId, {
      providerEmail: identity.email,
      providerEmailVerified: identity.emailVerified,
      providerDisplayName: identity.displayName,
      providerAvatarUrl: identity.avatarUrl,
      accessToken: identity.accessToken || null,
      refreshToken: identity.refreshToken || null,
      expiresAt: identity.expiresAt || null,
      rawProfileJson: identity.rawProfile || null,
    });

    if (!user.displayName && identity.displayName) {
      await updateUser(user.id, { displayName: identity.displayName });
    }

    await touchIdentityLastUsed(identity.provider, identity.providerUserId);
    await touchUserLastLogin(user.id);

    const freshUser = await findUserById(user.id);
    if (!freshUser) {
      throw new Error("User disappeared after update");
    }

    const session = await createSession(user.id);

    return {
      kind: "authenticated",
      user: freshUser,
      sessionId: session.id,
      isNewUser: false,
    };
  }

  const existingUserByEmail = identity.email
    ? await findUserByEmail(identity.email)
    : null;

  if (existingUserByEmail) {
    const ticket = await createLinkExistingEmailTicket({
      provider: identity.provider,
      intent,
      existingUserId: existingUserByEmail.id,
      identity,
    });

    return {
      kind: "link_required",
      ticketId: ticket.id,
      existingUserId: existingUserByEmail.id,
      email: identity.email,
    };
  }

  const newUser = await createUser({
    emailPrimary: identity.email,
    emailVerified: Boolean(identity.emailVerified),
    displayName: identity.displayName,
    avatarUrl: identity.avatarUrl,
  });

  await createIdentity({
    userId: newUser.id,
    provider: identity.provider,
    providerUserId: identity.providerUserId,
    providerEmail: identity.email,
    providerEmailVerified: identity.emailVerified,
    providerDisplayName: identity.displayName,
    providerAvatarUrl: identity.avatarUrl,
    accessToken: identity.accessToken || null,
    refreshToken: identity.refreshToken || null,
    expiresAt: identity.expiresAt || null,
    rawProfileJson: identity.rawProfile || null,
  });

  await touchUserLastLogin(newUser.id);

  const session = await createSession(newUser.id);
  const freshUser = await findUserById(newUser.id);

  if (!freshUser) {
    throw new Error("Newly created user not found");
  }

  return {
    kind: "authenticated",
    user: freshUser,
    sessionId: session.id,
    isNewUser: true,
  };
}

export async function resolveExistingEmailLink(input: {
  ticketId: string;
  userId: string;
}): Promise<AuthSuccessResult> {
  const { findTicketById, deleteTicket } = await import("./repos/authTicket.repo");
  const ticket = await findTicketById(input.ticketId);

  if (!ticket) {
    throw new Error("Link ticket expired or not found");
  }

  if (ticket.existingUserId !== input.userId) {
    throw new Error("This link ticket does not belong to the current user");
  }

  const existingIdentity = await findIdentityByProvider(
    ticket.identity.provider,
    ticket.identity.providerUserId
  );

  if (existingIdentity && existingIdentity.userId !== input.userId) {
    throw new Error("This provider account is already linked to another user");
  }

  if (!existingIdentity) {
    await createIdentity({
      userId: input.userId,
      provider: ticket.identity.provider,
      providerUserId: ticket.identity.providerUserId,
      providerEmail: ticket.identity.email,
      providerEmailVerified: ticket.identity.emailVerified,
      providerDisplayName: ticket.identity.displayName,
      providerAvatarUrl: ticket.identity.avatarUrl,
      accessToken: ticket.identity.accessToken || null,
      refreshToken: ticket.identity.refreshToken || null,
      expiresAt: ticket.identity.expiresAt || null,
      rawProfileJson: ticket.identity.rawProfile || null,
    });
  }

  await deleteTicket(ticket.id);
  await touchUserLastLogin(input.userId);

  const user = await findUserById(input.userId);
  if (!user) {
    throw new Error("User not found");
  }

  const session = await createSession(user.id);

  return {
    kind: "authenticated",
    user,
    sessionId: session.id,
    isNewUser: false,
  };
}

export async function listConnectedProviders(userId: string) {
  return findIdentitiesByUserId(userId);
}
