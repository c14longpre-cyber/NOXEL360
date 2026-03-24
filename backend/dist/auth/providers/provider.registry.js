"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProviderAdapter = getProviderAdapter;
const google_provider_1 = require("./google.provider");
const microsoft_provider_1 = require("./microsoft.provider");
const providers = {
    google: google_provider_1.googleProvider,
    microsoft: microsoft_provider_1.microsoftProvider,
};
function getProviderAdapter(provider) {
    const adapter = providers[provider];
    if (!adapter) {
        throw new Error(`Provider not configured: ${provider}`);
    }
    return adapter;
}
