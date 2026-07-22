import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export default function SiteScanBar() {
    const [url, setUrl] = useState("https://");
    const runScan = async () => {
        try {
            // plus tard: appel backend /api/scan avec url
            console.log("SCAN URL:", url);
            alert(`Scan lancé pour: ${url}`);
        }
        catch (e) {
            console.error(e);
            alert("Erreur scan (voir console)");
        }
    };
    return (_jsx("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur", children: _jsxs("div", { className: "flex flex-col gap-3 md:flex-row md:items-center", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm font-semibold", children: "Analyser un site" }), _jsx("div", { className: "text-xs text-white/60", children: "Colle une URL et lance une analyse (SEO + Performance)." })] }), _jsxs("div", { className: "flex w-full flex-col gap-2 md:w-[520px] md:flex-row", children: [_jsx("input", { value: url, onChange: (e) => setUrl(e.target.value), placeholder: "https://exemple.com", className: "h-10 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-emerald-400/40" }), _jsx("button", { onClick: runScan, className: "h-10 rounded-xl border border-emerald-400/20 bg-emerald-500/15 px-4 text-sm text-emerald-200 hover:bg-emerald-500/20 transition", children: "Lancer analyse" })] })] }) }));
}
