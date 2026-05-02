import type { Request, Response } from "express";

export async function authLogout(_req: Request, res: Response): Promise<void> {
  res.json({
    ok: true,
    message: "Logged out",
  });
}
