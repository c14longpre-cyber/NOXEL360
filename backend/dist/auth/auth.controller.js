"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOAuth = startOAuth;
exports.handleOAuthCallback = handleOAuthCallback;
exports.getSession = getSession;
exports.postResolveExistingEmail = postResolveExistingEmail;
exports.postLogout = postLogout;
const provider_registry_1 = require("./providers/provider.registry");
const auth_service_1 = require("./auth.service");
const auth_cookies_1 = require("./auth.cookies");
const auth_session_1 = require("./auth.session");
const user_repo_1 = require("./repos/user.repo");
const auth_frontend_url_1 = require("./auth.frontend-url");
function isAuthIntent(value) {
    return value === "signin" || value === "link";
}
function isAuthProvider(value) {
    return (value === "google" ||
        value === "microsoft" ||
        value === "facebook" ||
        value === "linkedin" ||
        value === "tiktok");
}
function buildRedirectUri(_req, provider) {
    if (provider === "google") {
        if (!process.env.GOOGLE_REDIRECT_URI) {
            throw new Error("GOOGLE_REDIRECT_URI is missing in environment");
        }
        return process.env.GOOGLE_REDIRECT_URI;
    }
    if (provider === "microsoft") {
        if (!process.env.MICROSOFT_REDIRECT_URI) {
            throw new Error("MICROSOFT_REDIRECT_URI is missing in environment");
        }
        return process.env.MICROSOFT_REDIRECT_URI;
    }
    if (provider === "facebook") {
        if (!process.env.FACEBOOK_REDIRECT_URI) {
            throw new Error("FACEBOOK_REDIRECT_URI is missing in environment");
        }
        return process.env.FACEBOOK_REDIRECT_URI;
    }
    if (provider === "linkedin") {
        if (!process.env.LINKEDIN_REDIRECT_URI) {
            throw new Error("LINKEDIN_REDIRECT_URI is missing in environment");
        }
        return process.env.LINKEDIN_REDIRECT_URI;
    }
    if (provider === "tiktok") {
        if (!process.env.TIKTOK_REDIRECT_URI) {
            throw new Error("TIKTOK_REDIRECT_URI is missing in environment");
        }
        return process.env.TIKTOK_REDIRECT_URI;
    }
    throw new Error(`No redirect URI configured for provider: ${provider}`);
}
function encodeState(payload) {
    return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}
function decodeState(state) {
    const json = Buffer.from(state, "base64url").toString("utf8");
    return JSON.parse(json);
}
async function getCurrentUser(req) {
    const sessionId = (0, auth_session_1.readSessionIdFromRequest)(req);
    if (!sessionId)
        return null;
    const session = await (0, auth_session_1.findSessionById)(sessionId);
    if (!session)
        return null;
    await (0, auth_session_1.touchSession)(session.id);
    const user = await (0, user_repo_1.findUserById)(session.userId);
    if (!user)
        return null;
    return { user, session };
}
async function startOAuth(req, res) {
    try {
        const providerRaw = String(req.params.provider || "");
        const intentRaw = String(req.query.intent || "signin");
        if (!isAuthProvider(providerRaw)) {
            return res.status(400).json({ ok: false, error: "Unsupported provider" });
        }
        if (!isAuthIntent(intentRaw)) {
            return res.status(400).json({ ok: false, error: "Invalid auth intent" });
        }
        const provider = providerRaw;
        const intent = intentRaw;
        const current = await getCurrentUser(req);
        if (intent === "link" && !current?.user) {
            return res
                .status(401)
                .json({ ok: false, error: "You must be signed in to link an account" });
        }
        const adapter = (0, provider_registry_1.getProviderAdapter)(provider);
        const redirectUri = buildRedirectUri(req, provider);
        const statePayload = {
            provider,
            intent,
            ts: String(Date.now()),
        };
        if (current?.user?.id) {
            statePayload.userId = current.user.id;
        }
        const state = encodeState(statePayload);
        const authorizationUrl = adapter.getAuthorizationUrl({
            intent,
            state,
            redirectUri,
        });
        return res.redirect(authorizationUrl);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Failed to start OAuth";
        return res.status(500).json({ ok: false, error: message });
    }
}
async function handleOAuthCallback(req, res) {
    try {
        const providerRaw = String(req.params.provider || "");
        const code = String(req.query.code || "");
        const state = String(req.query.state || "");
        if (!isAuthProvider(providerRaw)) {
            return res.status(400).json({ ok: false, error: "Unsupported provider" });
        }
        if (!code) {
            return res.status(400).json({ ok: false, error: "Missing code" });
        }
        if (!state) {
            return res.status(400).json({ ok: false, error: "Missing state" });
        }
        const statePayload = decodeState(state);
        const provider = providerRaw;
        const rawIntent = String(statePayload.intent || "");
        const intent = isAuthIntent(rawIntent) ? rawIntent : "signin";
        const adapter = (0, provider_registry_1.getProviderAdapter)(provider);
        const redirectUri = buildRedirectUri(req, provider);
        const identity = await adapter.exchangeCode({
            code,
            redirectUri,
        });
        const result = await (0, auth_service_1.authenticateWithOAuthIdentity)({
            intent,
            currentUserId: statePayload.userId || null,
            identity,
        });
        if (result.kind === "link_required") {
            const frontendBase = (0, auth_frontend_url_1.getFrontendUrl)();
            const linkUrl = new URL("/auth/link-account", frontendBase);
            linkUrl.searchParams.set("ticketId", result.ticketId);
            if (result.email) {
                linkUrl.searchParams.set("email", result.email);
            }
            return res.redirect(linkUrl.toString());
        }
        (0, auth_cookies_1.setSessionCookie)(res, result.sessionId);
        const frontendUrl = (0, auth_frontend_url_1.getFrontendUrl)();
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("Pragma", "no-cache");
        return res.redirect(302, `${frontendUrl}/app/account`);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "OAuth callback failed";
        return res.status(500).json({ ok: false, error: message });
    }
}
async function getSession(req, res) {
    try {
        const current = await getCurrentUser(req);
        if (!current?.user) {
            return res.status(200).json({
                ok: true,
                authenticated: false,
                user: null,
            });
        }
        const providers = await (0, auth_service_1.listConnectedProviders)(current.user.id);
        return res.status(200).json({
            ok: true,
            authenticated: true,
            user: current.user,
            providers,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load session";
        return res.status(500).json({ ok: false, error: message });
    }
}
async function postResolveExistingEmail(req, res) {
    try {
        const ticketId = String(req.body?.ticketId || "");
        if (!ticketId) {
            return res.status(400).json({ ok: false, error: "Missing ticketId" });
        }
        const current = await getCurrentUser(req);
        if (!current?.user) {
            return res
                .status(401)
                .json({ ok: false, error: "You must be signed in first" });
        }
        const result = await (0, auth_service_1.resolveExistingEmailLink)({
            ticketId,
            userId: current.user.id,
        });
        (0, auth_cookies_1.setSessionCookie)(res, result.sessionId);
        return res.status(200).json({
            ok: true,
            kind: "authenticated",
            user: result.user,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Failed to resolve existing email link";
        return res.status(500).json({ ok: false, error: message });
    }
}
async function postLogout(req, res) {
    try {
        const sessionId = (0, auth_session_1.readSessionIdFromRequest)(req);
        if (sessionId) {
            await (0, auth_session_1.deleteSession)(sessionId);
        }
        (0, auth_cookies_1.clearSessionCookie)(res);
        return res.status(200).json({
            ok: true,
            loggedOut: true,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Failed to logout";
        return res.status(500).json({ ok: false, error: message });
    }
}
