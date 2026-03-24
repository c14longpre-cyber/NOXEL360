import React from "react";
import { Link } from "react-router-dom";

type ModuleCard = {
  title: string;
  subtitle: string;
  href: string;
};

const modules: ModuleCard[] = [
  { title: "NOXEL MAESTRO", subtitle: "Tier min: BRONZE • Module externe", href: "/maestro" },
  { title: "NOXEL ATLAS", subtitle: "Tier min: BRONZE • Interne", href: "/atlas" },
  { title: "NOXEL SEO", subtitle: "Tier min: BRONZE • Interne", href: "/seo" },
  { title: "NOXEL SERP", subtitle: "Tier min: ARGENT • Interne", href: "/serp" },
  { title: "NOXEL VITALS", subtitle: "Tier min: BRONZE • Interne", href: "/vitals" },
  { title: "NOXEL WEBP", subtitle: "Tier min: BRONZE • Interne", href: "/webp" },
];

export default function DashboardModules() {
  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-xl font-semibold">Modules</h2>
        <p className="mt-1 text-sm text-white/60">
          Ton cockpit central. Accès selon ton forfait.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <Link
              key={m.title}
              to={m.href}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/20 hover:bg-white/8"
            >
              <div className="text-base font-semibold">{m.title}</div>
              <div className="mt-1 text-xs text-white/60">{m.subtitle}</div>
              <div className="mt-4 text-xs text-emerald-300/90 opacity-0 transition group-hover:opacity-100">
                Ouvrir →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
