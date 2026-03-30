"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = require("./routes");
const performance_routes_1 = require("./routes/performance.routes");
const scripts_routes_1 = require("./routes/scripts.routes");
const account_routes_1 = __importDefault(require("./routes/account.routes"));
const auth_routes_1 = require("./auth/auth.routes");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";
const isProd = NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT === "production";
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
].filter((value, index, array) => Boolean(value) && array.indexOf(value) === index);
app.set("trust proxy", 1);
const corsOptions = {
    origin(origin, callback) {
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
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// ===== Root =====
app.get("/", (_req, res) => {
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
const healthHandler = (_req, res) => {
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
            facebook: Boolean(process.env.FACEBOOK_CLIENT_ID),
            linkedin: Boolean(process.env.LINKEDIN_CLIENT_ID),
            tiktok: Boolean(process.env.TIKTOK_CLIENT_KEY),
        },
    });
};
app.get("/health", healthHandler);
app.get("/api/health", healthHandler);
// ===== OAuth debug =====
app.get("/api/debug/oauth-config", (_req, res) => {
    res.json({
        ok: true,
        apiUrl: process.env.API_URL || null,
        frontendUrl: process.env.FRONTEND_URL || null,
        googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || null,
        microsoftRedirectUri: process.env.MICROSOFT_REDIRECT_URI || null,
        facebookRedirectUri: process.env.FACEBOOK_REDIRECT_URI || null,
        linkedinRedirectUri: process.env.LINKEDIN_REDIRECT_URI || null,
        tiktokRedirectUri: process.env.TIKTOK_REDIRECT_URI || null,
        googleClientIdSet: Boolean(process.env.GOOGLE_CLIENT_ID),
        microsoftClientIdSet: Boolean(process.env.MICROSOFT_CLIENT_ID),
        facebookClientIdSet: Boolean(process.env.FACEBOOK_CLIENT_ID),
        facebookClientSecretSet: Boolean(process.env.FACEBOOK_CLIENT_SECRET),
        linkedinClientIdSet: Boolean(process.env.LINKEDIN_CLIENT_ID),
        linkedinClientSecretSet: Boolean(process.env.LINKEDIN_CLIENT_SECRET),
        tiktokClientKeySet: Boolean(process.env.TIKTOK_CLIENT_KEY),
        tiktokClientSecretSet: Boolean(process.env.TIKTOK_CLIENT_SECRET),
    });
});
// ===== Main routes =====
app.use("/api/account", account_routes_1.default);
app.use("/api/auth", auth_routes_1.authRouter);
app.use("/api", routes_1.router);
app.use("/api", performance_routes_1.performanceRouter);
app.use("/api", scripts_routes_1.scriptsRouter);
// ===== Static public files =====
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// ===== 404 =====
app.use((req, res) => {
    res.status(404).json({
        ok: false,
        error: "Not found",
        path: req.originalUrl,
    });
});
// ===== Error handler =====
app.use((err, _req, res, _next) => {
    console.error("Unhandled server error:", err);
    res.status(500).json({
        ok: false,
        error: err instanceof Error ? err.message : "Internal server error",
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
    console.log(`Facebook callback: ${process.env.FACEBOOK_REDIRECT_URI || "not set"}`);
    console.log(`LinkedIn callback: ${process.env.LINKEDIN_REDIRECT_URI || "not set"}`);
    console.log(`TikTok callback: ${process.env.TIKTOK_REDIRECT_URI || "not set"}`);
});
