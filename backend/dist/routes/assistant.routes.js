"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
exports.router = (0, express_1.Router)();
// Virtual Assistant Builder – création/config placeholder
exports.router.post("/create", (req, res) => {
    const { name, personality, languages } = req.body;
    res.json({
        ok: true,
        module: "assistant",
        assistant: {
            id: "demo-assistant-1",
            name,
            personality,
            languages
        }
    });
});
