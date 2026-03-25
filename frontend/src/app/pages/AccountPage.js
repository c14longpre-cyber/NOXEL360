import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAccountStore } from "../../account/AccountStore";
import ConnectedAccountsCard from "../../account/components/ConnectedAccountsCard";
import { useAuthStore } from "../../auth/AuthStore";
import NoxelAccessButton from "../../auth/NoxelAccessButton";
import UserMenu from "../../components/UserMenu";
import NoxelAccountIcon from "../../components/NoxelAccountIcon";
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
    const currentTier = normalizeTier(account?.billing.tier);
    return (_jsx("div", { className: "noxel-landing", children: _jsxs("div", { className: "nx-wrap", children: [_jsx("header", { className: "nx-hero", children: _jsxs("div", { className: "account-hero-layout", children: [_jsx("div", { className: "account-hero-left", children: _jsx("img", { src: "/logos/noxel360.svg", alt: "NOXEL360", style: { height: 150 } }) }), _jsxs("div", { className: "account-hero-center", children: [_jsx("h1", { className: "nx-title", children: "Account Center" }), _jsx("p", { className: "nx-subtitle", children: "Manage your profile, plan, preferences, security, and connected sign-in providers." })] }), _jsxs("div", { className: "account-hero-right", children: [_jsxs("div", { className: "account-hero-top", style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                            flexWrap: "wrap",
                                            justifyContent: "flex-end",
                                        }, children: [_jsx(NoxelAccountIcon, { connected: isAuthenticated, tier: currentTier, size: 78 }), _jsx("button", { className: `nx-btn refresh-btn ${loading ? "loading" : ""}`, onClick: refreshAccount, type: "button", title: "Refresh account", "aria-label": "Refresh account", disabled: loading, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [_jsx("path", { d: "M21 12a9 9 0 1 1-2.64-6.36", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round" }), _jsx("path", { d: "M21 4v6h-6", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round" })] }) }), !isAuthenticated ? _jsx(NoxelAccessButton, {}) : _jsx(UserMenu, {})] }), _jsxs("div", { className: "account-hero-meta", style: {
                                            display: "flex",
                                            gap: 8,
                                            flexWrap: "wrap",
                                            justifyContent: "flex-end",
                                            marginTop: 10,
                                        }, children: [_jsxs("span", { className: "pill", children: ["Source: ", backendSource === "backend" ? "Live" : "Fallback"] }), _jsxs("span", { className: "pill", children: ["Status: ", loading ? "Loading..." : "Ready"] }), _jsxs("span", { className: "pill", children: ["Auth:", " ", authLoading
                                                        ? "Checking session..."
                                                        : isAuthenticated
                                                            ? "Connected"
                                                            : "Guest"] }), user?.name ? (_jsxs("span", { className: "pill", children: ["Signed in as: ", user.name] })) : null, user?.email ? _jsx("span", { className: "pill", children: user.email }) : null, error ? _jsxs("span", { className: "pill", children: ["Error: ", error] }) : null] })] })] }) }), _jsxs("div", { className: "nx-grid", style: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }, children: [_jsxs("article", { className: "nx-card", children: [_jsx("div", { className: "nx-card__title", children: "Profile" }), _jsxs("p", { className: "nx-card__text", children: [_jsx("strong", { children: "Name:" }), " ", account?.profile.name ?? user?.name ?? "—", _jsx("br", {}), _jsx("strong", { children: "Email:" }), " ", account?.profile.email ?? user?.email ?? "—", _jsx("br", {}), _jsx("strong", { children: "Language:" }), " ", account?.profile.language ?? "—", _jsx("br", {}), _jsx("strong", { children: "Workspace:" }), " ", account?.profile.workspace ?? "—"] })] }), _jsxs("article", { className: "nx-card", children: [_jsx("div", { className: "nx-card__title", children: "Plan & Billing" }), _jsxs("p", { className: "nx-card__text", children: [_jsx("strong", { children: "Tier:" }), " ", account?.billing.tier ?? "—", _jsx("br", {}), _jsx("strong", { children: "Status:" }), " ", account?.billing.status ?? "—", _jsx("br", {}), _jsx("strong", { children: "Renewal:" }), " ", account?.billing.renewalDate ?? "—", _jsx("br", {}), _jsx("strong", { children: "Plan:" }), " ", account?.billing.plan ?? "—"] })] }), _jsxs("article", { className: "nx-card", children: [_jsx("div", { className: "nx-card__title", children: "Preferences" }), _jsxs("p", { className: "nx-card__text", children: [_jsx("strong", { children: "Theme:" }), " ", account?.preferences.theme ?? "—", _jsx("br", {}), _jsx("strong", { children: "Notifications:" }), " ", account?.preferences.notifications ?? "—", _jsx("br", {}), _jsx("strong", { children: "Interface mode:" }), " ", account?.preferences.interfaceMode ?? "—", _jsx("br", {}), _jsx("strong", { children: "Morph profile:" }), " ", account?.preferences.morphProfile ?? "—"] })] }), _jsxs("article", { className: "nx-card", children: [_jsx("div", { className: "nx-card__title", children: "Security" }), _jsxs("p", { className: "nx-card__text", children: [_jsx("strong", { children: "Password:" }), " ", account?.security.password ?? "—", _jsx("br", {}), _jsx("strong", { children: "2FA:" }), " ", account?.security.twoFactor ?? "—", _jsx("br", {}), _jsx("strong", { children: "Last login:" }), " ", account?.security.lastLogin ?? "—", _jsx("br", {}), _jsx("strong", { children: "Session protection:" }), " ", account?.security.sessionProtection ?? "—"] })] })] }), _jsx("div", { style: { marginTop: 20 }, children: _jsx(ConnectedAccountsCard, {}) })] }) }));
}
