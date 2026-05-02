import React from "react";
import { Link } from "react-router-dom";
import { MODULES, type ModuleItem } from "@/app/modules/registry";
import { LOGO_BY_ID } from "@/app/modules/logos";

function tierLabel(t: ModuleItem["minTier"]): "LIVE" | "PRO" | "CORE" {
  const v = String(t || "PRO").toUpperCase();
  if (v === "FREE") return "LIVE";
  if (v === "CORE") return "CORE";
  return "PRO";
}

function tierSubtitle(t: ModuleItem["minTier"]): string {
  const v = String(t || "PRO").toUpperCase();
  if (v === "FREE") return "Tier min: BRONZE • Interne";
  if (v === "CORE") return "Tier min: CORE • Interne";
  return "Tier min: PRO • Interne";
}

export default function DashboardModules() {
  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-xl font-semibold">Modules</h2>
        <p className="mt-1 text-sm text-white/60">
          Ton cockpit central. Accès selon ton forfait.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => {
            const badge = tierLabel(m.minTier);

            return (
              <Link
                key={m.id}
                to={m.route}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/20 hover:bg-white/8"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={LOGO_BY_ID[m.id] || LOGO_BY_ID["360"]}
                    alt=""
                    className="h-12 w-12 shrink-0 opacity-95"
                    style={{ objectFit: "contain" }}
                    loading="lazy"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-base font-semibold">{m.name}</div>
                      <span
                        className={[
                          "shrink-0 rounded-full border px-2 py-0.5 text-[10px]",
                          badge === "LIVE"
                            ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                            : badge === "CORE"
                            ? "border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-200"
                            : "border-white/10 bg-white/5 text-white/70",
                        ].join(" ")}
                      >
                        {badge}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-white/60">
                      {tierSubtitle(m.minTier)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-emerald-300/90 opacity-0 transition group-hover:opacity-100">
                  Ouvrir →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}


