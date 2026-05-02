import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { seoModuleRouter } from "./seo/seo.module";

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

// NOXEL SEO — vrai moteur (seo.module.ts)
// GET /api/seo/health
// GET /api/seo/vm/summary?url=https://example.com
// GET /api/seo/issues?url=https://example.com
app.use("/api/seo", seoModuleRouter);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Not found",
    path: req.originalUrl,
  });
});

app.listen(PORT, () => {
  console.log(`NOXEL360 backend running on port ${PORT}`);
});
