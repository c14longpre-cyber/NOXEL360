"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSION_COOKIE_NAME = void 0;
exports.setSessionCookie = setSessionCookie;
exports.clearSessionCookie = clearSessionCookie;
exports.SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "noxel_session";
const isProd = process.env.NODE_ENV === "production" ||
    process.env.RAILWAY_ENVIRONMENT === "production";
const COOKIE_DOMAIN = isProd ? ".noxel360.com" : undefined;
const COOKIE_SECURE = isProd;
const COOKIE_SAMESITE = "none";
function setSessionCookie(res, sessionId) {
    res.cookie(exports.SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: COOKIE_SAMESITE,
        domain: COOKIE_DOMAIN,
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
}
function clearSessionCookie(res) {
    res.clearCookie(exports.SESSION_COOKIE_NAME, {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: COOKIE_SAMESITE,
        domain: COOKIE_DOMAIN,
        path: "/",
    });
}
