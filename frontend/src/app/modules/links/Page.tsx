import ModuleShell from "../ModuleShell";

export default function LinksPage() {
  return (
    <ModuleShell
      activeKey="links"
      badge="PRO"
      kicker="NOXEL LINKS"
      title="Link structure, hygiene, and opportunity management"
      subtitle="Keep internal and external link ecosystems clean, strategic, and ready to support search visibility and site health."
      kpis={[
        {
          label: "Pages mapped",
          value: "3.2k",
          hint: "Internal structure read",
        },
        {
          label: "Broken links",
          value: "47",
          hint: "Needs cleanup",
        },
        {
          label: "Redirect chains",
          value: "19",
          hint: "Flagged",
        },
        {
          label: "New opportunities",
          value: "134",
          hint: "Suggested connections",
        }
      ]}
      cards={[
        {
          title: "Internal structure",
          text: "Understand how pages connect, where authority flows, and where the internal architecture weakens.",
          bullets: [
            "Internal links",
            "Authority flow",
            "Structure mapping"
          ],
        },
        {
          title: "Redirect control",
          text: "Find broken paths, redirect chains, and hygiene issues before they hurt crawlability and UX.",
          bullets: [
            "Broken links",
            "Redirect chains",
            "Hygiene checks"
          ],
        },
        {
          title: "Opportunity graph",
          text: "Identify link opportunities, reinforcement points, and strategic pathways for stronger site architecture.",
          bullets: [
            "Opportunity signals",
            "Link suggestions",
            "Priority fixes"
          ],
        }
      ]}
    />
  );
}
