import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ConnectedAccountsCard from "../../account/components/ConnectedAccountsCard";
import { useAuthStore } from "../../auth/AuthStore";
import NoxelAccessButton from "../../auth/NoxelAccessButton";
import UserMenu from "../../components/UserMenu";
import NoxelAccountIcon from "../../components/NoxelAccountIcon";
import { useModulesIndex } from "../modules/useModulesIndex";
import { useI18n } from "@/useI18n";
import { HudButton } from "@/components/hud/HudButton";
/**
 * Page Compte : n'affiche que ce que le backend connaît vraiment, c'est-à-dire
 * la session (/api/auth/session : utilisateur + fournisseurs reliés).
 * NOXEL360 ne vend rien : pas de palier ni de facturation ici, chaque module
 * (NOXEL SEO, NOXEL FORGE) garde son compte et ses prix sur son propre site.
 * Jamais de compte de démonstration à la place d'un vrai.
 */
function formatDate(value, locale) {
    if (!value)
        return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
        return "—";
    try {
        return date.toLocaleString(locale || undefined, { dateStyle: "medium", timeStyle: "short" });
    }
    catch {
        return date.toLocaleString();
    }
}
export default function AccountPage() {
    const { user, isAuthenticated, loading, refreshAuth } = useAuthStore();
    const { t, language } = useI18n();
    const modules = useModulesIndex();
    return (_jsx("div", { className: "noxel-landing", children: _jsxs("div", { className: "nx-wrap", children: [_jsx("header", { className: "nx-hero", children: _jsxs("div", { className: "account-hero-layout", children: [_jsx("div", { className: "account-hero-left", children: _jsx("img", { src: "/logos/NOXEL_360_LOGO.svg", alt: "NOXEL360", style: { height: 150 } }) }), _jsx("div", { className: "account-hero-center", children: _jsx("h1", { className: "nx-title", children: t("account.title") }) }), _jsxs("div", { className: "account-hero-right", children: [_jsxs("div", { className: "account-hero-top", style: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }, children: [_jsx(NoxelAccountIcon, { connected: isAuthenticated, size: 78 }), _jsx(HudButton, { action: "reload-page", iconOnly: true, label: t("account.refresh"), busy: loading, busyLabel: t("account.refresh"), onClick: refreshAuth }), !isAuthenticated ? _jsx(NoxelAccessButton, {}) : _jsx(UserMenu, {})] }), _jsxs("div", { className: "account-hero-meta", style: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end", marginTop: 10 }, children: [_jsxs("span", { className: "pill", children: [t("account.auth"), ":", " ", loading ? t("account.checking") : isAuthenticated ? t("account.connected") : t("account.guest")] }), user?.name && (_jsxs("span", { className: "pill", children: [t("account.signedInAs"), ": ", user.name] }))] })] })] }) }), _jsxs("div", { className: "nx-grid", style: { gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }, children: [_jsxs("article", { className: "nx-card", children: [_jsx("div", { className: "nx-card__title", children: t("account.profile") }), isAuthenticated && user ? (_jsxs("p", { className: "nx-card__text", children: [_jsxs("strong", { children: [t("account.name"), ":"] }), " ", user.name ?? "—", _jsx("br", {}), _jsxs("strong", { children: [t("account.email"), ":"] }), " ", user.email ?? "—", _jsx("br", {}), _jsxs("strong", { children: [t("account.lastLogin"), ":"] }), " ", formatDate(user.lastLoginAt, language)] })) : (_jsxs("div", { className: "nx-card__text", style: { display: "flex", flexDirection: "column", gap: 12 }, children: [_jsx("span", { children: loading ? t("account.checking") : t("account.guest") }), !loading && _jsx(NoxelAccessButton, {})] }))] }), _jsxs("article", { className: "nx-card", children: [_jsx("div", { className: "nx-card__title", children: t("dashboard.modules") }), _jsx("ul", { className: "nx-card__text", style: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }, children: modules.map((m) => (_jsx("li", { children: _jsxs("a", { href: m.route, ...(m.external ? { target: "_blank", rel: "noopener" } : {}), style: { color: "#3ddc84", textDecoration: "none" }, children: [m.name, " \u2014 ", t("dashboard.card.open")] }) }, m.key))) })] })] }), isAuthenticated && (_jsx("div", { style: { marginTop: 20 }, children: _jsx(ConnectedAccountsCard, {}) }))] }) }));
}
