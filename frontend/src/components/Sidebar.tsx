import { NavLink } from "react-router-dom";
import { MODULES, type ModuleItem } from "@/app/modules/registry";
import { LOGO_BY_ID } from "@/app/modules/logos";
const linkBase =
  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition";

function tierLabel(t: ModuleItem["minTier"]): "LIVE" | "PRO" | "CORE" {
  const v = String(t || "PRO").toUpperCase();
  if (v === "FREE") return "LIVE";
  if (v === "CORE") return "CORE";
  return "PRO";
}

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-white/5">
      {/* Brand block */}
      <div className="px-4 pt-5 pb-4">
     <NavLink
  to="/"
  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition px-3 py-3"
  aria-label="Go to home"
>
  <img
    src={LOGO_BY_ID["360"]}
    alt="Noxel360"
    className="noxel-logo h-11 w-11"
    loading="eager"
  />

  <div className="min-w-0">
    <div className="text-lg font-semibold tracking-wide leading-tight">
      NOXEL360
    </div>
    <div className="text-xs text-white/60 truncate">
      Hub • Suite Dashboard
    </div>
  </div>
</NavLink>
      </div>

      {/* Main nav */}
      <div className="px-3 pb-3 space-y-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "bg-white/10" : "hover:bg-white/10"}`
          }
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Accueil
        </NavLink>

        <NavLink
          to="/pricing"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "bg-white/10" : "hover:bg-white/10"}`
          }
        >
          <span className="h-2 w-2 rounded-full bg-fuchsia-300/80" />
          Pricing
        </NavLink>
      </div>

      <div className="px-4 pb-2 text-xs text-white/50">Modules</div>

      <nav className="flex-1 px-3 pb-4 space-y-1 overflow-auto">
        {MODULES.map((m: ModuleItem) => {
          const badge = tierLabel(m.minTier);

          return (
            <NavLink
              key={m.id}
              to={m.route}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? "bg-white/10" : "hover:bg-white/10"}`
              }
              aria-label={`Open ${m.name}`}
            >
              {/* Module logo (small) */}
          <img
  src={LOGO_BY_ID[m.id] || LOGO_BY_ID["360"]}
  alt=""
  className="h-6 w-6 opacity-90"
  style={{ objectFit: "contain" }}
  loading="lazy"
/>

              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{m.name}</div>
                <div className="text-[11px] text-white/50">
                  Tier {String(m.minTier || "PRO").toUpperCase()}
                </div>
              </div>

              <span
                className={[
                  "text-[10px] rounded-full border px-2 py-1",
                  badge === "LIVE"
                    ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                    : badge === "CORE"
                    ? "border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-200"
                    : "border-white/10 bg-white/5 text-white/70",
                ].join(" ")}
              >
                {badge}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="text-xs text-white/60">Status</div>
        <div className="text-xs text-emerald-300">Online • Local dev</div>
      </div>
    </aside>
  );
}


