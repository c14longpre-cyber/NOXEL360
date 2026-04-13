import ModuleShell from "../ModuleShell";

export default function AtlasPage() {
  return (
    <ModuleShell
      activeKey="atlas"
      badge="PRO"
      kicker="NOXEL ATLAS"
      title="Geographic intelligence and market mapping"
      subtitle="Read markets visually, compare regions intelligently, and build a layered understanding of local and global opportunity."
      kpis={[
        {
          label: "Markets",
          value: "214",
          hint: "Country-level scope",
        },
        {
          label: "Regions",
          value: "1.8k",
          hint: "Layer-ready areas",
        },
        {
          label: "Overlays",
          value: "12",
          hint: "Audience + SEO views",
        },
        {
          label: "Opportunity zones",
          value: "86",
          hint: "Flagged for review",
        }
      ]}
      cards={[
        {
          title: "Market layers",
          text: "Structure geographic intelligence into readable layers that can later power segmentation and opportunity scoring.",
          bullets: [
            "Country reading",
            "Regional layers",
            "Market segmentation"
          ],
        },
        {
          title: "Regional opportunities",
          text: "Surface areas with stronger demand, weaker competition, or untapped expansion potential.",
          bullets: [
            "Opportunity zones",
            "Growth pockets",
            "Comparative reading"
          ],
        },
        {
          title: "Audience overlays",
          text: "Combine map visuals with real audience signals, intent data, and future local SEO intelligence.",
          bullets: [
            "Audience data",
            "Intent overlays",
            "Local SEO synergy"
          ],
        }
      ]}
    />
  );
}
