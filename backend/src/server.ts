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

// Social auth providers
import appleAuthRouter from "./routes/auth.apple";
import facebookAuthRouter from "./routes/auth.facebook";
import linkedinAuthRouter from "./routes/auth.linkedin";
import tiktokAuthRouter from "./routes/auth.tiktok";

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  FRONTEND_URL,
  "https://noxel360.vercel.app",
  "https://noxel360.com",
  "https://www.noxel360.com",
].filter((value, index, array): value is string => Boolean(value) && array.indexOf(value) === index);

app.set("trust proxy", 1);

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // Allow server-to-server requests, curl, health checks, etc.
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

app.get("/", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    app: "Noxel360 API",
    version: "1.0.0",
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: "noxel360-backend",
    port: PORT,
    frontend: FRONTEND_URL,
    allowedOrigins,
    oauth: {
      apple: true,
      facebook: true,
      linkedin: true,
      tiktok: true,
    },
  });
});

app.use("/api/account", accountRoutes);

// Social auth routes
app.use("/api/auth", appleAuthRouter);
app.use("/api/auth", facebookAuthRouter);
app.use("/api/auth", linkedinAuthRouter);
app.use("/api/auth", tiktokAuthRouter);

// Main auth routes
app.use("/api/auth", authRouter);

// Existing API routes
app.use("/api", apiRouter);
app.use("/api", performanceRouter);
app.use("/api", scriptsRouter);

// Static public files
app.use(express.static(path.join(__dirname, "../public")));

// 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    error: "Not found",
    path: req.originalUrl,
  });
});

// Error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled server error:", err);

  res.status(500).json({
    ok: false,
    error: err instanceof Error ? err.message : "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Noxel360 backend running on port ${PORT}`);
  console.log(`Primary frontend URL: ${FRONTEND_URL}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
  console.log(`OAuth base: /api/auth`);
  console.log(`Facebook callback: ${process.env.FACEBOOK_REDIRECT_URI || "not set"}`);
});