"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
exports.router = (0, express_1.Router)();
// Noxel Market – liste des items (placeholder)
exports.router.get("/items", (_req, res) => {
    res.json({
        ok: true,
        module: "market",
        items: [
            { id: "tpl-home-pro", type: "template", name: "Home Page Pro Template" },
            { id: "pack-ads-cosmetics", type: "pack", name: "Cosmetics Ads Pack" }
        ]
    });
});
