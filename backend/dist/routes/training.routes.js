"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
exports.router = (0, express_1.Router)();
// Training Center – liste des cours dispos
exports.router.get("/modules", (_req, res) => {
    res.json({
        ok: true,
        module: "training",
        modules: [
            { id: "html-basics", title: "HTML Basics for Web Owners" },
            { id: "seo-intro", title: "SEO 101 – Understand Search Engines" }
        ]
    });
});
