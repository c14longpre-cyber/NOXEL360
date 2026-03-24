"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthMe = getAuthMe;
const session_1 = require("../services/session");
const userStore_1 = require("../services/userStore");
async function getAuthMe(req, res) {
    try {
        const sessionId = req.cookies?.noxel_session;
        if (!sessionId) {
            res.status(401).json({
                ok: false,
                error: "No session cookie",
            });
            return;
        }
        const payload = (0, session_1.verifySession)(sessionId);
        if (!payload) {
            res.status(401).json({
                ok: false,
                error: "Invalid or expired session",
            });
            return;
        }
        const user = (0, userStore_1.findUserById)(payload.userId);
        if (!user) {
            res.status(404).json({
                ok: false,
                error: "User not found",
            });
            return;
        }
        res.json({
            ok: true,
            user,
        });
    }
    catch (error) {
        console.error("[getAuthMe] failed:", error);
        res.status(500).json({
            ok: false,
            error: "Unable to load current user",
        });
    }
}
