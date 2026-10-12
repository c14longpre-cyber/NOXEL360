import express from "express";
import { authRouter } from "./auth/auth.routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/http";

const app = express();
const PORT = Number(process.env.PORT || 4000);

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://noxel360.com",
  "https://www.noxel360.com",
  "https://app.noxel360.com",
  "https://c14longpre-cyber-noxel360.vercel.app",
  "https://c14longpre-cyber-noxel360-v2.vercel.app",
];

app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health checks
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "noxel360-backend",
    status: "online",
    uptimeSec: Math.floor(process.uptime()),
    allowedOrigins,
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "noxel360-api",
    status: "online",
    uptimeSec: Math.floor(process.uptime()),
  });
});

// Auth — Google/Microsoft/Facebook/LinkedIn/TikTok/GitHub OAuth (redirect-based)
// GET  /api/auth/:provider/start
// GET  /api/auth/:provider/callback
// GET  /api/auth/session (also aliased as /api/auth/me)
// POST /api/auth/logout
// POST /api/auth/resolve-existing-email
app.use("/api/auth", authRouter);

// NOXEL SEO est un produit externe : l'ancien moteur SEO de NOXEL360 est
// retiré et tout /api/seo/* renvoie de façon permanente vers noxelseo.com.
const NOXEL_SEO_URL = "https://noxelseo.com";
app.use("/api/seo", (_req, res) => {
  res.redirect(301, NOXEL_SEO_URL);
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Not found",
    path: req.originalUrl,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`NOXEL360 backend running on port ${PORT}`);
});
