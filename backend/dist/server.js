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
// Social auth providers
const auth_apple_1 = __importDefault(require("./routes/auth.apple"));
const auth_facebook_1 = __importDefault(require("./routes/auth.facebook"));
const auth_linkedin_1 = __importDefault(require("./routes/auth.linkedin"));
const auth_tiktok_1 = __importDefault(require("./routes/auth.tiktok"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    FRONTEND_URL,
    "https://noxel360.vercel.app",
    "https://noxel360.com",
    "https://www.noxel360.com",
].filter((value, index, array) => Boolean(value) && array.indexOf(value) === index);
app.set("trust proxy", 1);
const corsOptions = {
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
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get("/", (_req, res) => {
    res.json({
        ok: true,
        app: "Noxel360 API",
        version: "1.0.0",
    });
});
app.get("/health", (_req, res) => {
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
app.use("/api/account", account_routes_1.default);
// Social auth routes
app.use("/api/auth", auth_apple_1.default);
app.use("/api/auth", auth_facebook_1.default);
app.use("/api/auth", auth_linkedin_1.default);
app.use("/api/auth", auth_tiktok_1.default);
// Main auth routes
app.use("/api/auth", auth_routes_1.authRouter);
// Existing API routes
app.use("/api", routes_1.router);
app.use("/api", performance_routes_1.performanceRouter);
app.use("/api", scripts_routes_1.scriptsRouter);
// Static public files
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// 404
app.use((req, res) => {
    res.status(404).json({
        ok: false,
        error: "Not found",
        path: req.originalUrl,
    });
});
// Error handler
app.use((err, _req, res, _next) => {
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
