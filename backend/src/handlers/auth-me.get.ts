import type { Request, Response } from "express";
import { verifySession } from "../services/session";
import { findUserById } from "../services/userStore";

export async function getAuthMe(req: Request, res: Response): Promise<void> {
  try {
    const sessionId = req.cookies?.noxel_session;

    if (!sessionId) {
      res.status(401).json({
        ok: false,
        error: "No session cookie",
      });
      return;
    }

    const payload = verifySession(sessionId);

    if (!payload) {
      res.status(401).json({
        ok: false,
        error: "Invalid or expired session",
      });
      return;
    }

    const user = findUserById(payload.userId);

    if (!user) {
      res.status(404).json({
        ok: false,
        error: "User not found",
      });
      return;
    }

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error("[getAuthMe] failed:", error);

    res.status(500).json({
      ok: false,
      error: "Unable to load current user",
    });
  }
}