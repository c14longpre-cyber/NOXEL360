import type { Request, Response } from "express";

export function getHealth(_req: Request, res: Response) {
  res.json({
    ok: true,
    status: "ok",
    service: "Noxel SEO",
    uptimeSec: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
