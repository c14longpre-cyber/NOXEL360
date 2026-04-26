import { useMemo } from "react";
import { orderedLandingKeys } from "../host/landingRegistry";

export type ModuleStatus = "ready" | "core" | "pro" | "missing";

export type ModuleIndexItem = {
  key: string;
  nameKey: string;
  route: string;
  promiseKey: string;
  status: ModuleStatus;
};

const MODULE_META: Record<string, Omit<ModuleIndexItem, "key">> = {
  analytics: {
    nameKey: "modules.analytics.name",
    route: "/app/analytics",
    promiseKey: "modules.analytics.promise",
    status: "pro",
  },
  atlas: {
    nameKey: "modules.atlas.name",
    route: "/app/atlas",
    promiseKey: "modules.atlas.promise",
    status: "pro",
  },
  crm: {
    nameKey: "modules.crm.name",
    route: "/app/crm",
    promiseKey: "modules.crm.promise",
    status: "pro",
  },
  flow: {
    nameKey: "modules.flow.name",
    route: "/app/flow",
    promiseKey: "modules.flow.promise",
    status: "pro",
  },
  links: {
    nameKey: "modules.links.name",
    route: "/app/links",
    promiseKey: "modules.links.promise",
    status: "pro",
  },
  maestro: {
    nameKey: "modules.maestro.name",
    route: "/app/maestro",
    promiseKey: "modules.maestro.promise",
    status: "core",
  },
  morph: {
    nameKey: "modules.morph.name",
    route: "/app/morph",
    promiseKey: "modules.morph.promise",
    status: "pro",
  },
  nexus: {
    nameKey: "modules.nexus.name",
    route: "/nexus",
    promiseKey: "modules.nexus.promise",
    status: "core",
  },
  optima: {
    nameKey: "modules.optima.name",
    route: "/app/optima",
    promiseKey: "modules.optima.promise",
    status: "pro",
  },
  seo: {
    nameKey: "modules.seo.name",
    route: "/app/seo",
    promiseKey: "modules.seo.promise",
    status: "ready",
  },
  social: {
    nameKey: "modules.social.name",
    route: "/app/social",
    promiseKey: "modules.social.promise",
    status: "pro",
  },
};

export function useModulesIndex(): ModuleIndexItem[] {
  return useMemo(() => {
    return orderedLandingKeys.map((key) => {
      const meta = MODULE_META[key];

      if (!meta) {
        return {
          key,
          nameKey: `modules.${key}.name`,
          route: `/app/${key}`,
          promiseKey: "modules.common.comingSoon",
          status: "missing" as const,
        };
      }

      return {
        key,
        ...meta,
      };
    });
  }, []);
}