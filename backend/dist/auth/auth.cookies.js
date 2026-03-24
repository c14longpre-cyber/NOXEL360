"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSION_COOKIE_NAME = void 0;
exports.getSessionCookieOptions = getSessionCookieOptions;
exports.setSessionCookie = setSessionCookie;
exports.clearSessionCookie = clearSessionCookie;
exports.SESSION_COOKIE_NAME = "noxel_sid";
function getSessionCookieOptions() {
    const isProd = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 30,
    };
}
function setSessionCookie(res, sessionId) {
    res.cookie(exports.SESSION_COOKIE_NAME, sessionId, getSessionCookieOptions());
}
function clearSessionCookie(res) {
    res.clearCookie(exports.SESSION_COOKIE_NAME, {
        path: "/",
    });
}
