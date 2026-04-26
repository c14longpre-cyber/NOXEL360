import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from "react";
import { fetchAccountSummary } from "../account/account.api";
const AccountContext = createContext(undefined);
const FALLBACK_ACCOUNT = {
    profile: {
        name: "Guest User",
        email: "guest@noxel360.local",
        language: "English",
        workspace: "NOXEL360",
    },
    billing: {
        tier: "Diamond",
        status: "Unavailable",
        renewalDate: "-",
        plan: "Unavailable",
    },
    preferences: {
        theme: "Default Noxel",
        notifications: "Enabled",
        interfaceMode: "Standard",
        morphProfile: "Not configured yet",
    },
    security: {
        password: "Unknown",
        twoFactor: "Unknown",
        lastLogin: "Unknown",
        sessionProtection: "Unknown",
    },
};
export function AccountProvider({ children }) {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [backendSource, setBackendSource] = useState("backend");
    const refreshAccount = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAccountSummary();
            setAccount(data);
            setBackendSource("backend");
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Unknown account store error";
            console.error("[AccountStore] refreshAccount failed:", err);
            setError(message);
            setAccount(FALLBACK_ACCOUNT);
            setBackendSource("fallback");
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        const controller = new AbortController();
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchAccountSummary(controller.signal);
                setAccount(data);
                setBackendSource("backend");
            }
            catch (err) {
                if (controller.signal.aborted)
                    return;
                const message = err instanceof Error ? err.message : "Unknown account store error";
                console.error("[AccountStore] initial load failed:", err);
                setError(message);
                setAccount(FALLBACK_ACCOUNT);
                setBackendSource("fallback");
            }
            finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }
        load();
        return () => controller.abort();
    }, []);
    const patchPreferences = useCallback((patch) => {
        setAccount((prev) => {
            if (!prev)
                return prev;
            return {
                ...prev,
                preferences: {
                    ...prev.preferences,
                    ...patch,
                },
            };
        });
    }, []);
    const value = useMemo(() => {
        return {
            account,
            loading,
            error,
            backendSource,
            refreshAccount,
            setAccount,
            patchPreferences,
        };
    }, [account, loading, error, backendSource, refreshAccount, patchPreferences]);
    return _jsx(AccountContext.Provider, { value: value, children: children });
}
export function useAccountStore() {
    const ctx = useContext(AccountContext);
    if (!ctx) {
        throw new Error("useAccountStore must be used inside <AccountProvider>");
    }
    return ctx;
}
export function useAccount() {
    return useAccountStore().account;
}
export function useAccountUser() {
    const { account } = useAccountStore();
    return {
        userName: account?.profile.name ?? "Guest User",
        email: account?.profile.email ?? "",
        workspace: account?.profile.workspace ?? "",
        language: account?.profile.language ?? "English",
    };
}
export function useAccountTier() {
    return useAccountStore().account?.billing.tier ?? "Diamond";
}
export function useAccountPreferences() {
    const { account, patchPreferences } = useAccountStore();
    return {
        preferences: account?.preferences ?? {
            theme: "Default Noxel",
            notifications: "Enabled",
            interfaceMode: "Standard",
            morphProfile: "Not configured yet",
        },
        patchPreferences,
    };
}
