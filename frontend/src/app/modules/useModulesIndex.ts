import { useMemo } from "react";

export type ModuleStatus = "ready" | "core" | "pro" | "missing";

export type ModuleIndexItem = {
  key: string;
  name: string;
  route: string;
  promise: string;
  status: ModuleStatus;
  /** True if this module lives on its own domain (opens in a new tab, not an internal route). */
  external?: boolean;
};

/**
 * NOXEL360 — Module Index
 *
 * Simplified on purpose: NOXEL360 now links out to the real, live products
 * (NOXEL SEO, NOXEL Forge) instead of hosting internal duplicate clones.
 * NOXEL NEXUS is the only module with real functional code still living
 * inside this app, so it stays as an internal route.
 *
 * To add a future internal module: add an entry with external:false and a
 * real internal route. To add a future external product: external:true and
 * the full https:// URL as the route.
 */
const MODULE_ITEMS: ModuleIndexItem[] = [
  {
    key: "seo",
    name: "NOXEL SEO",
    route: "https://noxelseo.com",
    promise: "Search visibility, audits, and optimization intelligence.",
    status: "ready",
    external: true,
  },
  {
    key: "forge",
    name: "NOXEL FORGE",
    route: "https://noxelforge.com",
    promise: "Verified backlink exchange network for real, trusted sites.",
    status: "ready",
    external: true,
  },
  {
    key: "nexus",
    name: "NOXEL NEXUS",
    route: "/nexus",
    promise: "Language, region, and cultural intelligence engine.",
    status: "core",
    external: false,
  },
];

export function useModulesIndex(): ModuleIndexItem[] {
  return useMemo(() => MODULE_ITEMS, []);
}
