import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import { MODULES } from "@/app/modules/registry";
import { LOGO_BY_ID } from "@/app/modules/logos";
const linkBase = "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition";
function tierLabel(t) {
    const v = String(t || "PRO").toUpperCase();
    if (v === "FREE")
        return "LIVE";
    if (v === "CORE")
        return "CORE";
    return "PRO";
}
export default function Sidebar() {
    return (_jsxs("aside", { className: "hidden md:flex w-72 flex-col border-r border-white/10 bg-white/5", children: [_jsx("div", { className: "px-4 pt-5 pb-4", children: _jsxs(NavLink, { to: "/", className: "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition px-3 py-3", "aria-label": "Go to home", children: [_jsx("img", { src: LOGO_BY_ID["360"], alt: "Noxel360", className: "noxel-logo h-11 w-11", loading: "eager" }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-lg font-semibold tracking-wide leading-tight", children: "NOXEL360" }), _jsx("div", { className: "text-xs text-white/60 truncate", children: "Hub \u2022 Suite Dashboard" })] })] }) }), _jsxs("div", { className: "px-3 pb-3 space-y-1", children: [_jsxs(NavLink, { to: "/", end: true, className: ({ isActive }) => `${linkBase} ${isActive ? "bg-white/10" : "hover:bg-white/10"}`, children: [_jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-400" }), "Accueil"] }), _jsxs(NavLink, { to: "/pricing", className: ({ isActive }) => `${linkBase} ${isActive ? "bg-white/10" : "hover:bg-white/10"}`, children: [_jsx("span", { className: "h-2 w-2 rounded-full bg-fuchsia-300/80" }), "Pricing"] })] }), _jsx("div", { className: "px-4 pb-2 text-xs text-white/50", children: "Modules" }), _jsx("nav", { className: "flex-1 px-3 pb-4 space-y-1 overflow-auto", children: MODULES.map((m) => {
                    const badge = tierLabel(m.minTier);
                    return (_jsxs(NavLink, { to: m.route, className: ({ isActive }) => `${linkBase} ${isActive ? "bg-white/10" : "hover:bg-white/10"}`, "aria-label": `Open ${m.name}`, children: [_jsx("img", { src: LOGO_BY_ID[m.id] || LOGO_BY_ID["360"], alt: "", className: "h-6 w-6 opacity-90", style: { objectFit: "contain" }, loading: "lazy" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "font-medium truncate", children: m.name }), _jsxs("div", { className: "text-[11px] text-white/50", children: ["Tier ", String(m.minTier || "PRO").toUpperCase()] })] }), _jsx("span", { className: [
                                    "text-[10px] rounded-full border px-2 py-1",
                                    badge === "LIVE"
                                        ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                                        : badge === "CORE"
                                            ? "border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-200"
                                            : "border-white/10 bg-white/5 text-white/70",
                                ].join(" "), children: badge })] }, m.id));
                }) }), _jsxs("div", { className: "px-4 py-4 border-t border-white/10", children: [_jsx("div", { className: "text-xs text-white/60", children: "Status" }), _jsx("div", { className: "text-xs text-emerald-300", children: "Online \u2022 Local dev" })] })] }));
}
