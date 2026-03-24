"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateWithOAuthIdentity = authenticateWithOAuthIdentity;
exports.resolveExistingEmailLink = resolveExistingEmailLink;
exports.listConnectedProviders = listConnectedProviders;
const authTicket_repo_1 = require("./repos/authTicket.repo");
const user_repo_1 = require("./repos/user.repo");
const userIdentity_repo_1 = require("./repos/userIdentity.repo");
const auth_session_1 = require("./auth.session");
async function authenticateWithOAuthIdentity(input) {
    const { intent, currentUserId, identity } = input;
    const existingIdentity = await (0, userIdentity_repo_1.findIdentityByProvider)(identity.provider, identity.providerUserId);
    if (intent === "link") {
        if (!currentUserId) {
            throw new Error("Cannot link provider without active user session");
        }
        const currentUser = await (0, user_repo_1.findUserById)(currentUserId);
        if (!currentUser) {
            throw new Error("Current user not found");
        }
        if (existingIdentity && existingIdentity.userId !== currentUserId) {
            throw new Error("This provider account is already linked to another user");
        }
        if (!existingIdentity) {
            await (0, userIdentity_repo_1.createIdentity)({
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
        }
        else {
            await (0, userIdentity_repo_1.updateIdentity)(identity.provider, identity.providerUserId, {
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
        await (0, userIdentity_repo_1.touchIdentityLastUsed)(identity.provider, identity.providerUserId);
        await (0, user_repo_1.touchUserLastLogin)(currentUserId);
        const session = await (0, auth_session_1.createSession)(currentUserId);
        return {
            kind: "authenticated",
            user: currentUser,
            sessionId: session.id,
            isNewUser: false,
        };
    }
    if (existingIdentity) {
        const user = await (0, user_repo_1.findUserById)(existingIdentity.userId);
        if (!user) {
            throw new Error("Linked user not found");
        }
        await (0, userIdentity_repo_1.updateIdentity)(identity.provider, identity.providerUserId, {
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
            await (0, user_repo_1.updateUser)(user.id, { displayName: identity.displayName });
        }
        await (0, userIdentity_repo_1.touchIdentityLastUsed)(identity.provider, identity.providerUserId);
        await (0, user_repo_1.touchUserLastLogin)(user.id);
        const freshUser = await (0, user_repo_1.findUserById)(user.id);
        if (!freshUser) {
            throw new Error("User disappeared after update");
        }
        const session = await (0, auth_session_1.createSession)(user.id);
        return {
            kind: "authenticated",
            user: freshUser,
            sessionId: session.id,
            isNewUser: false,
        };
    }
    const existingUserByEmail = identity.email
        ? await (0, user_repo_1.findUserByEmail)(identity.email)
        : null;
    if (existingUserByEmail) {
        const ticket = await (0, authTicket_repo_1.createLinkExistingEmailTicket)({
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
    const newUser = await (0, user_repo_1.createUser)({
        emailPrimary: identity.email,
        emailVerified: Boolean(identity.emailVerified),
        displayName: identity.displayName,
        avatarUrl: identity.avatarUrl,
    });
    await (0, userIdentity_repo_1.createIdentity)({
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
    await (0, user_repo_1.touchUserLastLogin)(newUser.id);
    const session = await (0, auth_session_1.createSession)(newUser.id);
    const freshUser = await (0, user_repo_1.findUserById)(newUser.id);
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
async function resolveExistingEmailLink(input) {
    const { findTicketById, deleteTicket } = await Promise.resolve().then(() => __importStar(require("./repos/authTicket.repo")));
    const ticket = await findTicketById(input.ticketId);
    if (!ticket) {
        throw new Error("Link ticket expired or not found");
    }
    if (ticket.existingUserId !== input.userId) {
        throw new Error("This link ticket does not belong to the current user");
    }
    const existingIdentity = await (0, userIdentity_repo_1.findIdentityByProvider)(ticket.identity.provider, ticket.identity.providerUserId);
    if (existingIdentity && existingIdentity.userId !== input.userId) {
        throw new Error("This provider account is already linked to another user");
    }
    if (!existingIdentity) {
        await (0, userIdentity_repo_1.createIdentity)({
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
    await (0, user_repo_1.touchUserLastLogin)(input.userId);
    const user = await (0, user_repo_1.findUserById)(input.userId);
    if (!user) {
        throw new Error("User not found");
    }
    const session = await (0, auth_session_1.createSession)(user.id);
    return {
        kind: "authenticated",
        user,
        sessionId: session.id,
        isNewUser: false,
    };
}
async function listConnectedProviders(userId) {
    return (0, userIdentity_repo_1.findIdentitiesByUserId)(userId);
}
