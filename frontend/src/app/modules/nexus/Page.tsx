import ModuleShell from "../ModuleShell";

export default function NexusPage() {
  return (
    <ModuleShell
      activeKey="nexus"
      badge="CORE"
      kicker="NOXEL NEXUS"
      title="Language, region, and cultural intelligence engine"
      subtitle="Resolve language, locale, and regional context across products so every module can adapt with more accuracy and relevance."
      kpis={[
        {
          label: "Languages",
          value: "30+",
          hint: "Supported resolution",
        },
        {
          label: "Regions",
          value: "240+",
          hint: "Country/market scope",
        },
        {
          label: "Locale rules",
          value: "118",
          hint: "Behavior logic",
        },
        {
          label: "Fallbacks",
          value: "94%",
          hint: "Coverage confidence",
        }
      ]}
      cards={[
        {
          title: "Language resolution",
          text: "Handle language preference matching, fallback behavior, and multilingual logic across the platform.",
          bullets: [
            "Language match",
            "Fallbacks",
            "Multilingual logic"
          ],
        },
        {
          title: "Region intelligence",
          text: "Connect country, market, and regional information to the broader user and business context.",
          bullets: [
            "Country data",
            "Region logic",
            "Context mapping"
          ],
        },
        {
          title: "Localization logic",
          text: "Prepare translation orchestration and culturally aware display behavior for global scalability.",
          bullets: [
            "Localization",
            "Translation flow",
            "Cultural adaptation"
          ],
        }
      ]}
    />
  );
}
