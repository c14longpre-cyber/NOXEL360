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
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setNavOpen(false); };
    const onDown = (e: PointerEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); };
  }, [navOpen]);

  const current = (p: string) => (pathname === p || pathname.startsWith(p + "/") ? "page" : undefined);

  return (
    <header ref={barRef} className="nx-bar">
      <Link to="/dashboard" className="nx-bar__brand" aria-label="NOXEL360">
        <img src="/logos/NOXEL_360_LOGO.svg" alt="NOXEL360" className="nx-bar__logo" />
      </Link>

      <nav id="nx-360-nav" className="nx-bar__nav" data-open={navOpen} aria-label="NOXEL360">
        <Link to="/dashboard" className="nx-nav" aria-current={current("/dashboard")} onClick={() => setNavOpen(false)}>{t("dashboard.title")}</Link>
        <Link to="/nexus" className="nx-nav" aria-current={current("/nexus")} onClick={() => setNavOpen(false)}>NOXEL NEXUS</Link>
        <a href="/learn/" className="nx-nav">{t("landing.nav.learn")}</a>
        <a href="/pricing/" className="nx-nav">{t("landing.nav.pricing")}</a>
      </nav>

      <div className="nx-bar__right">
        <HeaderLanguage />
        <UserMenu />
        <button type="button" className="nx-bar__burger" aria-label="Menu" aria-expanded={navOpen} aria-controls="nx-360-nav" onClick={() => setNavOpen(o => !o)}>
          <span aria-hidden="true">{navOpen ? "✕" : "☰"}</span>
        </button>
      </div>
    </header>
  );
}
