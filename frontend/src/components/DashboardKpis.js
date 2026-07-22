import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const TrendIcon = ({ t }) => {
    if (t === "up")
        return _jsx("span", { className: "text-emerald-400", children: "\u25B2" });
    if (t === "down")
        return _jsx("span", { className: "text-rose-400", children: "\u25BC" });
    if (t === "flat")
        return _jsx("span", { className: "text-slate-400", children: "\u2022" });
    return null;
};
export default function DashboardKpis() {
    const kpis = [
        { label: "Global Score", value: "92", sub: "+3 this week", trend: "up", badge: "Excellent" },
        { label: "Performance", value: "Good", sub: "LCP 2.1s • INP 160ms", trend: "flat" },
        { label: "SEO Health", value: "7 issues", sub: "2 critical", trend: "down", badge: "Attention" },
        { label: "Audience Reach", value: "—", sub: "Atlas soon", trend: "flat" },
    ];
    return (_jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4", children: kpis.map((k) => (_jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm text-white/70", children: k.label }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(TrendIcon, { t: k.trend }), k.badge ? (_jsx("span", { className: "rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-xs text-white/80", children: k.badge })) : null] })] }), _jsx("div", { className: "mt-3 text-3xl font-semibold tracking-tight text-white", children: k.value }), k.sub ? _jsx("p", { className: "mt-1 text-xs text-white/60", children: k.sub }) : null] }, k.label))) }));
}
