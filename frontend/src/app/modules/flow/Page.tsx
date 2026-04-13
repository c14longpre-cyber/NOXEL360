import ModuleShell from "../ModuleShell";

export default function FlowPage() {
  return (
    <ModuleShell
      activeKey="flow"
      badge="PRO"
      kicker="NOXEL FLOW"
      title="Theme, layout, and presentation system"
      subtitle="Distribute polished visual systems, reusable themes, and modular presentation logic across the Noxel ecosystem."
      kpis={[
        {
          label: "Themes",
          value: "24",
          hint: "Reusable systems",
        },
        {
          label: "Components",
          value: "186",
          hint: "Shared building blocks",
        },
        {
          label: "Variants",
          value: "52",
          hint: "Layout options",
        },
        {
          label: "Deployments",
          value: "11",
          hint: "Active package outputs",
        }
      ]}
      cards={[
        {
          title: "Theme distribution",
          text: "Organize, manage, and ship reusable storefront and interface themes with consistency.",
          bullets: [
            "Theme packs",
            "Distribution",
            "Version control"
          ],
        },
        {
          title: "Component packs",
          text: "Build reusable design blocks and presentation elements that scale across products and clients.",
          bullets: [
            "Reusable UI",
            "Component sets",
            "Design consistency"
          ],
        },
        {
          title: "Presentation logic",
          text: "Control how layout systems behave, adapt, and render inside the broader Noxel experience.",
          bullets: [
            "Layout rules",
            "Display logic",
            "Presentation control"
          ],
        }
      ]}
    />
  );
}
