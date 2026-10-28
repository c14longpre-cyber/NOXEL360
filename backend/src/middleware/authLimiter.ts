// Limites de requêtes des routes de connexion, par adresse IP
// (req.ip = le client : app.set("trust proxy", 1) dans server.ts).
// Sans elles, /session écrivait en base à chaque appel et les flux OAuth
// pouvaient être lancés en boucle.
import type { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";

const tooMany = (req: Request, res: Response) => {
  const resetTime = (req as any).rateLimit?.resetTime as Date | undefined;
  const retryAfter = Math.max(1, Math.ceil(((resetTime?.getTime() ?? Date.now() + 60_000) - Date.now()) / 1000));
  res.setHeader("Retry-After", String(retryAfter));
  res.status(429).json({ ok: false, error: "Too many requests. Please try again later.", retryAfter });
};

const common = { standardHeaders: "draft-6" as const, legacyHeaders: false, handler: tooMany };

/** Début et retour OAuth : 30 par 15 minutes. */
export const oauthLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 30, ...common });

/** Rattachement d'un compte existant : 10 par 15 minutes. */
export const linkLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 10, ...common });

/** Lecture de session et déconnexion : 120 par minute. */
export const sessionLimiter = rateLimit({ windowMs: 60_000, limit: 120, ...common });
