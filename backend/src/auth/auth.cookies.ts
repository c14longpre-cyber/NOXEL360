import type { Response } from "express";

export const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME || "noxel_session";

const isProd =
  process.env.NODE_ENV === "production" ||
  process.env.RAILWAY_ENVIRONMENT === "production";

const COOKIE_DOMAIN = isProd ? ".noxel360.com" : undefined;
const COOKIE_SECURE = isProd;
const COOKIE_SAMESITE = "none";

export function setSessionCookie(res: Response, sessionId: string) {
  res.cookie(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAMESITE,
    domain: COOKIE_DOMAIN,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Nonce OAuth : posé au démarrage du flux, comparé au `state` au retour du
 * provider, puis effacé. Mêmes attributs que le cookie de session pour être
 * envoyé sur le callback dans toutes les configurations où la session l'est.
 */
export const OAUTH_STATE_COOKIE_NAME = "noxel_oauth_state";
export const OAUTH_STATE_MAX_AGE_MS = 1000 * 60 * 10; // 10 minutes

export function setOAuthStateCookie(res: Response, nonce: string) {
  res.cookie(OAUTH_STATE_COOKIE_NAME, nonce, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAMESITE,
    domain: COOKIE_DOMAIN,
    path: "/",
    maxAge: OAUTH_STATE_MAX_AGE_MS,
  });
}

export function clearOAuthStateCookie(res: Response) {
  res.clearCookie(OAUTH_STATE_COOKIE_NAME, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAMESITE,
    domain: COOKIE_DOMAIN,
    path: "/",
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAMESITE,
    domain: COOKIE_DOMAIN,
    path: "/",
  });
}