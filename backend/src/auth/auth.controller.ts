import type { Request, Response } from "express";
import type { AuthIntent, AuthProvider } from "./auth.types";
import { getProviderAdapter } from "./providers/provider.registry";
import {
  authenticateWithOAuthIdentity,
  listConnectedProviders,
  resolveExistingEmailLink,
} from "./auth.service";
import { clearSessionCookie, setSessionCookie } from "./auth.cookies";
import {
  deleteSession,
  findSessionById,
  readSessionIdFromRequest,
  touchSession,
} from "./auth.session";
import { findUserById } from "./repos/user.repo";

function isAuthIntent(value: string): value is AuthIntent {
  return value === "signin" || value === "link";
}

function isAuthProvider(value: string): value is AuthProvider {
  return (
    value === "google" ||
    value === "microsoft" ||
    value === "facebook" ||
    value === "apple"
  );
}

function buildRedirectUri(req: Request, provider: AuthProvider): string {
  const origin = `${req.protocol}://${req.get("host")}`;
  return `${origin}/api/auth/${provider}/callback`;
}

function encodeState(payload: Record<string, string>): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodeState(state: string): Record<string, string> {
  const json = Buffer.from(state, "base64url").toString("utf8");
  return JSON.parse(json) as Record<string, string>;
}

async function getCurrentUser(req: Request) {
  const sessionId = readSessionIdFromRequest(req);
  if (!sessionId) return null;

  const session = await findSessionById(sessionId);
  if (!session) return null;

  await touchSession(session.id);

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

    const statePayload: Record<string, string> = {
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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start OAuth";
    return res.status(500).json({ ok: false, error: message });
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

    const statePayload = decodeState(state);
    const provider: AuthProvider = providerRaw;

    const rawIntent = String(statePayload.intent || "");
    const intent: AuthIntent = isAuthIntent(rawIntent) ? rawIntent : "signin";

    const adapter = getProviderAdapter(provider);
    const redirectUri = buildRedirectUri(req, provider);

    const identity = await adapter.exchangeCode({
      code,
      redirectUri,
    });

    const result = await authenticateWithOAuthIdentity({
      intent,
      currentUserId: statePayload.userId || null,
      identity,
    });

    if (result.kind === "link_required") {
      const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
      const linkUrl = new URL("/auth/link-account", frontendBase);

      linkUrl.searchParams.set("ticketId", result.ticketId);
      if (result.email) {
        linkUrl.searchParams.set("email", result.email);
      }

      return res.redirect(linkUrl.toString());
    }

    setSessionCookie(res, result.sessionId);

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    return res.redirect(302, `${frontendUrl}/app/account`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "OAuth callback failed";
    return res.status(500).json({ ok: false, error: message });
  }
}

export async function getSession(req: Request, res: Response) {
  try {
    console.log("Session check:", {
      cookies: req.cookies,
    });

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
    const message =
      error instanceof Error ? error.message : "Failed to load session";
    return res.status(500).json({ ok: false, error: message });
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
    const message =
      error instanceof Error
        ? error.message
        : "Failed to resolve existing email link";
    return res.status(500).json({ ok: false, error: message });
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
    const message = error instanceof Error ? error.message : "Failed to logout";
    return res.status(500).json({ ok: false, error: message });
  }
}
