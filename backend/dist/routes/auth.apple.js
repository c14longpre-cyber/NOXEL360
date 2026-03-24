"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appleAuth_1 = require("../services/appleAuth");
const router = (0, express_1.Router)();
router.get("/apple", (_req, res) => {
    const { url } = (0, appleAuth_1.buildAppleAuthorizeUrl)();
    return res.redirect(url);
});
router.post("/apple/callback", async (req, res) => {
    const { code, id_token, user } = req.body || {};
    return res.json({
        ok: true,
        provider: "apple",
        received: {
            hasCode: !!code,
            hasIdToken: !!id_token,
            hasUserPayload: !!user,
        },
    });
});
exports.default = router;
