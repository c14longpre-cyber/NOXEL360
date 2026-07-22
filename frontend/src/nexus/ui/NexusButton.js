import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNexusStore } from "../store/nexus.store";
export default function NexusButton() {
    const language = useNexusStore((s) => s.language);
    const country = useNexusStore((s) => s.country);
    const hydrate = useNexusStore((s) => s.hydrate);
    useEffect(() => {
        hydrate();
    }, [hydrate]);
    return (_jsxs("button", { type: "button", className: "nx-pill", title: "Nexus language selector", style: {
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(60,222,106,0.10)",
            color: "inherit",
            cursor: "pointer"
        }, children: [_jsx("span", { children: "\uD83C\uDF0D" }), _jsx("span", { children: country || "--" }), _jsx("span", { children: language.toUpperCase() })] }));
}
