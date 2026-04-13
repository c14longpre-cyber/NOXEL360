import ModuleShell from "../ModuleShell";

export default function SeoPage() {
  return (
    <ModuleShell
      activeKey="seo"
      badge="LIVE"
      kicker="NOXEL SEO"
      title="Search visibility, audits, and optimization intelligence"
      subtitle="Read technical health, issues, scoring, and improvement opportunities in one clear SEO cockpit."
      kpis={[
        {
          label: "Health score",
          value: "84",
          hint: "Global site score",
        },
        {
          label: "Open issues",
          value: "126",
          hint: "All severities",
        },
        {
          label: "Recent scans",
          value: "18",
          hint: "Last 7 days",
        },
        {
          label: "Priority fixes",
          value: "21",
          hint: "High-impact items",
        }
      ]}
      cards={[
        {
          title: "Audit overview",
          text: "Track scans, health signals, issue families, and performance evolution in one optimization view.",
          bullets: [
            "Health score",
            "Scans",
            "Issue families"
          ],
        },
        {
          title: "Issue intelligence",
          text: "Group problems into technical, semantic, structured data, and crawl categories that are easier to act on.",
          bullets: [
            "Technical",
            "Semantic",
            "Crawl logic"
          ],
        },
        {
          title: "Optimization actions",
          text: "Prepare actions, recommendations, exports, and module handoffs to Analytics and Maestro.",
          bullets: [
            "Recommendations",
            "Exports",
            "Module handoffs"
          ],
        }
      ]}
    />
  );
}
