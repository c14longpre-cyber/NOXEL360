import { NavLink } from "react-router-dom";
import { useModulesIndex } from "../modules/useModulesIndex";

/**
 * NOXEL360 — SideNav (Module Host)
 * External modules (NOXEL SEO, NOXEL Forge) open their real domain in a new
 * tab. Internal modules (NOXEL Nexus) use React Router navigation.
 */
export function SideNav() {
  const items = useModulesIndex();

  return (
    <nav style={{ minHeight: 0, display: "flex", flexDirection: "column" }}>
      <div className="nav-group" aria-label="Modules">
        {items.map((m) => {
          const badge = (m.status ?? "missing").toUpperCase();

          const pillClass =
            badge === "READY"
              ? "pill pill--live"
              : badge === "CORE"
              ? "pill pill--core"
              : "pill pill--pro";

          const pillLabel =
            badge === "READY" ? "LIVE" : badge === "CORE" ? "CORE" : "PRO";

          const content = (
            <>
              <div className="nav-row">
                <div className="nav-title">{m.name}</div>
                <span className={pillClass}>{pillLabel}</span>
              </div>
              <div className="nav-sub">{m.promise}</div>
            </>
          );

          if (m.external) {
            return (
              <a
                key={m.key}
                href={m.route}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-item"
                style={{ display: "block", textDecoration: "none" }}
              >
                {content}
              </a>
            );
          }

          return (
            <NavLink
              key={m.key}
              to={m.route}
              className={({ isActive }) => `nav-item ${isActive ? "is-active" : ""}`}
              style={{ display: "block", textDecoration: "none" }}
            >
              {content}
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
        Upgrade
      </button>
    </nav>
  );
}
