import type { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from "express";

/** Erreur avec un code HTTP, convertie en `{ ok: false, error }` par `errorHandler`. */
export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

/**
 * Express 4 ne rattrape pas les promesses rejetées : sans ce wrapper, une
 * exception dans un handler async fait tomber tout le processus Node.
 */
export function asyncRoute(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const status = err instanceof HttpError ? err.status : 500;
  if (status >= 500) console.error(`[error] ${req.method} ${req.originalUrl}`, err);

  res.status(status).json({
    ok: false,
    error: status >= 500 ? "Internal server error" : err.message,
  });
};
