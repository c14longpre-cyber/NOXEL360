import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAccountStore } from "../../account/AccountStore";
import { useAuthStore } from "../../auth/AuthStore";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import UserMenu from "../../components/UserMenu";
import NoxelAccountIcon from "../../components/NoxelAccountIcon";
_jsx(NoxelAccountIcon, { connected: true, tier: "diamond", size: 78 });
export default function AccountPage() {
    const { account, loading, error, backendSource, refreshAccount } = useAccountStore();
    const { user, isAuthenticated, loading: authLoading } = useAuthStore();
    return (_jsx("div", { className: "noxel-landing", children: _jsxs("div", { className: "nx-wrap", children: [_jsx("header", { className: "nx-hero", children: _jsxs("div", { className: "nx-hero__text", children: [_jsx("div", { className: "nx-kicker", children: "NOXEL360" }), _jsx("h1", { className: "nx-title", children: "Account Center" }), _jsx("p", { className: "nx-subtitle", children: "Manage your profile, plan, preferences, and future platform settings." }), _jsxs("div", { style: {
                                    marginTop: 12,
                                    display: "flex",
                                    gap: 10,
                                    flexWrap: "wrap",
                                }, children: [_jsxs("span", { className: "pill", children: ["Source:", " ", backendSource === "backend" ? "Live backend" : "Fallback mock"] }), _jsxs("span", { className: "pill", children: ["Status: ", loading ? "Loading..." : "Ready"] }), error ? _jsxs("span", { className: "pill", children: ["Error: ", error] }) : null, _jsxs("span", { className: "pill", children: ["Auth:", " ", authLoading
                                                ? "Checking session..."
                                                : isAuthenticated
                                                    ? "Connected"
                                                    : "Guest"] })] }), _jsxs("div", { style: {
                                    marginTop: 12,
                                    display: "flex",
                                    gap: 12,
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                }, children: [_jsx("button", { className: "nx-btn", onClick: refreshAccount, type: "button", children: "Refresh account" }), _jsx(GoogleLoginButton, {}), isAuthenticated ? _jsx(UserMenu, {}) : null] }), user ? (_jsxs("div", { style: { marginTop: 12 }, children: [_jsxs("span", { className: "pill", children: ["Signed in as: ", user.name] }), _jsx("span", { className: "pill", style: { marginLeft: 8 }, children: user.email })] })) : null] }) }), _jsxs("div", { className: "nx-grid", style: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }, children: [_jsxs("article", { className: "nx-card", children: [_jsx("div", { className: "nx-card__title", children: "Profile" }), _jsxs("p", { className: "nx-card__text", children: [_jsx("strong", { children: "Name:" }), " ", account?.profile.name ?? "—", _jsx("br", {}), _jsx("strong", { children: "Email:" }), " ", account?.profile.email ?? "—", _jsx("br", {}), _jsx("strong", { children: "Language:" }), " ", account?.profile.language ?? "—", _jsx("br", {}), _jsx("strong", { children: "Workspace:" }), " ", account?.profile.workspace ?? "—"] })] }), _jsxs("article", { className: "nx-card", children: [_jsx("div", { className: "nx-card__title", children: "Plan & Billing" }), _jsxs("p", { className: "nx-card__text", children: [_jsx("strong", { children: "Tier:" }), " ", account?.billing.tier ?? "—", _jsx("br", {}), _jsx("strong", { children: "Status:" }), " ", account?.billing.status ?? "—", _jsx("br", {}), _jsx("strong", { children: "Renewal:" }), " ", account?.billing.renewalDate ?? "—", _jsx("br", {}), _jsx("strong", { children: "Plan:" }), " ", account?.billing.plan ?? "—"] })] }), _jsxs("article", { className: "nx-card", children: [_jsx("div", { className: "nx-card__title", children: "Preferences" }), _jsxs("p", { className: "nx-card__text", children: [_jsx("strong", { children: "Theme:" }), " ", account?.preferences.theme ?? "—", _jsx("br", {}), _jsx("strong", { children: "Notifications:" }), " ", account?.preferences.notifications ?? "—", _jsx("br", {}), _jsx("strong", { children: "Interface mode:" }), " ", account?.preferences.interfaceMode ?? "—", _jsx("br", {}), _jsx("strong", { children: "Morph profile:" }), " ", account?.preferences.morphProfile ?? "—"] })] }), _jsxs("article", { className: "nx-card", children: [_jsx("div", { className: "nx-card__title", children: "Security" }), _jsxs("p", { className: "nx-card__text", children: [_jsx("strong", { children: "Password:" }), " ", account?.security.password ?? "—", _jsx("br", {}), _jsx("strong", { children: "2FA:" }), " ", account?.security.twoFactor ?? "—", _jsx("br", {}), _jsx("strong", { children: "Last login:" }), " ", account?.security.lastLogin ?? "—", _jsx("br", {}), _jsx("strong", { children: "Session protection:" }), " ", account?.security.sessionProtection ?? "—"] })] })] })] }) }));
}
