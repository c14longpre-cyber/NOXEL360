import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { createSession } from "../services/session";
import { createUser, findUserByProvider } from "../services/userStore";

type GoogleAuthBody = {
  token?: string;
};

export async function authGoogle(
  req: Request<unknown, unknown, GoogleAuthBody>,
  res: Response
): Promise<void> {
  try {
    const { token } = req.body;
    const googleClientId = process.env.GOOGLE_CLIENT_ID || "";

    if (!googleClientId) {
      res.status(500).json({
        ok: false,
        error: "Backend GOOGLE_CLIENT_ID is missing",
      });
      return;
    }

    if (!token) {
      res.status(400).json({
        ok: false,
        error: "Missing Google token",
      });
      return;
    }

    console.log("[authGoogle] expected GOOGLE_CLIENT_ID:", googleClientId);

    const client = new OAuth2Client(googleClientId);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();

    console.log("[authGoogle] token aud:", payload?.aud);

    if (!payload) {
      res.status(401).json({
        ok: false,
        error: "Invalid Google token payload",
      });
      return;
    }

    const email = payload.email ?? "";
    const name = payload.name ?? "";
    const googleId = payload.sub ?? "";

    console.log("[authGoogle] payload:", { email, name, googleId });

    if (!email || !name || !googleId) {
      res.status(401).json({
        ok: false,
        error: "Incomplete Google identity payload",
      });
      return;
    }

    let user = findUserByProvider(googleId);

    if (!user) {
      user = createUser(email, name, googleId);
    }

    const session = createSession(user.id);

    console.log("[authGoogle] success:", {
      userId: user.id,
      email: user.email,
    });

    res.cookie("noxel_session", session, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error("[authGoogle] failed:", error);

    res.status(500).json({
      ok: false,
      error: "Google authentication failed",
    });
  }
}
