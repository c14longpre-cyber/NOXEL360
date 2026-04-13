import ModuleShell from "../ModuleShell";

export default function CrmPage() {
  return (
    <ModuleShell
      activeKey="crm"
      badge="PRO"
      kicker="NOXEL CRM"
      title="Customer relationship and lifecycle intelligence"
      subtitle="Manage internal operations and client-facing workflows from one relationship system built for clarity, follow-up, and growth."
      kpis={[
        {
          label: "Active clients",
          value: "148",
          hint: "Tracked accounts",
        },
        {
          label: "Open deals",
          value: "37",
          hint: "Pipeline stage mix",
        },
        {
          label: "Tasks",
          value: "92",
          hint: "Pending actions",
        },
        {
          label: "Retention",
          value: "91%",
          hint: "Rolling estimate",
        }
      ]}
      cards={[
        {
          title: "Pipeline health",
          text: "Track deal stages, relationship momentum, and visibility across active accounts and internal operations.",
          bullets: [
            "Deal stages",
            "Status tracking",
            "Pipeline visibility"
          ],
        },
        {
          title: "Client activity",
          text: "Read interactions, touchpoints, changes, and account history in one organized timeline.",
          bullets: [
            "Interactions",
            "Notes",
            "History"
          ],
        },
        {
          title: "Lifecycle actions",
          text: "Prepare automations, reminders, follow-ups, and AI-guided next actions across the client journey.",
          bullets: [
            "Automations",
            "Follow-ups",
            "Next best action"
          ],
        }
      ]}
    />
  );
}
