import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState, } from "react";
const AuthContext = createContext(undefined);
const API_BASE = import.meta.env.VITE_API_URL;
const OAUTH_USER_STORAGE_KEY = "noxel_oauth_user";
const OAUTH_PROVIDERS_STORAGE_KEY = "noxel_oauth_providers";
function mapBackendUser(user) {
    return {
        id: user.id,
        email: user.emailPrimary,
        name: user.displayName,
        avatarUrl: user.avatarUrl,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
    };
}
function mapOAuthUserToAuthUser(oauthUser) {
    const now = new Date().toISOString();
    return {
        id: `${oauthUser.provider}:${oauthUser.providerUserId}`,
        email: oauthUser.email || null,
        name: oauthUser.name || null,
        avatarUrl: oauthUser.avatarUrl || null,
        emailVerified: Boolean(oauthUser.email),
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
    };
}
function mapOAuthUserToConnectedProvider(oauthUser, userId) {
    const now = new Date().toISOString();
    return {
        id: `${oauthUser.provider}:${oauthUser.providerUserId}`,
        userId,
        provider: oauthUser.provider,
        providerUserId: oauthUser.providerUserId,
        providerEmail: oauthUser.email || null,
        providerEmailVerified: Boolean(oauthUser.email),
        providerDisplayName: oauthUser.name || null,
        providerAvatarUrl: oauthUser.avatarUrl || null,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        rawProfileJson: oauthUser,
        linkedAt: now,
        lastUsedAt: now,
    };
}
function readStoredOAuthUser() {
    try {
        const raw = localStorage.getItem(OAUTH_USER_STORAGE_KEY);
        if (!raw)
            return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object")
            return null;
        return parsed;
    }
    catch (error) {
        console.error("Failed to read OAuth user from localStorage:", error);
        return null;
    }
}
function writeStoredOAuthUser(user) {
    try {
        localStorage.setItem(OAUTH_USER_STORAGE_KEY, JSON.stringify(user));
    }
    catch (error) {
        console.error("Failed to store OAuth user in localStorage:", error);
    }
}
function clearStoredOAuthUser() {
    try {
        localStorage.removeItem(OAUTH_USER_STORAGE_KEY);
    }
    catch (error) {
        console.error("Failed to clear OAuth user from localStorage:", error);
    }
}
function readStoredOAuthProviders() {
    try {
        const raw = localStorage.getItem(OAUTH_PROVIDERS_STORAGE_KEY);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return [];
        return parsed;
    }
    catch (error) {
        console.error("Failed to read OAuth providers from localStorage:", error);
        return [];
    }
}
function writeStoredOAuthProviders(providers) {
    try {
        localStorage.setItem(OAUTH_PROVIDERS_STORAGE_KEY, JSON.stringify(providers));
    }
    catch (error) {
        console.error("Failed to store OAuth providers in localStorage:", error);
    }
}
function clearStoredOAuthProviders() {
    try {
        localStorage.removeItem(OAUTH_PROVIDERS_STORAGE_KEY);
    }
    catch (error) {
        console.error("Failed to clear OAuth providers from localStorage:", error);
    }
}
function mergeProviders(baseProviders, extraProviders) {
    const map = new Map();
    for (const provider of baseProviders) {
        map.set(provider.provider, provider);
    }
    for (const provider of extraProviders) {
        map.set(provider.provider, provider);
    }
    return Array.from(map.values());
}
async function parseJsonResponse(res) {
    const contentType = res.headers.get("content-type") || "";
    const raw = await res.text();
    if (!contentType.includes("application/json")) {
        throw new Error(`Expected JSON but received ${contentType || "unknown content type"}`);
    }
    try {
        return JSON.parse(raw);
    }
    catch {
        throw new Error("Server returned invalid JSON");
    }
}
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    async function refreshAuth() {
        setLoading(true);
        try {
            if (!API_BASE) {
                throw new Error("Missing VITE_API_URL");
            }
            const res = await fetch(`${API_BASE}/api/auth/session`, {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                },
            });
            const json = await parseJsonResponse(res);
            console.log("auth/session status:", res.status);
            console.log("auth/session payload:", json);
            if (res.ok && json.ok && json.authenticated && json.user) {
                const restoredUser = mapBackendUser(json.user);
                const backendProviders = json.providers || [];
                const localProviders = readStoredOAuthProviders();
                const mergedProviders = mergeProviders(backendProviders, localProviders);
                setUser(restoredUser);
                setProviders(mergedProviders);
                writeStoredOAuthUser(restoredUser);
                writeStoredOAuthProviders(mergedProviders);
                console.log("refreshAuth > user restored from backend:", restoredUser);
                console.log("refreshAuth > providers restored/merged:", mergedProviders);
                setLoading(false);
                return;
            }
            const storedUser = readStoredOAuthUser();
            const storedProviders = readStoredOAuthProviders();
            if (storedUser) {
                setUser(storedUser);
                setProviders(storedProviders);
                console.log("refreshAuth > user restored from localStorage:", storedUser);
                console.log("refreshAuth > providers restored from localStorage:", storedProviders);
                setLoading(false);
                return;
            }
            setUser(null);
            setProviders([]);
            setLoading(false);
        }
        catch (error) {
            console.error("refreshAuth failed:", error);
            const storedUser = readStoredOAuthUser();
            const storedProviders = readStoredOAuthProviders();
            if (storedUser) {
                setUser(storedUser);
                setProviders(storedProviders);
                console.log("refreshAuth fallback > user restored from localStorage:", storedUser);
                console.log("refreshAuth fallback > providers restored from localStorage:", storedProviders);
                setLoading(false);
                return;
            }
            setUser(null);
            setProviders([]);
            setLoading(false);
        }
    }
    function loginWithProvider(provider, intent = "signin") {
        if (!API_BASE) {
            console.error("Missing VITE_API_URL");
            return;
        }
        window.location.href = `${API_BASE}/api/auth/${provider}/start?intent=${intent}`;
    }
    function setOAuthUser(oauthUser) {
        const normalizedUser = mapOAuthUserToAuthUser(oauthUser);
        const normalizedProvider = mapOAuthUserToConnectedProvider(oauthUser, normalizedUser.id);
        setUser(normalizedUser);
        setProviders((prev) => {
            const merged = mergeProviders(prev, [normalizedProvider]);
            writeStoredOAuthProviders(merged);
            return merged;
        });
        writeStoredOAuthUser(normalizedUser);
        setLoading(false);
        console.log("setOAuthUser > user stored from OAuth callback:", normalizedUser);
        console.log("setOAuthUser > provider stored from OAuth callback:", normalizedProvider);
    }
    useEffect(() => {
        void refreshAuth();
    }, []);
    const value = useMemo(() => ({
        user,
        providers,
        isAuthenticated: !!user,
        loading,
        loginWithProvider,
        logout: async () => {
            try {
                if (!API_BASE) {
                    throw new Error("Missing VITE_API_URL");
                }
                await fetch(`${API_BASE}/api/auth/logout`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                    },
                });
            }
            catch (error) {
                console.error("Logout request failed:", error);
            }
            finally {
                clearStoredOAuthUser();
                clearStoredOAuthProviders();
                setUser(null);
                setProviders([]);
                setLoading(false);
            }
        },
        refreshAuth,
        setOAuthUser,
    }), [user, providers, loading]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuthStore() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuthStore must be used inside <AuthProvider>");
    }
    return ctx;
}
