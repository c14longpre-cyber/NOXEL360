import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { MODULES } from "@/app/modules/registry";
import { LOGO_BY_ID } from "@/app/modules/logos";
function tierLabel(t) {
    const v = String(t || "PRO").toUpperCase();
    if (v === "FREE")
        return "LIVE";
    if (v === "CORE")
        return "CORE";
    return "PRO";
}
function tierSubtitle(t) {
    const v = String(t || "PRO").toUpperCase();
    if (v === "FREE")
        return "Tier min: BRONZE • Interne";
    if (v === "CORE")
        return "Tier min: CORE • Interne";
    return "Tier min: PRO • Interne";
}
export default function DashboardModules() {
    return (_jsx("section", { className: "px-6 py-8", children: _jsxs("div", { className: "mx-auto max-w-6xl", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Modules" }), _jsx("p", { className: "mt-1 text-sm text-white/60", children: "Ton cockpit central. Acc\u00E8s selon ton forfait." }), _jsx("div", { className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: MODULES.map((m) => {
                        const badge = tierLabel(m.minTier);
                        return (_jsxs(Link, { to: m.route, className: "group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/20 hover:bg-white/8", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("img", { src: LOGO_BY_ID[m.id] || LOGO_BY_ID["360"], alt: "", className: "h-12 w-12 shrink-0 opacity-95", style: { objectFit: "contain" }, loading: "lazy" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("div", { className: "truncate text-base font-semibold", children: m.name }), _jsx("span", { className: [
                                                                "shrink-0 rounded-full border px-2 py-0.5 text-[10px]",
                                                                badge === "LIVE"
                                                                    ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                                                                    : badge === "CORE"
                                                                        ? "border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-200"
                                                                        : "border-white/10 bg-white/5 text-white/70",
                                                            ].join(" "), children: badge })] }), _jsx("div", { className: "mt-1 text-xs text-white/60", children: tierSubtitle(m.minTier) })] })] }), _jsx("div", { className: "mt-4 text-xs text-emerald-300/90 opacity-0 transition group-hover:opacity-100", children: "Ouvrir \u2192" })] }, m.id));
                    }) })] }) }));
}
