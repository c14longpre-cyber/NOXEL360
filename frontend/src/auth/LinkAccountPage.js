import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "./AuthStore";
const API_BASE = import.meta.env.VITE_API_URL;
function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}
export default function LinkAccountPage() {
    const query = useQuery();
    const navigate = useNavigate();
    const { isAuthenticated, refreshAuth, loginWithProvider, user } = useAuthStore();
    const ticketId = query.get("ticketId") || "";
    const email = query.get("email") || "";
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    async function handleConfirmLink() {
        if (!ticketId) {
            setError("Missing link ticket.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/auth/resolve-existing-email`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ticketId }),
            });
            const json = await res.json();
            if (!res.ok || !json.ok) {
                throw new Error(json?.error || "Failed to link account.");
            }
            await refreshAuth();
            navigate("/app/account?tab=accounts");
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Failed to link account.";
            setError(message);
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsx("div", { style: {
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: 24,
        }, children: _jsxs("section", { className: "nx-card", style: {
                width: "100%",
                maxWidth: 560,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                borderRadius: 24,
            }, children: [_jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [_jsx("h1", { className: "nx-card__title", style: { margin: 0 }, children: "Account already exists" }), _jsxs("p", { className: "nx-card__text", style: { margin: 0 }, children: ["A Noxel360 account already exists", email ? ` for ${email}` : "", ". Sign in to your existing account, then confirm the link."] })] }), !isAuthenticated ? (_jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [_jsx("div", { style: { fontSize: 14, opacity: 0.75 }, children: "You need to sign in to your existing Noxel360 account first." }), _jsxs("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" }, children: [_jsx("button", { className: "nx-btn", type: "button", onClick: () => loginWithProvider("google", "signin"), children: "Sign in with Google" }), _jsx("button", { className: "nx-btn", type: "button", onClick: () => loginWithProvider("microsoft", "signin"), children: "Sign in with Microsoft" })] })] })) : (_jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: [_jsxs("div", { style: { fontSize: 14, opacity: 0.8 }, children: ["Signed in as ", _jsx("strong", { children: user?.email || user?.name || "current user" })] }), _jsxs("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" }, children: [_jsx("button", { className: "nx-btn", type: "button", onClick: handleConfirmLink, disabled: loading, children: loading ? "Linking..." : "Confirm link" }), _jsx("button", { className: "nx-btn", type: "button", onClick: () => navigate("/app/account"), children: "Cancel" })] })] })), error ? (_jsx("div", { style: {
                        fontSize: 13,
                        color: "#ff8a8a",
                        border: "1px solid rgba(255, 138, 138, 0.25)",
                        borderRadius: 12,
                        padding: "10px 12px",
                    }, children: error })) : null] }) }));
}
