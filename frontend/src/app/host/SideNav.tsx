import { NavLink } from "react-router-dom";
import { useModulesIndex } from "../modules/useModulesIndex";

/**
 * NOXEL360 — SideNav (Module Host)
 * Goal: visually identical to Dashboard sidenav (uses index.css classes).
 * Note: sub-options are intentionally placeholders for now.
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

          // If you later add 'badge' in index.json, we can map it cleanly.
          const pillLabel = badge === "READY" ? "LIVE" : "PRO";

          return (
            <NavLink
              key={m.key}
              to={m.route}
              className={({ isActive }) =>
                `nav-item ${isActive ? "is-active" : ""}`
              }
              style={{
                // keep NavLink behaving like a button visually
                display: "block",
                textDecoration: "none",
              }}
            >
              <div className="nav-row">
                <div className="nav-title">{m.name}</div>
                <span className={pillClass}>{pillLabel}</span>
              </div>

              <div className="nav-sub">
                {m.promise ? m.promise : "Landing scaffold (details coming soon)."}
              </div>
            </NavLink>
          );
        })}
      </div>

      {/* Placeholder: later replaced by per-module sub-options */}
     

      {/* ✅ Fixed: valid JSX + correct href */}
      <button
  className="nav-cta"
  style={{ marginTop: 12 }}
  onClick={() => {
    window.location.href = "/pricing/index.html";
  }}
>
  Upgrade & Pricing
</button>
    </nav>
  );
}



