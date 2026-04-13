import { useMemo } from "react";
import { orderedLandingKeys } from "../host/landingRegistry";

export type ModuleStatus = "ready" | "core" | "pro" | "missing";

export type ModuleIndexItem = {
  key: string;
  name: string;
  route: string;
  promise: string;
  status: ModuleStatus;
};

const MODULE_META: Record<string, Omit<ModuleIndexItem, "key">> = {
  analytics: {
    name: "NOXEL ANALYTICS",
    route: "/app/analytics",
    promise: "Performance, behavior, and business insight layer.",
    status: "pro",
  },
  atlas: {
    name: "NOXEL ATLAS",
    route: "/app/atlas",
    promise: "Geographic intelligence and market mapping.",
    status: "pro",
  },
  crm: {
    name: "NOXEL CRM",
    route: "/app/crm",
    promise: "Customer relationship and lifecycle intelligence.",
    status: "pro",
  },
  flow: {
    name: "NOXEL FLOW",
    route: "/app/flow",
    promise: "Theme, layout, and presentation system.",
    status: "pro",
  },
  links: {
    name: "NOXEL LINKS",
    route: "/app/links",
    promise: "Link structure, hygiene, and opportunity management.",
    status: "pro",
  },
  maestro: {
    name: "NOXEL MAESTRO",
    route: "/app/maestro",
    promise: "The orchestration layer connecting modules and actions.",
    status: "core",
  },
  morph: {
    name: "NOXEL MORPH",
    route: "/app/morph",
    promise: "Adaptive visual and interface personalization engine.",
    status: "pro",
  },
  nexus: {
    name: "NOXEL NEXUS",
    route: "/app/nexus",
    promise: "Language, region, and cultural intelligence engine.",
    status: "core",
  },
  optima: {
    name: "NOXEL OPTIMA",
    route: "/app/optima",
    promise: "Image optimization and media performance layer.",
    status: "pro",
  },
  seo: {
    name: "NOXEL SEO",
    route: "/app/seo",
    promise: "Search visibility, audits, and optimization intelligence.",
    status: "ready",
  },
  social: {
    name: "NOXEL SOCIAL",
    route: "/app/social",
    promise: "Social presence, content, and audience intelligence.",
    status: "pro",
  },
};

export function useModulesIndex(): ModuleIndexItem[] {
  return useMemo(
    () =>
      orderedLandingKeys.map((key) => {
        const meta = MODULE_META[key];

        if (!meta) {
          return {
            key,
            name: `NOXEL ${key.toUpperCase()}`,
            route: `/app/${key}`,
            promise: "Landing scaffold (details coming soon).",
            status: "missing" as const,
          };
        }

        return {
          key,
          ...meta,
        };
      }),
    []
  );
}
