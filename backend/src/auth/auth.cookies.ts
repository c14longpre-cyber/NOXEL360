import type { Response } from "express";

const isProd =
  process.env.NODE_ENV === "production" ||
  process.env.RAILWAY_ENVIRONMENT === "production";

export function setSessionCookie(res: Response, sessionId: string) {
  res.cookie("noxel_session", sessionId, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie("noxel_session", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
}