"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAppleAuthorizeUrl = buildAppleAuthorizeUrl;
const crypto_1 = __importDefault(require("crypto"));
function buildAppleAuthorizeUrl() {
    const clientId = process.env.APPLE_CLIENT_ID;
    const redirectUri = process.env.APPLE_REDIRECT_URI;
    const scope = process.env.APPLE_SCOPE || "name email";
    const state = crypto_1.default.randomBytes(16).toString("hex");
    const nonce = crypto_1.default.randomBytes(16).toString("hex");
    const params = new URLSearchParams({
        response_type: "code",
        response_mode: "form_post",
        client_id: clientId,
        redirect_uri: redirectUri,
        scope,
        state,
        nonce,
    });
    return {
        url: `https://appleid.apple.com/auth/authorize?${params.toString()}`,
        state,
        nonce,
    };
}
