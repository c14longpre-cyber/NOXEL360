import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import HeaderLanguage from "./HeaderLanguage";
import UserMenu from "./UserMenu";
import { useI18n } from "../useI18n";
/**
 * En-tête commun NOXEL (noxel-shell.css), sur le modèle de NOXEL SEO :
 * logo · menu · langue · compte. Même barre que NOXEL FORGE et NOXEL SPECTRA.
 */
export default function NoxelTopbar() {
    const { t } = useI18n();
    const { pathname } = useLocation();
    const [navOpen, setNavOpen] = useState(false);
    const barRef = useRef(null);
    useEffect(() => {
        if (!navOpen)
            return;
        const onKey = (e) => { if (e.key === "Escape")
            setNavOpen(false); };
        const onDown = (e) => {
            if (barRef.current && !barRef.current.contains(e.target))
                setNavOpen(false);
        };
        document.addEventListener("keydown", onKey);
        document.addEventListener("pointerdown", onDown);
        return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); };
    }, [navOpen]);
    const current = (p) => (pathname === p || pathname.startsWith(p + "/") ? "page" : undefined);
    return (_jsxs("header", { ref: barRef, className: "nx-bar", children: [_jsx(Link, { to: "/dashboard", className: "nx-bar__brand", "aria-label": "NOXEL360", children: _jsx("img", { src: "/logos/NOXEL_360_LOGO.svg", alt: "NOXEL360", className: "nx-bar__logo" }) }), _jsxs("nav", { id: "nx-360-nav", className: "nx-bar__nav", "data-open": navOpen, "aria-label": "NOXEL360", children: [_jsx(Link, { to: "/dashboard", className: "nx-nav", "aria-current": current("/dashboard"), onClick: () => setNavOpen(false), children: t("dashboard.title") }), _jsx(Link, { to: "/nexus", className: "nx-nav", "aria-current": current("/nexus"), onClick: () => setNavOpen(false), children: "NOXEL NEXUS" }), _jsx("a", { href: "/learn/", className: "nx-nav", children: t("landing.nav.learn") }), _jsx("a", { href: "/pricing/", className: "nx-nav", children: t("landing.nav.pricing") })] }), _jsxs("div", { className: "nx-bar__right", children: [_jsx(HeaderLanguage, {}), _jsx(UserMenu, {}), _jsx("button", { type: "button", className: "nx-bar__burger", "aria-label": "Menu", "aria-expanded": navOpen, "aria-controls": "nx-360-nav", onClick: () => setNavOpen(o => !o), children: _jsx("span", { "aria-hidden": "true", children: navOpen ? "✕" : "☰" }) })] })] }));
}
