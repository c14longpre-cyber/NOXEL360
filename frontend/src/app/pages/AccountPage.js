import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAccountStore } from "../../account/AccountStore";
import ConnectedAccountsCard from "../../account/components/ConnectedAccountsCard";
import { useAuthStore } from "../../auth/AuthStore";
import NoxelAccessButton from "../../auth/NoxelAccessButton";
import UserMenu from "../../components/UserMenu";
import NoxelAccountIcon from "../../components/NoxelAccountIcon";
import { useI18n } from "@/useI18n";
function normalizeTier(tier) {
    const value = (tier || "").toLowerCase();
    if (value === "bronze")
        return "bronze";
    if (value === "silver")
        return "silver";
    if (value === "gold")
        return "gold";
    if (value === "platinum")
        return "platinum";
    return "diamond";
}
export default function AccountPage() {
    const { account, loading, error, backendSource, refreshAccount } = useAccountStore();
    const { user, isAuthenticated, loading: authLoading } = useAuthStore();
    const { t } = useI18n();
    const currentTier = normalizeTier(account?.billing.tier);
    return (_jsx("div", { className: "noxel-landing", children: _jsxs("div", { className: "nx-wrap", children: [_jsx("header", { className: "nx-hero", children: _jsxs("div", { className: "account-hero-layout", children: [_jsx("div", { className: "account-hero-left", children: _jsx("img", { src: "/logos/noxel360.svg", alt: "NOXEL360", style: { height: 150 } }) }), _jsxs("div", { className: "account-hero-center", children: [_jsx("h1", { className: "nx-title", children: t("account.title") }), _jsx("p", { className: "nx-subtitle", children: t("account.subtitle") })] }), _jsxs("div", { className: "account-hero-right", children: [_jsxs("div", { className: "account-hero-top", style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                            flexWrap: "wrap",
                                            justifyContent: "flex-end",
                                        }, children: [_jsx(NoxelAccountIcon, { connected: isAuthenticated, tier: currentTier, size: 78 }), _jsx("button", { className: `nx-btn refresh-btn ${loading ? "loading" : ""}`, onClick: refreshAccount, type: "button", title: t("account.refresh"), "aria-label": t("account.refresh"), disabled: loading, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [_jsx("path", { d: "M21 12a9 9 0 1 1-2.64-6.36", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round" }), _jsx("path", { d: "M21 4v6h-6", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round" })] }) }), !isAuthenticated ? _jsx(NoxelAccessButton, {}) : _jsx(UserMenu, {})] }), _jsxs("div", { className: "account-hero-meta", style: {
                                            display: "flex",
                                            gap: 8,
                                            flexWrap: "wrap",
                                            justifyContent: "flex-end",
                                            marginTop: 10,
                                        }, children: [_jsxs("span", { className: "pill", children: [t("account.source"), ":", " ", backendSource === "backend"
                                                        ? t("account.source.live")
                                                        : t("account.source.fallback")] }), _jsxs("span", { className: "pill", children: [t("account.status"), ":", " ", loading ? t("common.loading") : t("account.ready")] }), _jsxs("span", { className: "pill", children: [t("account.auth"), ":", " ", authLoading
                                                        ? t("account.checking")
                                                        : isAuthenticated
                                                            ? t("account.connected")
                                                            : t("account.guest")] }), user?.name && (_jsxs("span", { className: "pill", children: [t("account.signedInAs"), ": ", user.name] })), user?.email && _jsx("span", { className: "pill", children: user.email }), error && (_jsxs("span", { className: "pill", children: [t("account.error"), ": ", error] }))] })] })] }) }), _jsxs("div", { className: "nx-grid", style: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }, children: [_jsxs("article", { className: "nx-card", children: [_jsx("div", { className: "nx-card__title", children: t("account.profile") }), _jsxs("p", { className: "nx-card__text", children: [_jsxs("strong", { children: [t("account.name"), ":"] }), " ", account?.profile.name ?? user?.name ?? "—", _jsx("br", {}), _jsxs("strong", { children: [t("account.email"), ":"] }), " ", account?.profile.email ?? user?.email ?? "—", _jsx("br", {}), _jsxs("strong", { children: [t("account.language"), ":"] }), " ", account?.profile.language ?? "—", _jsx("br", {}), _jsxs("strong", { children: [t("account.workspace"), ":"] }), " ", account?.profile.workspace ?? "—"] })] }), _jsxs("article", { className: "nx-card", children: [_jsx("div", { className: "nx-card__title", children: t("account.billing") }), _jsxs("p", { className: "nx-card__text", children: [_jsxs("strong", { children: [t("account.tier"), ":"] }), " ", account?.billing.tier ?? "—", _jsx("br", {}), _jsxs("strong", { children: [t("account.status"), ":"] }), " ", account?.billing.status ?? "—", _jsx("br", {}), _jsxs("strong", { children: [t("account.renewal"), ":"] }), " ", account?.billing.renewalDate ?? "—", _jsx("br", {}), _jsxs("strong", { children: [t("account.plan"), ":"] }), " ", account?.billing.plan ?? "—"] })] }), _jsxs("article", { className: "nx-card", children: [_jsx("div", { className: "nx-card__title", children: t("account.preferences") }), _jsxs("p", { className: "nx-card__text", children: [_jsxs("strong", { children: [t("account.theme"), ":"] }), " ", account?.preferences.theme ?? "—", _jsx("br", {}), _jsxs("strong", { children: [t("account.notifications"), ":"] }), " ", account?.preferences.notifications ?? "—", _jsx("br", {}), _jsxs("strong", { children: [t("account.interfaceMode"), ":"] }), " ", account?.preferences.interfaceMode ?? "—", _jsx("br", {}), _jsxs("strong", { children: [t("account.morphProfile"), ":"] }), " ", account?.preferences.morphProfile ?? "—"] })] }), _jsxs("article", { className: "nx-card", children: [_jsx("div", { className: "nx-card__title", children: t("account.security") }), _jsxs("p", { className: "nx-card__text", children: [_jsxs("strong", { children: [t("account.password"), ":"] }), " ", account?.security.password ?? "—", _jsx("br", {}), _jsxs("strong", { children: [t("account.twoFactor"), ":"] }), " ", account?.security.twoFactor ?? "—", _jsx("br", {}), _jsxs("strong", { children: [t("account.lastLogin"), ":"] }), " ", account?.security.lastLogin ?? "—", _jsx("br", {}), _jsxs("strong", { children: [t("account.sessionProtection"), ":"] }), " ", account?.security.sessionProtection ?? "—"] })] })] }), _jsx("div", { style: { marginTop: 20 }, children: _jsx(ConnectedAccountsCard, {}) })] }) }));
}
