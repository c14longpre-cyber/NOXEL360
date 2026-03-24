"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/summary", (_req, res) => {
    res.json({
        ok: true,
        data: {
            profile: {
                name: "Christian Longpré",
                email: "christian@noxel360.com",
                language: "English",
                workspace: "NOXEL360"
            },
            billing: {
                tier: "Diamond",
                status: "Active",
                renewalDate: "2026-04-15",
                plan: "Full Platform Access"
            },
            preferences: {
                theme: "Default Noxel",
                notifications: "Enabled",
                interfaceMode: "Standard",
                morphProfile: "Not configured yet"
            },
            security: {
                password: "Configured",
                twoFactor: "Coming soon",
                lastLogin: "Today",
                sessionProtection: "Active"
            }
        }
    });
});
exports.default = router;
