import ModuleShell from "../ModuleShell";

export default function MorphPage() {
  return (
    <ModuleShell
      activeKey="morph"
      badge="PRO"
      kicker="NOXEL MORPH"
      title="Adaptive visual and interface personalization engine"
      subtitle="Apply controlled visual adaptation, language sensitivity, and preference logic without breaking the integrity of the experience."
      kpis={[
        {
          label: "Profiles",
          value: "1.1k",
          hint: "Saved preference sets",
        },
        {
          label: "Themes adapted",
          value: "42",
          hint: "Morph-ready outputs",
        },
        {
          label: "Consent rules",
          value: "18",
          hint: "Active logic blocks",
        },
        {
          label: "Reset actions",
          value: "73",
          hint: "User-controlled resets",
        }
      ]}
      cards={[
        {
          title: "Visual profile",
          text: "Store and apply user-approved display preferences across themes, interfaces, and future experiences.",
          bullets: [
            "Display profile",
            "Preference sets",
            "Adaptive visuals"
          ],
        },
        {
          title: "Preference memory",
          text: "Keep track of comfort, accessibility, and style choices that improve continuity over time.",
          bullets: [
            "Memory",
            "Comfort settings",
            "Continuity"
          ],
        },
        {
          title: "Adaptive interface",
          text: "Drive dynamic but controlled interface presentation through modular rules and consent-based logic.",
          bullets: [
            "Adaptive UI",
            "Consent logic",
            "Controlled variation"
          ],
        }
      ]}
    />
  );
}
