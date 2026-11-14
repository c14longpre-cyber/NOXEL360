import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import "../nx-search.js";
export default function NxSearch({ navigate, index, lang }) {
    const ref = useRef(null);
    const nav = useRef(navigate);
    nav.current = navigate;
    useEffect(() => {
        if (!ref.current)
            return;
        const api = window.NoxelSearch?.mount(ref.current, { index, lang, navigate: (url) => nav.current?.(url) ?? false });
        return () => api?.destroy();
    }, [index, lang]);
    return _jsx("div", { ref: ref, className: "nx-search" });
}
