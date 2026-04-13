import ModuleShell from "../ModuleShell";

export default function AnalyticsPage() {
  return (
    <ModuleShell
      activeKey="analytics"
      badge="PRO"
      kicker="NOXEL ANALYTICS"
      title="Performance, behavior, and business insight layer"
      subtitle="Measure what visitors do, understand why they act, and surface the next best decisions across traffic, engagement, conversion, and revenue."
      kpis={[
        {
          label: "Active sessions",
          value: "12.4k",
          hint: "Last 7 days",
        },
        {
          label: "Engagement",
          value: "64.2%",
          hint: "Quality traffic signal",
        },
        {
          label: "Intent",
          value: "28.7%",
          hint: "High-intent visitors",
        },
        {
          label: "Revenue influence",
          value: ".9k",
          hint: "Tracked impact",
        }
      ]}
      cards={[
        {
          title: "Performance overview",
          text: "Track sessions, engagement, conversion intent, and revenue influence in one clean cockpit.",
          bullets: [
            "Sessions",
            "Engagement",
            "Revenue influence"
          ],
        },
        {
          title: "Behavior funnel",
          text: "Read how visitors move from discovery to action, then prioritize where friction should be reduced.",
          bullets: [
            "Visit → intent",
            "Drop-off points",
            "Priority actions"
          ],
        },
        {
          title: "AI insight stream",
          text: "Surface recommendations, anomalies, and opportunities that can later connect to SEO, CRM, and Maestro.",
          bullets: [
            "Recommendations",
            "Anomalies",
            "Cross-module signals"
          ],
        }
      ]}
    />
  );
}
