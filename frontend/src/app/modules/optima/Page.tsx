import ModuleShell from "../ModuleShell";

export default function OptimaPage() {
  return (
    <ModuleShell
      activeKey="optima"
      badge="PRO"
      kicker="NOXEL OPTIMA"
      title="Image optimization and media performance layer"
      subtitle="Convert, compress, and prepare media assets for high-performance storefronts, workflows, and client-ready outputs."
      kpis={[
        {
          label: "Files processed",
          value: "28.4k",
          hint: "Total handled media",
        },
        {
          label: "Avg reduction",
          value: "63%",
          hint: "Median savings",
        },
        {
          label: "Formats",
          value: "6",
          hint: "Output coverage",
        },
        {
          label: "Queues",
          value: "9",
          hint: "Batch pipelines",
        }
      ]}
      cards={[
        {
          title: "Media compression",
          text: "Optimize images and media files while protecting useful quality and delivery speed.",
          bullets: [
            "Compression",
            "Conversion",
            "Performance"
          ],
        },
        {
          title: "Output quality",
          text: "Control export quality, format choice, and media standards across all workflows.",
          bullets: [
            "Quality control",
            "Format rules",
            "Standards"
          ],
        },
        {
          title: "Optimization queue",
          text: "Prepare batch actions, AI-assisted suggestions, and operational media flows for future expansion.",
          bullets: [
            "Batch actions",
            "Suggestions",
            "Workflow queue"
          ],
        }
      ]}
    />
  );
}
