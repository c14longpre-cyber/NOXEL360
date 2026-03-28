import dotenv from "dotenv";
dotenv.config();

import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import { router as apiRouter } from "./routes";
import { performanceRouter } from "./routes/performance.routes";
import { scriptsRouter } from "./routes/scripts.routes";
import accountRoutes from "./routes/account.routes";
import { authRouter } from "./auth/auth.routes";

const app = express();

const PORT = Number(process.env.PORT) || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";
const isProd =
  NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT === "production";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const APP_URL = process.env.APP_URL || FRONTEND_URL;
const API_URL = process.env.API_URL || `http://localhost:${PORT}`;

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  FRONTEND_URL,
  APP_URL,
  "https://app.noxel360.com",
  "https://noxel360.com",
  "https://www.noxel360.com",
].filter(
  (value, index, array): value is string =>
    Boolean(value) && array.indexOf(value) === index
);

app.set("trust proxy", 1);

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // Autorise curl, health checks, server-to-server, etc.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===== Root =====
app.get("/", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    app: "Noxel360 API",
    version: "1.0.0",
    env: NODE_ENV,
    apiUrl: API_URL,
    frontendUrl: FRONTEND_URL,
  });
});

// ===== Health =====
const healthHandler = (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: "noxel360-backend",
    env: NODE_ENV,
    isProd,
    port: PORT,
    apiUrl: API_URL,
    frontend: FRONTEND_URL,
    appUrl: APP_URL,
    allowedOrigins,
    oauth: {
      google: Boolean(process.env.GOOGLE_CLIENT_ID),
      microsoft: Boolean(process.env.MICROSOFT_CLIENT_ID),
      apple: Boolean(process.env.APPLE_CLIENT_ID),
      facebook: Boolean(process.env.FACEBOOK_CLIENT_ID),
      linkedin: Boolean(process.env.LINKEDIN_CLIENT_ID),
      tiktok: Boolean(process.env.TIKTOK_CLIENT_KEY),
    },
  });
};

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

// ===== Main routes =====
app.use("/api/account", accountRoutes);
app.use("/api/auth", authRouter);
app.use("/api", apiRouter);
app.use("/api", performanceRouter);
app.use("/api", scriptsRouter);

// ===== Static public files =====
app.use(express.static(path.join(__dirname, "../public")));

// ===== 404 =====
app.use((req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    error: "Not found",
    path: req.originalUrl,
  });
});

// ===== Error handler =====
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled server error:", err);

  res.status(500).json({
    ok: false,
    error: err instanceof Error ? err.message : "Internal server error",
  });
});
app.get("/api/debug/oauth-config", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    apiUrl: process.env.API_URL || null,
    frontendUrl: process.env.FRONTEND_URL || null,
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || null,
    microsoftRedirectUri: process.env.MICROSOFT_REDIRECT_URI || null,
    facebookRedirectUri: process.env.FACEBOOK_REDIRECT_URI || null,
    linkedinRedirectUri: process.env.LINKEDIN_REDIRECT_URI || null,
    appleRedirectUri: process.env.APPLE_REDIRECT_URI || null,
    googleClientIdSet: Boolean(process.env.GOOGLE_CLIENT_ID),
    microsoftClientIdSet: Boolean(process.env.MICROSOFT_CLIENT_ID),
    facebookClientIdSet: Boolean(process.env.FACEBOOK_CLIENT_ID),
    facebookClientSecretSet: Boolean(process.env.FACEBOOK_CLIENT_SECRET),
    linkedinClientIdSet: Boolean(process.env.LINKEDIN_CLIENT_ID),
  });
});
app.listen(PORT, () => {
  console.log(`Noxel360 backend running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`API URL: ${API_URL}`);
  console.log(`Primary frontend URL: ${FRONTEND_URL}`);
  console.log(`App URL: ${APP_URL}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
  console.log(`OAuth base: /api/auth`);
  console.log(`Google callback: ${process.env.GOOGLE_REDIRECT_URI || "not set"}`);
  console.log(`Microsoft callback: ${process.env.MICROSOFT_REDIRECT_URI || "not set"}`);
  console.log(`Apple callback: ${process.env.APPLE_REDIRECT_URI || "not set"}`);
  console.log(`Facebook callback: ${process.env.FACEBOOK_REDIRECT_URI || "not set"}`);
  console.log(`LinkedIn callback: ${process.env.LINKEDIN_REDIRECT_URI || "not set"}`);
  console.log(`TikTok callback: ${process.env.TIKTOK_REDIRECT_URI || "not set"}`);
});