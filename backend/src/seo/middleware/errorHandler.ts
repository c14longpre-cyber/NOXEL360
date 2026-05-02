import type { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const status = Number(err?.status) || 500;

  res.status(status).json({
    error: {
      code: String(err?.code || "INTERNAL_ERROR"),
      message: status >= 500 ? "Unexpected server error" : String(err?.message || "Bad request"),
      details: err?.details ?? undefined,
      requestId: String(req.headers["x-request-id"] || ""),
    },
  });
}
