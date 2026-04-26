import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuthStore } from "../../auth/AuthStore";
import { useI18n } from "@/useI18n";
const PROVIDERS = [
    { key: "google", labelKey: "provider.google" },
    { key: "microsoft", labelKey: "provider.microsoft" },
    { key: "apple", labelKey: "provider.apple" },
    { key: "facebook", labelKey: "provider.facebook" },
    { key: "linkedin", labelKey: "provider.linkedin" },
];
export default function ConnectedAccountsCard() {
    const { providers, loginWithProvider } = useAuthStore();
    const { t } = useI18n();
    function isConnected(providerKey) {
        return providers.some((p) => p.provider === providerKey);
    }
    return (_jsxs("section", { className: "nx-card", style: { display: "flex", flexDirection: "column", gap: 12 }, children: [_jsx("h3", { className: "nx-card__title", children: t("connectedAccounts.title") }), _jsx("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: PROVIDERS.map((p) => {
                    const connected = isConnected(p.key);
                    return (_jsxs("div", { style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 12px",
                            borderRadius: 12,
                            border: "1px solid #10dada6e",
                        }, children: [_jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [_jsx("span", { style: { fontSize: 15, fontWeight: 600 }, children: t(p.labelKey) }), _jsx("span", { style: { fontSize: 12, opacity: 0.65 }, children: connected
                                            ? t("connectedAccounts.status.connected")
                                            : t("connectedAccounts.status.notConnected") })] }), connected ? (_jsx("span", { style: {
                                    fontSize: 12,
                                    color: "#3CDE6A",
                                    fontWeight: 600,
                                }, children: t("connectedAccounts.linked") })) : (_jsx("button", { className: "nx-btn", type: "button", onClick: () => loginWithProvider(p.key, "link"), style: {
                                    padding: "6px 12px",
                                    fontSize: 13,
                                }, children: t("connectedAccounts.connect") }))] }, p.key));
                }) })] }));
}
