import ModuleShell from "../ModuleShell";

export default function MaestroPage() {
  return (
    <ModuleShell
      activeKey="maestro"
      badge="CORE"
      kicker="NOXEL MAESTRO"
      title="The orchestration layer connecting modules and actions"
      subtitle="Unify insights, triggers, and shared intelligence across modules so Noxel can act like one connected system."
      kpis={[
        {
          label: "Connected modules",
          value: "11",
          hint: "Shared orchestration scope",
        },
        {
          label: "Queued actions",
          value: "58",
          hint: "Pending execution",
        },
        {
          label: "Automations",
          value: "24",
          hint: "Active rules",
        },
        {
          label: "Decisions",
          value: "312",
          hint: "Recent routed actions",
        }
      ]}
      cards={[
        {
          title: "Cross-module actions",
          text: "Coordinate movement between SEO, Analytics, CRM, and future modules with a single orchestration logic.",
          bullets: [
            "Shared actions",
            "Module coordination",
            "System logic"
          ],
        },
        {
          title: "Automation queue",
          text: "Manage triggers, tasks, and execution flows that connect insight to action.",
          bullets: [
            "Tasks",
            "Triggers",
            "Execution flow"
          ],
        },
        {
          title: "Decision engine",
          text: "Prepare for intelligent routing, prioritization, and recommendation logic across the platform.",
          bullets: [
            "Priorities",
            "Recommendations",
            "Decision rules"
          ],
        }
      ]}
    />
  );
}
