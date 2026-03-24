import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import { router as apiRouter } from "./routes";
import { performanceRouter } from "./routes/performance.routes";
import { scriptsRouter } from "./routes/scripts.routes";
import accountRoutes from "./routes/account.routes";
import { authRouter } from "./auth/auth.routes";

// Social auth providers
import appleAuthRouter from "./routes/auth.apple";
import facebookAuthRouter from "./routes/auth.facebook";
import linkedinAuthRouter from "./routes/auth.linkedin";
import tiktokAuthRouter from "./routes/auth.tiktok";

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({ ok: true, app: "Noxel360 API", version: "1.0.0" });
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "noxel360-backend",
    port: PORT,
    frontend: FRONTEND_URL,
    oauth: {
      apple: true,
      facebook: true,
      linkedin: true,
      tiktok: true,
    },
  });
});

app.use("/api/account", accountRoutes);

// Social auth routes first
app.use("/api/auth", appleAuthRouter);
app.use("/api/auth", facebookAuthRouter);
app.use("/api/auth", linkedinAuthRouter);
app.use("/api/auth", tiktokAuthRouter);

// Existing auth routes after
app.use("/api/auth", authRouter);

// Existing API routes
app.use("/api", apiRouter);
app.use("/api", performanceRouter);
app.use("/api", scriptsRouter);

app.use(express.static(path.join(__dirname, "../public")));

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Not found",
    path: req.originalUrl,
  });
});

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled server error:", err);

    return res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
);

app.listen(PORT, () => {
  console.log(`Noxel360 backend running on http://localhost:${PORT}`);
  console.log(`CORS origin: ${FRONTEND_URL}`);
  console.log(`OAuth base: http://localhost:${PORT}/api/auth`);
  console.log(`Facebook callback: ${process.env.FACEBOOK_REDIRECT_URI}`);
});