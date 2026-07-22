import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState, } from "react";
const AuthContext = createContext(undefined);
const API_BASE = import.meta.env.VITE_API_URL;
const ENABLE_REMOTE_AUTH = import.meta.env.VITE_ENABLE_REMOTE_AUTH === "true";
const IS_DEV = import.meta.env.DEV;
const OAUTH_USER_STORAGE_KEY = "noxel_oauth_user";
const OAUTH_PROVIDERS_STORAGE_KEY = "noxel_oauth_providers";
function devWarn(message, detail) {
    if (IS_DEV) {
        console.warn(`[AuthStore] ${message}`, detail ?? "");
    }
}
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
        devWarn("Failed to read OAuth user from localStorage.", error);
        return null;
    }
}
function writeStoredOAuthUser(user) {
    try {
        localStorage.setItem(OAUTH_USER_STORAGE_KEY, JSON.stringify(user));
    }
    catch (error) {
        devWarn("Failed to store OAuth user in localStorage.", error);
    }
}
function clearStoredOAuthUser() {
    try {
        localStorage.removeItem(OAUTH_USER_STORAGE_KEY);
    }
    catch (error) {
        devWarn("Failed to clear OAuth user from localStorage.", error);
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
        devWarn("Failed to read OAuth providers from localStorage.", error);
        return [];
    }
}
function writeStoredOAuthProviders(providers) {
    try {
        localStorage.setItem(OAUTH_PROVIDERS_STORAGE_KEY, JSON.stringify(providers));
    }
    catch (error) {
        devWarn("Failed to store OAuth providers in localStorage.", error);
    }
}
function clearStoredOAuthProviders() {
    try {
        localStorage.removeItem(OAUTH_PROVIDERS_STORAGE_KEY);
    }
    catch (error) {
        devWarn("Failed to clear OAuth providers from localStorage.", error);
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
    if (!contentType.includes("application/json")) {
        return null;
    }
    try {
        return (await res.json());
    }
    catch {
        return null;
    }
}
function restoreLocalAuth() {
    return {
        storedUser: readStoredOAuthUser(),
        storedProviders: readStoredOAuthProviders(),
    };
}
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    async function refreshAuth() {
        setLoading(true);
        try {
            if (!API_BASE || !ENABLE_REMOTE_AUTH) {
                const { storedUser, storedProviders } = restoreLocalAuth();
                setUser(storedUser);
                setProviders(storedProviders);
                return;
            }
            const res = await fetch(`${API_BASE}/api/auth/session`, {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                },
            });
            if (!res.ok) {
                const { storedUser, storedProviders } = restoreLocalAuth();
                setUser(storedUser);
                setProviders(storedProviders);
                return;
            }
            const json = await parseJsonResponse(res);
            if (json?.ok && json.authenticated && json.user) {
                const restoredUser = mapBackendUser(json.user);
                const backendProviders = json.providers || [];
                const localProviders = readStoredOAuthProviders();
                const mergedProviders = mergeProviders(backendProviders, localProviders);
                setUser(restoredUser);
                setProviders(mergedProviders);
                writeStoredOAuthUser(restoredUser);
                writeStoredOAuthProviders(mergedProviders);
                return;
            }
            const { storedUser, storedProviders } = restoreLocalAuth();
            setUser(storedUser);
            setProviders(storedProviders);
        }
        catch (error) {
            devWarn("refreshAuth failed, using local fallback.", error);
            const { storedUser, storedProviders } = restoreLocalAuth();
            setUser(storedUser);
            setProviders(storedProviders);
        }
        finally {
            setLoading(false);
        }
    }
    function loginWithProvider(provider, intent = "signin") {
        if (!API_BASE) {
            devWarn("Missing VITE_API_URL.");
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
    }
    async function logout() {
        try {
            if (API_BASE && ENABLE_REMOTE_AUTH) {
                await fetch(`${API_BASE}/api/auth/logout`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                    },
                });
            }
        }
        catch (error) {
            devWarn("Logout request failed.", error);
        }
        finally {
            clearStoredOAuthUser();
            clearStoredOAuthProviders();
            setUser(null);
            setProviders([]);
            setLoading(false);
        }
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
        logout,
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
