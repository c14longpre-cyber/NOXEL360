import { NavLink } from "react-router-dom";
import { useModulesIndex } from "../modules/useModulesIndex";
import { useI18n } from "../../useI18n";

/**
 * NOXEL360 — SideNav (Module Host)
 * Goal: visually identical to Dashboard sidenav (uses index.css classes).
 * Note: sub-options are intentionally placeholders for now.
 */
export function SideNav() {
  const items = useModulesIndex();
  const { t } = useI18n();

  return (
    <nav style={{ minHeight: 0, display: "flex", flexDirection: "column" }}>
      <div className="nav-group" aria-label={t("dashboard.modules")}>
        {items.map((m) => {
          const badge = (m.status ?? "missing").toUpperCase();

          const pillClass =
            badge === "READY"
              ? "pill pill--live"
              : badge === "CORE"
              ? "pill pill--core"
              : "pill pill--pro";

          const pillLabel =
            badge === "READY"
              ? "LIVE"
              : badge === "CORE"
              ? "CORE"
              : "PRO";

          return (
            <NavLink
              key={m.key}
              to={m.route}
              className={({ isActive }) =>
                `nav-item ${isActive ? "is-active" : ""}`
              }
              style={{
                display: "block",
                textDecoration: "none",
              }}
            >
              <div className="nav-row">
                <div className="nav-title">{t(m.nameKey)}</div>
                <span className={pillClass}>{pillLabel}</span>
              </div>

              <div className="nav-sub">
                {m.promiseKey
                  ? t(m.promiseKey)
                  : t("modules.common.comingSoon")}
              </div>
            </NavLink>
          );
        })}
      </div>

      <button
        className="nav-cta"
        style={{ marginTop: 12 }}
        onClick={() => {
          window.location.href = "/pricing/index.html";
        }}
      >
        {t("dashboard.sidenav.upgrade")}
      </button>
    </nav>
  );
}