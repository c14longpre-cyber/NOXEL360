
export type Tier = "FREE" | "PRO" | "CORE";

export type ModuleItem = {
  id: string;
  name: string;
  route: string;
  minTier?: Tier;
};

export const MODULES: ModuleItem[] = [
  { id: "analytics", name: "Noxel Analytics", route: "/app/analytics", minTier: "PRO" },
  { id: "atlas", name: "Noxel Atlas", route: "/app/atlas", minTier: "PRO" },
  { id: "crm", name: "Noxel CRM", route: "/app/crm", minTier: "PRO" },
  { id: "flow", name: "Noxel Flow", route: "/app/flow", minTier: "PRO" },
  { id: "links", name: "Noxel Links", route: "/app/links", minTier: "PRO" },
  { id: "maestro", name: "Noxel Maestro", route: "/app/maestro", minTier: "CORE" },
  { id: "morph", name: "Visual Morph™", route: "/app/morph", minTier: "PRO" },
  { id: "nexus", name: "Noxel Nexus", route: "/app/nexus", minTier: "CORE" },
  { id: "optima", name: "Noxel Optima", route: "/app/optima", minTier: "PRO" },
  { id: "seo", name: "Noxel SEO", route: "/app/seo", minTier: "FREE" },
  { id: "social", name: "Noxel Social", route: "/app/social", minTier: "PRO" }
];


