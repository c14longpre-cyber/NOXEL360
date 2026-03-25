import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
const modules = [
    { title: "NOXEL MAESTRO", subtitle: "Tier min: BRONZE • Module externe", href: "/maestro" },
    { title: "NOXEL ATLAS", subtitle: "Tier min: BRONZE • Interne", href: "/atlas" },
    { title: "NOXEL SEO", subtitle: "Tier min: BRONZE • Interne", href: "/seo" },
    { title: "NOXEL SERP", subtitle: "Tier min: ARGENT • Interne", href: "/serp" },
    { title: "NOXEL VITALS", subtitle: "Tier min: BRONZE • Interne", href: "/vitals" },
    { title: "NOXEL WEBP", subtitle: "Tier min: BRONZE • Interne", href: "/webp" },
];
export default function DashboardModules() {
    return (_jsx("section", { className: "px-6 py-8", children: _jsxs("div", { className: "mx-auto max-w-5xl", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Modules" }), _jsx("p", { className: "mt-1 text-sm text-white/60", children: "Ton cockpit central. Acc\u00E8s selon ton forfait." }), _jsx("div", { className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: modules.map((m) => (_jsxs(Link, { to: m.href, className: "group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/20 hover:bg-white/8", children: [_jsx("div", { className: "text-base font-semibold", children: m.title }), _jsx("div", { className: "mt-1 text-xs text-white/60", children: m.subtitle }), _jsx("div", { className: "mt-4 text-xs text-emerald-300/90 opacity-0 transition group-hover:opacity-100", children: "Ouvrir \u2192" })] }, m.title))) })] }) }));
}
