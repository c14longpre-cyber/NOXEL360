"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFrontendUrl = getFrontendUrl;
function getFrontendUrl() {
    const value = process.env.FRONTEND_URL;
    if (value && value.trim()) {
        return value.trim();
    }
    return "http://localhost:5173";
}
