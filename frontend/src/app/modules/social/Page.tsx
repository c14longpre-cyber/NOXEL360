import ModuleShell from "../ModuleShell";

export default function SocialPage() {
  return (
    <ModuleShell
      activeKey="social"
      badge="PRO"
      kicker="NOXEL SOCIAL"
      title="Social presence, content, and audience intelligence"
      subtitle="Plan, structure, and improve social execution with stronger content visibility, timing, and audience reading."
      kpis={[
        {
          label: "Planned posts",
          value: "146",
          hint: "Queued content",
        },
        {
          label: "Campaigns",
          value: "17",
          hint: "Active themes",
        },
        {
          label: "Engagement lift",
          value: "+12%",
          hint: "Rolling estimate",
        },
        {
          label: "Templates",
          value: "34",
          hint: "Reusable formats",
        }
      ]}
      cards={[
        {
          title: "Content planning",
          text: "Build a reliable publishing structure with better visibility over themes, campaigns, and timing.",
          bullets: [
            "Calendars",
            "Campaigns",
            "Content structure"
          ],
        },
        {
          title: "Audience momentum",
          text: "Read engagement shifts, attention patterns, and audience response across channels.",
          bullets: [
            "Engagement",
            "Momentum",
            "Audience signals"
          ],
        },
        {
          title: "Publishing workflow",
          text: "Prepare approval steps, templates, and guided next actions for consistent execution.",
          bullets: [
            "Approvals",
            "Templates",
            "Execution flow"
          ],
        }
      ]}
    />
  );
}
