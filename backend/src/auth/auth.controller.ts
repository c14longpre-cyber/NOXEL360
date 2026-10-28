import { randomBytes, timingSafeEqual } from "crypto";
import type { Request, Response } from "express";
import type { AuthIntent, AuthProvider } from "./auth.types";
import { getProviderAdapter } from "./providers/provider.registry";
import {
  authenticateWithOAuthIdentity,
  listConnectedProviders,
  resolveExistingEmailLink,
} from "./auth.service";
import {
  OAUTH_STATE_COOKIE_NAME,
  OAUTH_STATE_MAX_AGE_MS,
  clearOAuthStateCookie,
  clearSessionCookie,
  setOAuthStateCookie,
  setSessionCookie,
} from "./auth.cookies";
import {
  deleteSession,
  findSessionById,
  readSessionIdFromRequest,
  touchSession,
} from "./auth.session";
import { findUserById } from "./repos/user.repo";
import { getFrontendUrl } from "./auth.frontend-url";
import { HttpError } from "../utils/http";

/**
 * Réponse d'erreur : le message n'est montré que pour les erreurs prévues
 * (HttpError). Les autres (configuration, base, fournisseur) restent dans les
 * journaux du serveur et le navigateur reçoit un message générique.
 */
function sendError(res: Response, error: unknown, context: string) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ ok: false, error: error.message });
  }
  console.error(`[auth] ${context}:`, error);
  return res.status(500).json({ ok: false, error: `${context} failed` });
}

function isAuthIntent(value: string): value is AuthIntent {
  return value === "signin" || value === "link";
}

function isAuthProvider(value: string): value is AuthProvider {
  return (
    value === "google" ||
    value === "microsoft" ||
    value === "facebook" ||
    value === "linkedin" ||
    value === "tiktok" ||
    value === "github"
  );
}

function buildRedirectUri(_req: Request, provider: AuthProvider): string {
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

  if (provider === "github") {
    if (!process.env.GITHUB_REDIRECT_URI) {
      throw new Error("GITHUB_REDIRECT_URI is missing in environment");
    }
    return process.env.GITHUB_REDIRECT_URI;
  }

  throw new Error(`No redirect URI configured for provider: ${provider}`);
}

function encodeState(payload: Record<string, string>): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodeState(state: string): Record<string, string> | null {
  try {
    const parsed = JSON.parse(Buffer.from(state, "base64url").toString("utf8"));
    return parsed && typeof parsed === "object" ? (parsed as Record<string, string>) : null;
  } catch {
    return null;
  }
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/**
 * Le `state` n'est fiable que s'il porte le nonce posé en cookie au démarrage
 * du flux (protection CSRF), pour le même provider, et qu'il n'a pas expiré.
 */
function verifyState(
  req: Request,
  state: string,
  provider: AuthProvider
): Record<string, string> | null {
  const payload = decodeState(state);
  const cookieNonce = req.cookies?.[OAUTH_STATE_COOKIE_NAME];

  if (!payload || typeof cookieNonce !== "string" || !cookieNonce) return null;
  if (typeof payload.nonce !== "string" || !safeEqual(payload.nonce, cookieNonce)) return null;
  if (payload.provider !== provider) return null;

  const age = Date.now() - Number(payload.ts);
  if (!Number.isFinite(age) || age < 0 || age > OAUTH_STATE_MAX_AGE_MS) return null;

  return payload;
}

async function getCurrentUser(req: Request) {
  const sessionId = readSessionIdFromRequest(req);
  if (!sessionId) return null;

  const session = await findSessionById(sessionId);
  if (!session) return null;

  await touchSession(session.id, session.lastSeenAt);

  const user = await findUserById(session.userId);
  if (!user) return null;

  return { user, session };
}

export async function startOAuth(req: Request, res: Response) {
  try {
    const providerRaw = String(req.params.provider || "");
    const intentRaw = String(req.query.intent || "signin");

    if (!isAuthProvider(providerRaw)) {
      return res.status(400).json({ ok: false, error: "Unsupported provider" });
    }

    if (!isAuthIntent(intentRaw)) {
      return res.status(400).json({ ok: false, error: "Invalid auth intent" });
    }

    const provider: AuthProvider = providerRaw;
    const intent: AuthIntent = intentRaw;

    const current = await getCurrentUser(req);

    if (intent === "link" && !current?.user) {
      return res
        .status(401)
        .json({ ok: false, error: "You must be signed in to link an account" });
    }

    const adapter = getProviderAdapter(provider);
    const redirectUri = buildRedirectUri(req, provider);

    // Le state ne porte plus l'identité de l'utilisateur : au callback, elle
    // est relue depuis la session. Le nonce est vérifié contre le cookie.
    const nonce = randomBytes(32).toString("base64url");
    const state = encodeState({
      provider,
      intent,
      nonce,
      ts: String(Date.now()),
    });

    setOAuthStateCookie(res, nonce);

    const authorizationUrl = adapter.getAuthorizationUrl({
      intent,
      state,
      redirectUri,
    });

    return res.redirect(authorizationUrl);
  } catch (error) {
    return sendError(res, error, "OAuth start");
  }
}

export async function handleOAuthCallback(req: Request, res: Response) {
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

    const provider: AuthProvider = providerRaw;
    const statePayload = verifyState(req, state, provider);
    // Usage unique : le nonce est effacé, que la vérification réussisse ou non.
    clearOAuthStateCookie(res);

    if (!statePayload) {
      return res.status(400).json({ ok: false, error: "Invalid or expired OAuth state" });
    }

    const rawIntent = String(statePayload.intent || "");
    const intent: AuthIntent = isAuthIntent(rawIntent) ? rawIntent : "signin";

    const adapter = getProviderAdapter(provider);
    const redirectUri = buildRedirectUri(req, provider);

    const identity = await adapter.exchangeCode({
      code,
      redirectUri,
    });

    const current = await getCurrentUser(req);

    const result = await authenticateWithOAuthIdentity({
      intent,
      currentUserId: current?.user.id ?? null,
      identity,
    });

    if (result.kind === "link_required") {
      const frontendBase = getFrontendUrl();
      const linkUrl = new URL("/auth/link-account", frontendBase);

      linkUrl.searchParams.set("ticketId", result.ticketId);
      if (result.email) {
        linkUrl.searchParams.set("email", result.email);
      }

      return res.redirect(linkUrl.toString());
    }

    setSessionCookie(res, result.sessionId);

    const frontendUrl = getFrontendUrl();
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");

    return res.redirect(302, `${frontendUrl}/app/account`);
  } catch (error) {
    return sendError(res, error, "OAuth callback");
  }
}

export async function getSession(req: Request, res: Response) {
  try {
    const current = await getCurrentUser(req);

    if (!current?.user) {
      return res.status(200).json({
        ok: true,
        authenticated: false,
        user: null,
      });
    }

    const providers = await listConnectedProviders(current.user.id);

    return res.status(200).json({
      ok: true,
      authenticated: true,
      user: current.user,
      providers,
    });
  } catch (error) {
    return sendError(res, error, "Session");
  }
}

export async function postResolveExistingEmail(req: Request, res: Response) {
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

    const result = await resolveExistingEmailLink({
      ticketId,
      userId: current.user.id,
    });

    setSessionCookie(res, result.sessionId);

    return res.status(200).json({
      ok: true,
      kind: "authenticated",
      user: result.user,
    });
  } catch (error) {
    return sendError(res, error, "Account linking");
  }
}

export async function postLogout(req: Request, res: Response) {
  try {
    const sessionId = readSessionIdFromRequest(req);
    if (sessionId) {
      await deleteSession(sessionId);
    }

    clearSessionCookie(res);

    return res.status(200).json({
      ok: true,
      loggedOut: true,
    });
  } catch (error) {
    return sendError(res, error, "Logout");
  }
}