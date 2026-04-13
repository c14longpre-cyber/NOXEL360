import type { ComponentType } from "react";
import AnalyticsPage from "@/app/modules/analytics/AnalyticsPage";
import AtlasPage from "@/app/modules/atlas/AtlasPage";
import CrmPage from "@/app/modules/crm/CrmPage";
import FlowPage from "@/app/modules/flow/FlowPage";
import LinksPage from "@/app/modules/links/LinksPage";
import MaestroPage from "@/app/modules/maestro/MaestroPage";
import MorphPage from "@/app/modules/morph/MorphPage";
import NexusPage from "@/app/modules/nexus/NexusPage";
import OptimaPage from "@/app/modules/optima/OptimaPage";
import SeoPage from "@/app/modules/seo/SeoPage";
import SocialPage from "@/app/modules/social/SocialPage";

export const MODULE_COMPONENTS: Record<string, ComponentType> = {
  analytics: AnalyticsPage,
  atlas: AtlasPage,
  crm: CrmPage,
  flow: FlowPage,
  links: LinksPage,
  maestro: MaestroPage,
  morph: MorphPage,
  nexus: NexusPage,
  optima: OptimaPage,
  seo: SeoPage,
  social: SocialPage,
};
