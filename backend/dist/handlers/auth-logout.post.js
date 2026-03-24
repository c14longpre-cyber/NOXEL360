"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLogout = authLogout;
async function authLogout(_req, res) {
    res.json({
        ok: true,
        message: "Logged out",
    });
}
