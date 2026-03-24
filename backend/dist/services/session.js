"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = createSession;
exports.verifySession = verifySession;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
function createSession(userId) {
    const payload = {
        userId,
    };
    const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: "7d",
    });
    return token;
}
function verifySession(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!decoded || typeof decoded !== "object") {
            return null;
        }
        return {
            userId: decoded.userId,
            iat: decoded.iat,
            exp: decoded.exp,
        };
    }
    catch (error) {
        console.warn("[verifySession] invalid token");
        return null;
    }
}
