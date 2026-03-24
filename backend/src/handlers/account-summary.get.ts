import type { Request, Response } from "express";
import { accountSummary } from "../data/accountSummary";

export function getAccountSummary(_req: Request, res: Response) {
  res.json({
    ok: true,
    data: accountSummary,
  });
}
