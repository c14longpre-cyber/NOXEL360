"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerRegistry = void 0;
exports.getProviderAdapter = getProviderAdapter;
exports.getProvider = getProvider;
exports.listEnabledProviders = listEnabledProviders;
const google_provider_1 = require("./google.provider");
const microsoft_provider_1 = require("./microsoft.provider");
const facebook_provider_1 = require("./facebook.provider");
const linkedin_provider_1 = require("./linkedin.provider");
const tiktok_provider_1 = require("./tiktok.provider");
exports.providerRegistry = {
    google: google_provider_1.googleProvider,
    microsoft: microsoft_provider_1.microsoftProvider,
    facebook: facebook_provider_1.facebookProvider,
    linkedin: linkedin_provider_1.linkedinProvider,
    tiktok: tiktok_provider_1.tiktokProvider,
};
function getProviderAdapter(provider) {
    const adapter = exports.providerRegistry[provider];
    if (!adapter) {
        throw new Error(`Provider not configured: ${provider}`);
    }
    return adapter;
}
function getProvider(name) {
    if (!name)
        return null;
    return exports.providerRegistry[name] ?? null;
}
function listEnabledProviders() {
    return Object.keys(exports.providerRegistry);
}
