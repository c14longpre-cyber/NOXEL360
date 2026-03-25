import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuthStore } from "../../auth/AuthStore";
const PROVIDERS = [
    { key: "google", label: "Google" },
    { key: "microsoft", label: "Microsoft" },
    { key: "apple", label: "Apple" },
    { key: "facebook", label: "Facebook" },
    { key: "linkedin", label: "LinkedIn" },
];
export default function ConnectedAccountsCard() {
    const { providers, loginWithProvider } = useAuthStore();
    function isConnected(providerKey) {
        return providers.some((p) => p.provider === providerKey);
    }
    return (_jsxs("section", { className: "nx-card", style: { display: "flex", flexDirection: "column", gap: 12 }, children: [_jsx("h3", { className: "nx-card__title", children: "Connected Accounts" }), _jsx("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: PROVIDERS.map((p) => {
                    const connected = isConnected(p.key);
                    return (_jsxs("div", { style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 12px",
                            borderRadius: 12,
                            border: "1px solid #10dada6e",
                        }, children: [_jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [_jsx("span", { style: { fontSize: 15, fontWeight: 600 }, children: p.label }), _jsx("span", { style: { fontSize: 12, opacity: 0.65 }, children: connected ? "Connected" : "Not connected" })] }), connected ? (_jsx("span", { style: {
                                    fontSize: 12,
                                    color: "#3CDE6A",
                                    fontWeight: 600,
                                }, children: "\u2713 Linked" })) : (_jsx("button", { className: "nx-btn", type: "button", onClick: () => loginWithProvider(p.key, "link"), style: {
                                    padding: "6px 12px",
                                    fontSize: 13,
                                }, children: "Connect" }))] }, p.key));
                }) })] }));
}
