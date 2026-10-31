import { Outlet } from "react-router-dom";
import { SideNav } from "./SideNav";

import NoxelTopbar from "@/components/NoxelTopbar";
import TranslationStatusBanner from "@/components/TranslationStatusBanner";

/**
 * NOXEL360 — Module Host (AppShell)
 * Keeps all /app/* pages visually aligned with dashboard tokens.
 */
export function AppShell() {
  const tier: "bronze" | "silver" | "gold" | "platinum" | "diamond" = "diamond";

  return (
    <div className="noxel-app" data-tier={tier}>
      <NoxelTopbar />

      <TranslationStatusBanner />

      <div className="noxel-body">
        <aside className="noxel-sidenav">
          <div
            style={{
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <SideNav />
          </div>
        </aside>

        <main className="noxel-main">
          <section
            className="noxel-landing"
            aria-label="Module content"
            style={{ minHeight: "100%", width: "100%" }}
          >
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}

